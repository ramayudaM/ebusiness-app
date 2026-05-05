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

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'product_variation_id' => $request->product_variation_id,
            ],
            [
                'quantity' => DB::raw("quantity + {$request->quantity}")
            ]
        );
        
        // Fix raw increment if recently created
        if ($cartItem->wasRecentlyCreated) {
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
        }

        // Generate Notification
        $product = Product::find($request->product_id);
        Auth::user()->notify(new \App\Notifications\ProductAddedToCart($product));

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'item' => $cartItem->load(['product', 'variation'])
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Jumlah produk diperbarui',
            'item' => $cartItem->load(['product', 'variation'])
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
