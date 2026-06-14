<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVariation;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class OrderStockService
{
    public function reserveForCartItems(Order $order, Collection $cartItems): array
    {
        if ($order->stock_reserved_at) {
            return [];
        }

        $reservedItems = [];

        foreach ($cartItems as $item) {
            $variation = $this->lockVariationForCartItem($item);

            if (! $variation) {
                throw ValidationException::withMessages([
                    'cart' => "Variasi produk {$item->product->name} tidak ditemukan.",
                ]);
            }

            if (! $variation->is_active) {
                throw ValidationException::withMessages([
                    'cart' => "Variasi {$variation->name} untuk produk {$item->product->name} tidak aktif.",
                ]);
            }

            if ($variation->stock_qty < $item->quantity) {
                throw ValidationException::withMessages([
                    'cart' => "Stok {$item->product->name} - {$variation->name} hanya tersisa {$variation->stock_qty} unit.",
                ]);
            }

            $variation->decrement('stock_qty', $item->quantity);

            $reservedItems[] = [
                'cart_item' => $item,
                'variation' => $variation,
                'price_sen' => $variation->price_sen ?? $item->product->price_sen,
            ];
        }

        $order->forceFill(['stock_reserved_at' => now()])->save();

        return $reservedItems;
    }

    public function restoreForOrder(Order $order): void
    {
        $order = $order->fresh(['items']);

        if (! $order || ! $order->stock_reserved_at) {
            return;
        }

        foreach ($order->items as $item) {
            if (! $item->variation_id) {
                continue;
            }

            ProductVariation::whereKey($item->variation_id)
                ->lockForUpdate()
                ->increment('stock_qty', $item->qty);
        }

        $order->forceFill(['stock_reserved_at' => null])->save();
    }

    private function lockVariationForCartItem($item): ?ProductVariation
    {
        if ($item->product_variation_id) {
            return ProductVariation::whereKey($item->product_variation_id)
                ->where('product_id', $item->product_id)
                ->lockForUpdate()
                ->first();
        }

        return ProductVariation::where('product_id', $item->product_id)
            ->where('is_active', true)
            ->lockForUpdate()
            ->first();
    }
}
