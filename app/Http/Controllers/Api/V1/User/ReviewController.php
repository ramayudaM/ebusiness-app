<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = Order::where('user_id', Auth::id())
            ->with('items')
            ->findOrFail($validated['order_id']);

        if (!in_array($order->status, ['DELIVERED', 'COMPLETED'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Ulasan hanya dapat diberikan setelah pesanan selesai.',
            ], 422);
        }

        $hasProduct = $order->items->contains(
            fn ($item) => (int) $item->product_id === (int) $validated['product_id']
        );

        if (!$hasProduct) {
            return response()->json([
                'success' => false,
                'message' => 'Produk ini tidak ditemukan pada pesanan tersebut.',
            ], 422);
        }

        $alreadyReviewed = Review::where('user_id', Auth::id())
            ->where('order_id', $order->id)
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'success' => false,
                'message' => 'Produk ini sudah pernah diulas untuk pesanan tersebut.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'order_id' => $order->id,
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'] ?? null,
            'is_visible' => true,
            'helpful_count' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil dikirim.',
            'data' => $review->load(['user', 'product']),
        ], 201);
    }
}
