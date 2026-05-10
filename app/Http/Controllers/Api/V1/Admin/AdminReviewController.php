<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::query()
            ->with(['user', 'product'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('review_text', 'ilike', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    })
                    ->orWhereHas('product', function ($productQuery) use ($search) {
                        $productQuery->where('name', 'ilike', "%{$search}%")
                            ->orWhere('sku', 'ilike', "%{$search}%");
                    });
            });
        }

        if ($request->filled('rating')) {
            $query->where('rating', (int) $request->rating);
        }

        if ($request->filled('visibility')) {
            if ($request->visibility === 'visible') {
                $query->where('is_visible', true);
            }

            if ($request->visibility === 'hidden') {
                $query->where('is_visible', false);
            }
        }

        $reviews = $query->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'summary' => [
                'total_reviews' => Review::count(),
                'visible_reviews' => Review::where('is_visible', true)->count(),
                'hidden_reviews' => Review::where('is_visible', false)->count(),
                'average_rating' => round((float) Review::avg('rating'), 1),
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function updateVisibility(Request $request, Review $review)
    {
        $validated = $request->validate([
            'is_visible' => ['required', 'boolean'],
        ]);

        $review->update([
            'is_visible' => $validated['is_visible'],
        ]);

        return response()->json([
            'success' => true,
            'message' => $validated['is_visible']
                ? 'Ulasan berhasil ditampilkan.'
                : 'Ulasan berhasil disembunyikan.',
            'data' => $review->fresh()->load(['user', 'product']),
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil dihapus.',
        ]);
    }
}