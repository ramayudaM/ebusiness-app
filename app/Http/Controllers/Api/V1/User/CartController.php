<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $items = CartItem::with(['product', 'variation'])
            ->where('cart_id', $cart->id)
            ->get();

        $total = $items->sum(function ($item) {
            $price = ($item->variation?->price_sen ?? $item->product?->price_sen) ?? 0;
            return $price * $item->qty;
        });

        return response()->json([
            'items' => $items,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variation_id' => 'nullable|exists:product_variations,id',
            'qty' => 'required|integer|min:1',
            'select_only' => 'nullable|boolean',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $productId = $request->product_id;
        $variationId = $request->variation_id;
        $product = Product::with('variations')
            ->where('is_active', true)
            ->findOrFail($productId);
        $variation = null;

        if ($variationId) {
            $variation = ProductVariation::where('product_id', $productId)
                ->where('is_active', true)
                ->findOrFail($variationId);

            if ($variation->stock_qty < $request->qty) {
                return response()->json(['message' => 'Stok variasi tidak cukup'], 422);
            }
        } elseif ($product->variations->isNotEmpty()) {
            return response()->json(['message' => 'Variasi produk wajib dipilih'], 422);
        }

        if ($request->boolean('select_only') && Schema::hasColumn('cart_items', 'is_selected')) {
            CartItem::where('cart_id', $cart->id)->update(['is_selected' => false]);
        }

        // Cek apakah item sudah ada di keranjang
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->where('variation_id', $variationId)
            ->first();

        if ($cartItem) {
            if ($variation && ($cartItem->qty + $request->qty) > $variation->stock_qty) {
                return response()->json(['message' => 'Jumlah keranjang melebihi stok variasi'], 422);
            }

            $updateData = [
                'qty' => $cartItem->qty + $request->qty,
            ];

            if (Schema::hasColumn('cart_items', 'is_selected')) {
                $updateData['is_selected'] = true;
            }

            $cartItem->update($updateData);
        } else {
            $createData = [
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'variation_id' => $variationId,
                'qty' => $request->qty,
            ];

            if (Schema::hasColumn('cart_items', 'is_selected')) {
                $createData['is_selected'] = true;
            }

            // Jika belum ada, buat baru
            $cartItem = CartItem::create($createData);
        }

        // Generate Notification
        try {
            $user->notify(new \App\Notifications\ProductAddedToCart($product));
        } catch (\Throwable $e) {
            Log::warning('ProductAddedToCart notification failed', [
                'user_id' => $user->id,
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'item' => $cartItem->load(['product', 'variation'])
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'qty' => 'nullable|integer|min:1',
            'is_selected' => 'nullable|boolean',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $cartItem = CartItem::where('cart_id', $cart->id)->findOrFail($id);
        
        $updateData = [];
        if ($request->has('qty')) {
            if ($cartItem->variation_id) {
                $variation = ProductVariation::findOrFail($cartItem->variation_id);

                if ($request->qty > $variation->stock_qty) {
                    return response()->json(['message' => 'Jumlah keranjang melebihi stok variasi'], 422);
                }
            }

            $updateData['qty'] = $request->qty;
        }
        
        // Only update is_selected if column exists (after migration)
        if ($request->has('is_selected') && Schema::hasColumn('cart_items', 'is_selected')) {
            $updateData['is_selected'] = $request->is_selected;
        }
        
        if (!empty($updateData)) {
            $cartItem->update($updateData);
        }

        return response()->json([
            'message' => 'Keranjang berhasil diperbarui',
            'item' => $cartItem->load(['product', 'variation'])
        ]);
    }

    public function toggleAll(Request $request)
    {
        $request->validate([
            'is_selected' => 'required|boolean',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $user->id)->firstOrFail();

        // Only update if column exists (after migration)
        if (Schema::hasColumn('cart_items', 'is_selected')) {
            CartItem::where('cart_id', $cart->id)
                ->update(['is_selected' => $request->is_selected]);
        }

        return response()->json([
            'message' => 'Status semua produk diperbarui'
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $cartItem = CartItem::where('cart_id', $cart->id)->findOrFail($id);
        $cartItem->delete();

        return response()->json([
            'message' => 'Produk dihapus dari keranjang'
        ]);
    }

    public function clear()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json([
            'message' => 'Keranjang dikosongkan'
        ]);
    }
}
