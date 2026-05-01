<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    /**
     * Get data for homepage (hero, categories, flash_sale, new_arrivals).
     */
    public function index(): JsonResponse
    {
        try {
            // 1. Hero Banner
            $hero = [
                'title' => 'Dengar. Beli. Bermain.',
                'subtitle' => 'Kurasi instrumen musik pilihan dari maestro untuk inspirasi tanpa batas dalam setiap nada yang Anda ciptakan.',
                'image_url' => '/images/hero-banner.jpg',
                'cta_text' => 'Mulai Belanja',
                'cta_link' => '/products'
            ];

            // 2. Categories
            $categories = Category::select('id', 'name', 'slug', 'parent_id')
                ->whereNull('parent_id')
                
                ->get();

            // 3. Flash Sale (Fallback to most reviewed since no promo cols)
            $flashSale = Product::with(['images' => function($q) {
                    $q->where('is_primary', true)->orWhere('sort_order', 1);
                }])
                
                ->withCount(['reviews', 'variations'])
                ->orderBy('reviews_count', 'desc')
                ->take(4)
                ->get()
                ->map(fn($product) => $this->formatProduct($product));

            // 4. New Arrivals
            $newArrivals = Product::with(['images' => function($q) {
                    $q->where('is_primary', true)->orWhere('sort_order', 1);
                }])
                
                ->withCount('variations')
                ->orderBy('created_at', 'desc')
                ->take(4)
                ->get()
                ->map(fn($product) => $this->formatProduct($product));

            return response()->json([
                'success' => true,
                'data' => [
                    'hero' => $hero,
                    'categories' => $categories,
                    'flash_sale' => $flashSale,
                    'new_arrivals' => $newArrivals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load homepage data.',
                'code' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function formatProduct(Product $product): array
    {
        $primaryImage = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
        
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price_sen' => $product->price_sen,
            'promo_price_sen' => null,
            'primary_image_url' => $primaryImage ? $primaryImage->url : null,
            'average_rating' => (float)($product->average_rating ?? 0),
            'review_count' => (int)($product->reviews_count ?? 0),
            'is_active' => $product->is_active
            ,'variations_count' => (int)($product->variations_count ?? 0)
        ];
    }
}
