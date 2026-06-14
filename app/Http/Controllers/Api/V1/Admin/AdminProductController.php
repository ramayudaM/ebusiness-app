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
            'variation_name' => ['nullable', 'string', 'max:255'],
            'variations' => ['nullable', 'array', 'min:1'],
            'variations.*.name' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.stock_qty' => ['required_with:variations', 'integer', 'min:0'],
            'price_sen' => ['required', 'integer', 'min:0'],
            'weight_gram' => ['required', 'integer', 'min:1'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'stock_qty' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048'],
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

            foreach ($this->normalizedVariations($validated) as $variation) {
                ProductVariation::create([
                    'product_id' => $product->id,
                    'name' => $variation['name'],
                    'sku' => $this->variationSku($validated['sku'], $variation['name']),
                    'price_sen' => null,
                    'stock_qty' => $variation['stock_qty'],
                    'is_active' => true,
                ]);
            }

            foreach ($this->storeProductImages($request, $product) as $index => $path) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $path,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
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
            'variation_name' => ['nullable', 'string', 'max:255'],
            'variations' => ['nullable', 'array', 'min:1'],
            'variations.*.id' => ['nullable', 'integer'],
            'variations.*.name' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.stock_qty' => ['required_with:variations', 'integer', 'min:0'],
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
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048'],
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

            $this->syncVariations($product, $validated);

            $newImagePaths = $this->storeProductImages($request, $product);

            if (!empty($newImagePaths)) {
                foreach ($product->images as $oldImage) {
                    Storage::disk('public')->delete($oldImage->url);
                    $oldImage->delete();
                }

                foreach ($newImagePaths as $index => $path) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'url' => $path,
                        'sort_order' => $index,
                        'is_primary' => $index === 0,
                    ]);
                }
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

    private function productImageDirectory(Product $product): string
    {
        return 'products/' . Str::slug($product->name);
    }

    private function variationName(array $validated): string
    {
        return trim($validated['variation_name'] ?? '') ?: 'Default';
    }

    private function normalizedVariations(array $validated): array
    {
        if (!empty($validated['variations'])) {
            return collect($validated['variations'])
                ->map(fn ($variation) => [
                    'id' => $variation['id'] ?? null,
                    'name' => trim($variation['name'] ?? '') ?: 'Default',
                    'stock_qty' => (int) ($variation['stock_qty'] ?? 0),
                ])
                ->values()
                ->all();
        }

        return [[
            'id' => null,
            'name' => $this->variationName($validated),
            'stock_qty' => (int) $validated['stock_qty'],
        ]];
    }

    private function syncVariations(Product $product, array $validated): void
    {
        $submittedIds = [];

        foreach ($this->normalizedVariations($validated) as $variationData) {
            $variation = null;

            if (!empty($variationData['id'])) {
                $variation = $product->variations()
                    ->whereKey($variationData['id'])
                    ->first();
            }

            if ($variation) {
                $variation->update([
                    'name' => $variationData['name'],
                    'sku' => $this->variationSku($validated['sku'], $variationData['name'], $variation->id),
                    'stock_qty' => $variationData['stock_qty'],
                    'is_active' => true,
                ]);

                $submittedIds[] = $variation->id;

                continue;
            }

            $newVariation = ProductVariation::create([
                'product_id' => $product->id,
                'name' => $variationData['name'],
                'sku' => $this->variationSku($validated['sku'], $variationData['name']),
                'price_sen' => null,
                'stock_qty' => $variationData['stock_qty'],
                'is_active' => true,
            ]);

            $submittedIds[] = $newVariation->id;
        }

        $product->variations()
            ->whereNotIn('id', $submittedIds)
            ->update(['is_active' => false]);
    }

    private function variationSku(string $productSku, string $variationName, ?int $ignoreId = null): string
    {
        $suffix = Str::upper(Str::slug($variationName)) ?: 'DEFAULT';
        $base = Str::limit($productSku . '-' . $suffix, 92, '');
        $sku = $base;
        $counter = 2;

        while (
            ProductVariation::where('sku', $sku)
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->exists()
        ) {
            $sku = Str::limit($base, 92 - strlen((string) $counter), '') . '-' . $counter;
            $counter++;
        }

        return $sku;
    }

    private function storeProductImages(Request $request, Product $product): array
    {
        $files = $request->file('images', []);

        if ($request->hasFile('image')) {
            $files = array_merge($files, [$request->file('image')]);
        }

        return collect($files)
            ->filter()
            ->map(fn ($file) => $this->storeProductImageFile($file, $product))
            ->values()
            ->all();
    }

    private function storeProductImageFile($file, Product $product): string
    {
        $directory = $this->productImageDirectory($product);
        $filename = $file->hashName();
        $path = $directory . '/' . $filename;

        $storedPath = $file->storeAs($directory, $filename, 'public');

        if ($storedPath) {
            return $storedPath;
        }

        if (Storage::disk('public')->exists($path)) {
            return $path;
        }

        throw new \RuntimeException('Gambar produk gagal disimpan.');
    }
}
