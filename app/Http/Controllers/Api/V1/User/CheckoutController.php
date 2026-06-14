<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\MidtransService;
use App\Services\OrderStockService;
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    protected $rajaOngkir;
    protected $midtrans;
    protected $stockService;

    public function __construct(
        RajaOngkirService $rajaOngkir,
        MidtransService $midtrans,
        OrderStockService $stockService
    )
    {
        $this->rajaOngkir = $rajaOngkir;
        $this->midtrans = $midtrans;
        $this->stockService = $stockService;
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

        \Illuminate\Support\Facades\Log::info("Calculating shipping for address {$address->id} (City: {$address->city_id}), Weight: {$totalWeight}g");

        $results = $this->rajaOngkir->calculateCosts(
            $address->city_id,
            $totalWeight,
            $couriers
        );

        foreach ($results as $courierData) {
            $courier = $courierData['code'] ?? null;
            if ($courier && isset($courierData['costs'])) {
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

        \Illuminate\Support\Facades\Log::info("Total shipping services found: " . count($allServices));

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

            $orderNumber = 'NK-' . strtoupper(Str::random(10));
            $shippingCost = (int) $request->shipping_cost;

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
                'subtotal_sen' => 0,
                'total_sen' => $shippingCost,
                'customer_notes' => $request->notes,
                'payment_status' => 'unpaid',
            ]);

            $reservedItems = $this->stockService->reserveForCartItems($order, $cartItems);
            $subtotal = 0;

            foreach ($reservedItems as $reservedItem) {
                $item = $reservedItem['cart_item'];
                $variation = $reservedItem['variation'];
                $price = $reservedItem['price_sen'];
                $subtotal += ($price * $item->quantity);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variation_id' => $variation->id,
                    'product_name_snapshot' => $item->product->name,
                    'variation_name_snapshot' => $variation->name,
                    'product_sku_snapshot' => $variation->sku,
                    'qty' => $item->quantity,
                    'unit_price_sen' => $price,
                    'subtotal_sen' => ($price * $item->quantity),
                ]);
            }

            $order->update([
                'subtotal_sen' => $subtotal,
                'total_sen' => $subtotal + $shippingCost,
            ]);

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

    public function verify($orderNumber)
    {
        try {
            $status = $this->midtrans->checkStatus($orderNumber);
            $order = Order::where('order_number', $orderNumber)->firstOrFail();

            $transactionStatus = $status->transaction_status;
            
            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                $order->update(['payment_status' => 'paid', 'status' => 'PROCESSING']);
            } else if ($transactionStatus == 'pending') {
                $order->update(['payment_status' => 'unpaid']);
            } else if ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                DB::transaction(function () use ($order) {
                    $this->stockService->restoreForOrder($order);
                    $order->update(['payment_status' => 'failed', 'status' => 'CANCELLED']);
                });
            }

            return response()->json([
                'success' => true,
                'status' => $order->status,
                'payment_status' => $order->payment_status
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

        $status = $request->transaction_status;
        
        if ($status == 'capture' || $status == 'settlement') {
            $order->update(['payment_status' => 'paid', 'status' => 'PROCESSING']);
        } else if ($status == 'pending') {
            $order->update(['payment_status' => 'unpaid']);
        } else if ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            DB::transaction(function () use ($order) {
                $this->stockService->restoreForOrder($order);
                $order->update(['payment_status' => 'failed', 'status' => 'CANCELLED']);
            });
        }

        return response()->json(['message' => 'Webhook processed']);
    }
}
