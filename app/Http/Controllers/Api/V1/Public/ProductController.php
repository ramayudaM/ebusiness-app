<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'variations' => function($q) {
            $q->where('is_active', true);
        }])->where('is_active', true);

        // Filter by Search text
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                // For PostgreSQL, use ilike for case-insensitive search
                $q->where('name', 'ilike', '%' . $search . '%')
                  ->orWhere('description', 'ilike', '%' . $search . '%');
            });
        }

        // Filter by Category
        if ($request->filled('category')) {
            $category = $request->category;
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        // Filter by Price Bounds
        if ($request->filled('min_price')) {
            $query->where('price_sen', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_sen', '<=', $request->max_price);
        }

        // Filter out of stock products
        if ($request->boolean('in_stock')) {
            $query->whereHas('variations', function ($q) {
                $q->where('stock_qty', '>', 0)->where('is_active', true);
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $allowedSorts = ['created_at', 'price_sen', 'name', 'average_rating'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 12);
        
        // Return 404 cleanly on out of bounds pages manually if needed, but pagination does it fine.
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    public function show($slug)
    {
        $product = Product::with([
            'category', 
            'images', 
            'media', 
            'variations' => function($q) {
                $q->where('is_active', true);
            },
            'reviews' => function($q) {
                $q->latest()->take(5); // Bring only recent reviews initially or adjust.
            },
            'reviews.user:id,name,avatar'
        ])
        ->where('is_active', true)
        ->where('slug', $slug)
        ->first();
        
        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Product not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }
}
