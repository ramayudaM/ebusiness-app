<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->with([
                'items.product.images',
                'items.variation',
                'payment'
            ])
            ->get();

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->with([
                'items.product.images',
                'items.variation',
                'payment'
            ])
            ->findOrFail($id);

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
            $order->restoreVariationStock();

            $order->update([
                'status' => 'CANCELLED',
                'cancelled_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan.',
            'order' => $order->fresh()->load(['items.product.images', 'items.variation', 'payment'])
        ]);
    }
}
