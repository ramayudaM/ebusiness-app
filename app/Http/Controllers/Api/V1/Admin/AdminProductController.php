<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'variations'])
            ->withSum('variations as total_stock', 'stock_qty')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            }

            if ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $products = $query->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_sen' => ['required', 'integer', 'min:0'],
            'weight_gram' => ['required', 'integer', 'min:1'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
                'description' => $validated['description'] ?? null,
                'price_sen' => $validated['price_sen'],
                'weight_gram' => $validated['weight_gram'],
                'sku' => $validated['sku'],
                'is_bundle' => false,
                'is_active' => $validated['is_active'],
            ]);

            ProductVariation::create([
                'product_id' => $product->id,
                'name' => 'Default',
                'sku' => $validated['sku'] . '-DEFAULT',
                'price_sen' => null,
                'stock_qty' => $validated['stock_qty'],
                'is_active' => true,
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $path,
                    'sort_order' => 0,
                    'is_primary' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan.',
                'data' => $product->load(['category', 'images', 'variations']),
            ], 201);
        });
    }

    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product->load(['category', 'images', 'variations']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_sen' => ['required', 'integer', 'min:0'],
            'weight_gram' => ['required', 'integer', 'min:1'],
            'sku' => [
                'required',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($product->id),
            ],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        return DB::transaction(function () use ($validated, $request, $product) {
            $product->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'price_sen' => $validated['price_sen'],
                'weight_gram' => $validated['weight_gram'],
                'sku' => $validated['sku'],
                'is_active' => $validated['is_active'],
            ]);

            $variation = $product->variations()->first();

            if ($variation) {
                $variation->update([
                    'stock_qty' => $validated['stock_qty'],
                    'is_active' => true,
                ]);
            } else {
                ProductVariation::create([
                    'product_id' => $product->id,
                    'name' => 'Default',
                    'sku' => $validated['sku'] . '-DEFAULT',
                    'price_sen' => null,
                    'stock_qty' => $validated['stock_qty'],
                    'is_active' => true,
                ]);
            }

            if ($request->hasFile('image')) {
                $oldPrimary = $product->images()->where('is_primary', true)->first();

                if ($oldPrimary) {
                    Storage::disk('public')->delete($oldPrimary->url);
                    $oldPrimary->delete();
                }

                $path = $request->file('image')->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $path,
                    'sort_order' => 0,
                    'is_primary' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil diperbarui.',
                'data' => $product->fresh()->load(['category', 'images', 'variations']),
            ]);
        });
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    public function categories()
    {
        $categories = Category::orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'parent_id']);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}