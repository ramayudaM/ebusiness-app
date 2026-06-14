<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Services\OrderStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(private OrderStockService $stockService)
    {
    }

    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->with(['items.product.images'])
            ->get();

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->with(['items.product.images'])
            ->findOrFail($id);

        $reviews = Review::where('user_id', Auth::id())
            ->where('order_id', $order->id)
            ->get()
            ->keyBy('product_id');

        $canReviewOrder = in_array($order->status, ['DELIVERED', 'COMPLETED'], true);

        $order->items->each(function ($item) use ($reviews, $canReviewOrder) {
            $item->setAttribute('review', $reviews->get($item->product_id));
            $item->setAttribute('can_review', $canReviewOrder && !$reviews->has($item->product_id));
        });

        return response()->json($order);
    }

    public function cancel($id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        if ($order->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya pesanan dengan status menunggu pembayaran yang dapat dibatalkan.'
            ], 422);
        }

        DB::transaction(function () use ($order) {
            $this->stockService->restoreForOrder($order);

            $order->update([
                'status' => 'CANCELLED',
                'cancelled_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan.',
            'order' => $order->fresh()
        ]);
    }
}
