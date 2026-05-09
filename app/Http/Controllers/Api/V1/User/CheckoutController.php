<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\MidtransService;
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function calculateShipping(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'nullable|string',
        ]);

        $address = Address::findOrFail($request->address_id);
        
        $cartItems = CartItem::where('user_id', Auth::id())
            ->where('is_selected', true)
            ->with('product')
            ->get();
            
        $totalWeight = 0;
        foreach ($cartItems as $item) {
            $totalWeight += (($item->product->weight_gram ?? 1000) * $item->quantity);
        }

        if ($totalWeight <= 0) $totalWeight = 1000;

        $couriers = $request->courier ? [$request->courier] : ['jne', 'pos', 'tiki'];
        $allServices = [];

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
            }
        }

        return response()->json($allServices);
    }

    public function process(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'required|string',
            'service' => 'required|string',
            'shipping_cost' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            $user = Auth::user();
            $address = Address::findOrFail($request->address_id);
            
            $cartItems = CartItem::where('user_id', $user->id)
                ->where('is_selected', true)
                ->with(['product', 'variation'])
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Keranjang kosong'], 422);
            }

            $subtotal = 0;
            foreach ($cartItems as $item) {
                $price = $item->variation ? ($item->variation->price_sen ?? $item->product->price_sen) : $item->product->price_sen;
                $subtotal += ($price * $item->quantity);
            }

            $orderNumber = 'NK-' . strtoupper(Str::random(10));
            $shippingCost = (int) $request->shipping_cost;
            $total = $subtotal + $shippingCost;

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
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
                'total_sen' => $total,
                'customer_notes' => $request->notes,
                'payment_status' => 'unpaid',
            ]);

            foreach ($cartItems as $item) {
                $price = $item->variation ? ($item->variation->price_sen ?? $item->product->price_sen) : $item->product->price_sen;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variation_id' => $item->product_variation_id,
                    'product_name_snapshot' => $item->product->name,
                    'variation_name_snapshot' => $item->variation ? $item->variation->name : null,
                    'product_sku_snapshot' => $item->variation ? $item->variation->sku : $item->product->sku,
                    'qty' => $item->quantity,
                    'unit_price_sen' => $price,
                    'subtotal_sen' => ($price * $item->quantity),
                ]);
            }

            // Get Midtrans Snap Token
            $snapToken = $this->midtrans->getSnapToken($order, $order->items);
            $order->update(['payment_token' => $snapToken]);

            // Clear cart
            CartItem::where('user_id', $user->id)->where('is_selected', true)->delete();

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'order_number' => $order->order_number,
                'snap_token' => $snapToken
            ]);
        });
    }

    public function webhook(Request $request)
    {
        // Handle Midtrans notification
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $order = Order::where('order_number', $request->order_id)->first();
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        $status = $request->transaction_status;
        
        if ($status == 'capture' || $status == 'settlement') {
            $order->update(['payment_status' => 'paid', 'status' => 'PROCESSING']);
        } else if ($status == 'pending') {
            $order->update(['payment_status' => 'unpaid']);
        } else if ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            $order->update(['payment_status' => 'failed', 'status' => 'CANCELLED']);
        }

        return response()->json(['message' => 'Webhook processed']);
    }
}
