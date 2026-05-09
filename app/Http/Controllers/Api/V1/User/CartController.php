<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $items = CartItem::with(['product', 'variation'])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variation_id' => 'nullable|exists:product_variations,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();
        $productId = $request->product_id;
        $variationId = $request->product_variation_id;

        // Cek apakah item sudah ada di keranjang
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('product_variation_id', $variationId)
            ->first();

        if ($cartItem) {
            // Jika ada, tambahkan jumlahnya
            $cartItem->increment('quantity', $request->quantity);
        } else {
            // Jika belum ada, buat baru
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'product_variation_id' => $variationId,
                'quantity' => $request->quantity,
                'is_selected' => true,
            ]);
        }

        // Generate Notification
        $product = Product::find($productId);
        if (Auth::user()) {
            Auth::user()->notify(new \App\Notifications\ProductAddedToCart($product));
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'item' => $cartItem->load(['product', 'variation'])
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'is_selected' => 'nullable|boolean',
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
        
        $updateData = [];
        if ($request->has('quantity')) $updateData['quantity'] = $request->quantity;
        if ($request->has('is_selected')) $updateData['is_selected'] = $request->is_selected;
        
        $cartItem->update($updateData);

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

        CartItem::where('user_id', Auth::id())
            ->update(['is_selected' => $request->is_selected]);

        return response()->json([
            'message' => 'Status semua produk diperbarui'
        ]);
    }

    public function destroy($id)
    {
        $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $cartItem->delete();

        return response()->json([
            'message' => 'Produk dihapus dari keranjang'
        ]);
    }

    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Keranjang dikosongkan'
        ]);
    }
}
