<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\MidtransService;
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    protected $rajaOngkir;
    protected $midtrans;

    public function __construct(RajaOngkirService $rajaOngkir, MidtransService $midtrans)
    {
        $this->rajaOngkir = $rajaOngkir;
        $this->midtrans = $midtrans;
    }

    /**
     * Helper method to get selected cart items
     * Handles case when is_selected column doesn't exist yet (before migration)
     */
    private function getSelectedCartItems(int $cartId)
    {
        $query = CartItem::where('cart_id', $cartId);
        
        // Only filter by is_selected if column exists (after migration)
        if (Schema::hasColumn('cart_items', 'is_selected')) {
            $query->where('is_selected', true);
        }
        
        return $query->with(['product', 'variation'])->get();
    }

    public function calculateShipping(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'nullable|string',
        ]);

        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $address = Address::where('user_id', $userId)->findOrFail($request->address_id);
            
            // Get cart for current user
            $cart = Cart::where('user_id', $userId)->first();
            if (!$cart) {
                return response()->json([$this->getFallbackShipping()]);
            }
            
            // Get selected cart items with product and variation
            $cartItems = $this->getSelectedCartItems($cart->id);
            
            if ($cartItems->isEmpty()) {
                return response()->json([$this->getFallbackShipping()]);
            }
                
            $totalWeight = 0;
            foreach ($cartItems as $item) {
                $totalWeight += (($item->product->weight_gram ?? 1000) * $item->qty);
            }

            if ($totalWeight <= 0) $totalWeight = 1000;

            $couriers = $request->courier ? [$request->courier] : ['jne', 'pos', 'tiki'];
            $allServices = [];

            Log::info("Calculating shipping for address {$address->id} (City: {$address->city_id}), Weight: {$totalWeight}g");

            foreach ($couriers as $courier) {
                $results = $this->rajaOngkir->calculateCost(
                    $address->city_id,
                    $totalWeight,
                    $courier
                );

                if (!empty($results)) {
                    $courierData = $results[0] ?? null;
                    if ($courierData && isset($courierData['costs'])) {
                        foreach ($courierData['costs'] as $item) {
                            $allServices[] = [
                                'courier' => $courier,
                                'service' => $item['service'],
                                'description' => $item['description'],
                                'cost' => collect($item['cost'])->map(function($c) {
                                    return [
                                        'value' => (int) $c['value'],
                                        'etd' => $c['etd']
                                    ];
                                })->toArray()
                            ];
                        }
                    }
                } else {
                    Log::warning("No shipping results for courier {$courier}");
                }
            }

            Log::info("Total shipping services found: " . count($allServices));

            // If no services found, return fallback
            if (empty($allServices)) {
                return response()->json([$this->getFallbackShipping()]);
            }

            return response()->json($allServices);
        } catch (\Exception $e) {
            Log::error("Shipping calculation error: " . $e->getMessage());
            // Return fallback shipping instead of error
            return response()->json([$this->getFallbackShipping()]);
        }
    }

    /**
     * TODO: Fallback shipping hanya untuk development/demo.
     * Jika RajaOngkir API gagal atau tidak ada hasil, gunakan fallback ini.
     * Di production, sebaiknya return error atau handle dengan lebih baik.
     */
    private function getFallbackShipping()
    {
        return [
            'courier' => 'jne',
            'service' => 'reg',
            'description' => 'JNE REG',
            'cost' => [
                [
                    'value' => 25000,
                    'etd' => '2-3'
                ]
            ]
        ];
    }

    public function process(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'required|string',
            'service' => 'required|string',
            'shipping_cost' => 'required|numeric',
            'notes' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            return DB::transaction(function () use ($request, $user) {
                $userId = $user->id;
            
            // Get cart for current user
            $cart = Cart::where('user_id', $userId)->first();
            if (!$cart) {
                return response()->json(['message' => 'Keranjang tidak ditemukan'], 422);
            }
            
            $address = Address::where('user_id', $userId)->findOrFail($request->address_id);
            
            $cartItems = $this->getSelectedCartItems($cart->id);

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Keranjang kosong'], 422);
            }

            // Validate stock and lock product variations
            foreach ($cartItems as $item) {
                if ($item->variation_id) {
                    $variation = ProductVariation::lockForUpdate()
                        ->where('product_id', $item->product_id)
                        ->where('is_active', true)
                        ->findOrFail($item->variation_id);
                    
                    if ($variation->stock_qty < $item->qty) {
                        throw new \Exception("Stok {$variation->name} tidak cukup");
                    }

                    $item->setRelation('variation', $variation);
                } else {
                    $product = Product::with('variations')->lockForUpdate()->findOrFail($item->product_id);
                    if ($product->variations->isNotEmpty()) {
                        throw new \Exception("Variasi untuk {$product->name} wajib dipilih");
                    }
                }
            }

            $subtotal = 0;
            foreach ($cartItems as $item) {
                $price = $item->variation ? ($item->variation->price_sen ?? $item->product->price_sen) : $item->product->price_sen;
                $subtotal += ($price * $item->qty);
            }

            $orderNumber = 'NK-' . strtoupper(Str::random(10));
            $shippingCost = (int) $request->shipping_cost;
            $normalTotal = $subtotal + $shippingCost;

            // Process promo code
            $promoCode = $request->promo_code ? trim(strtoupper($request->promo_code)) : null;
            $shippingDiscountSen = 0;
            $discountSen = 0;
            $payableTotalSen = $normalTotal;

            if ($promoCode) {
                if ($promoCode === 'GRATISONGKIR') {
                    $shippingDiscountSen = $shippingCost;
                    $discountSen = $shippingCost;
                    $payableTotalSen = $subtotal;
                } elseif ($promoCode === 'TESTPAY1') {
                    // Only valid in local environment and sandbox mode
                    if (!app()->environment('local') || config('services.midtrans.is_production') === true) {
                        return response()->json([
                            'message' => 'Kode TESTPAY1 hanya tersedia pada mode pengujian Sandbox.'
                        ], 422);
                    }
                    $shippingDiscountSen = 0;
                    $discountSen = max(0, $normalTotal - 1);
                    $payableTotalSen = 1;
                } else {
                    return response()->json([
                        'message' => 'Kode promo tidak valid.'
                    ], 422);
                }
            }

            // Create order with valid status enum
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $userId,
                'status' => 'PENDING',
                'shipping_name' => $address->receiver_name,
                'shipping_phone' => $address->phone_number,
                'shipping_address' => $address->full_address,
                'shipping_city' => $address->city_name,
                'shipping_province' => $address->province_name,
                'shipping_postal_code' => $address->postal_code,
                'shipping_courier' => $request->courier,
                'shipping_service' => $request->service,
                'shipping_cost_sen' => $shippingCost,
                'subtotal_sen' => $subtotal,
                'total_sen' => $normalTotal,
                'customer_notes' => $request->notes,
                'expires_at' => now()->addHours(24),
                'promo_code' => $promoCode,
                'shipping_discount_sen' => $shippingDiscountSen,
                'discount_sen' => $discountSen,
                'payable_total_sen' => $payableTotalSen,
            ]);

            // Create order items and reduce stock
            foreach ($cartItems as $item) {
                $price = $item->variation ? ($item->variation->price_sen ?? $item->product->price_sen) : $item->product->price_sen;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variation_id' => $item->variation_id,
                    'product_name_snapshot' => $item->product->name,
                    'variation_name_snapshot' => $item->variation ? $item->variation->name : null,
                    'product_sku_snapshot' => $item->variation ? $item->variation->sku : $item->product->sku,
                    'qty' => $item->qty,
                    'unit_price_sen' => $price,
                    'subtotal_sen' => ($price * $item->qty),
                ]);

                // Reduce stock - product variations have stock_qty column
                if ($item->variation_id) {
                    $item->variation->decrement('stock_qty', $item->qty);
                }
            }

            // Get Midtrans Snap Token
            try {
                $snapToken = $this->midtrans->getSnapToken($order, $order->items);
            } catch (\Exception $e) {
                Log::error("Midtrans error: " . $e->getMessage());
                throw new \Exception("Gagal membuat token pembayaran: " . $e->getMessage());
            }

            $order->update(['payment_token' => $snapToken]);

            // Create payment record with pending status
            Payment::create([
                'order_id' => $order->id,
                'midtrans_order_id' => $order->order_number,
                'payment_type' => 'va',  // Default to VA, will be updated on webhook
                'transaction_status' => 'pending',
                'gross_amount_sen' => $payableTotalSen,
                'payment_url' => null,
                'expires_at' => now()->addHours(24),
            ]);

            // Clear selected items from cart
            CartItem::where('cart_id', $cart->id)
                ->whereIn('id', $cartItems->pluck('id'))
                ->delete();

                return response()->json([
                    'message' => 'Pesanan berhasil dibuat',
                    'order_number' => $order->order_number,
                    'snap_token' => $snapToken
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('Checkout process failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            if (str_contains($e->getMessage(), 'Gagal membuat token pembayaran') ||
                str_contains($e->getMessage(), 'Midtrans API') ||
                str_contains($e->getMessage(), 'Access denied due to unauthorized transaction')) {
                return response()->json([
                    'message' => 'Gagal membuat token pembayaran. Periksa konfigurasi Midtrans sandbox/server key.',
                ], 502);
            }

            return response()->json([
                'message' => $e->getMessage() ?: 'Checkout gagal diproses.',
            ], 422);
        }
    }

    public function verify($orderNumber)
    {
        try {
            $status = $this->midtrans->checkStatus($orderNumber);
            $order = Order::where('order_number', $orderNumber)->with('payment')->firstOrFail();

            $transactionStatus = $status->transaction_status;
            $this->syncPaymentStatus($order, $transactionStatus);
            $order->refresh()->load('payment');

            return response()->json([
                'success' => true,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'transaction_status' => $order->payment?->transaction_status,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        // Handle Midtrans notification
        $serverKey = config('services.midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $order = Order::where('order_number', $request->order_id)->first();
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        $this->syncPaymentStatus($order, $request->transaction_status, $request->payment_type);

        return response()->json(['message' => 'Webhook processed']);
    }

    private function syncPaymentStatus(Order $order, string $midtransStatus, ?string $paymentType = null): void
    {
        $transactionStatus = match ($midtransStatus) {
            'capture', 'settlement' => 'settlement',
            'expire' => 'expire',
            'deny', 'failure' => 'failure',
            'cancel' => 'cancel',
            default => 'pending',
        };

        $paymentData = ['transaction_status' => $transactionStatus];

        if (in_array($paymentType, ['va', 'qris', 'ewallet'], true)) {
            $paymentData['payment_type'] = $paymentType;
        }

        if ($transactionStatus === 'settlement') {
            $paymentData['paid_at'] = now();
            $order->update([
                'status' => 'PROCESSING',
                'paid_at' => $order->paid_at ?: now(),
            ]);
        } elseif (in_array($transactionStatus, ['expire', 'failure', 'cancel'], true)) {
            if (! in_array($order->status, ['CANCELLED', 'EXPIRED'], true)) {
                $order->restoreVariationStock();
            }

            $order->update(['status' => 'CANCELLED']);
        }

        $order->payment()->updateOrCreate(
            ['order_id' => $order->id],
            array_merge([
                'midtrans_order_id' => $order->order_number,
                'payment_type' => 'va',
                'gross_amount_sen' => $order->total_sen,
                'expires_at' => $order->expires_at ?? now()->addHours(24),
            ], $paymentData)
        );
    }
}
