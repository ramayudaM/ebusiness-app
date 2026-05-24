<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlist = Wishlist::with('product')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($wishlist);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $userId = Auth::id();
        $productId = $request->product_id;

        $exists = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($exists) {
            $exists->delete();
            return response()->json([
                'message' => 'Dihapus dari wishlist',
                'status' => 'removed'
            ]);
        }

        $product = Product::where('is_active', true)->findOrFail($productId);

        $wishlist = Wishlist::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        try {
            Auth::user()->notify(new \App\Notifications\ProductAddedToWishlist($product));
        } catch (\Throwable $e) {
            Log::warning('ProductAddedToWishlist notification failed', [
                'user_id' => $userId,
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Ditambahkan ke wishlist',
            'status' => 'added',
            'item' => $wishlist->load('product')
        ]);
    }
}
