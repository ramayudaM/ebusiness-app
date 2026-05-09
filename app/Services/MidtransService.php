<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = config('services.midtrans.is_sanitized', true);
        Config::$is3ds = config('services.midtrans.is_3ds', true);
    }

    public function checkStatus($orderNumber)
    {
        return Transaction::status($orderNumber);
    }

    public function getSnapToken($order, $items)
    {
        $itemDetails = [];
        foreach ($items as $item) {
            $itemDetails[] = [
                'id' => $item->product_id,
                'price' => (int) $item->unit_price_sen,
                'quantity' => (int) $item->qty,
                'name' => substr($item->product_name_snapshot, 0, 50),
            ];
        }

        // Add shipping cost as an item
        if ($order->shipping_cost_sen > 0) {
            $itemDetails[] = [
                'id' => 'shipping',
                'price' => (int) $order->shipping_cost_sen,
                'quantity' => 1,
                'name' => 'Biaya Pengiriman',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->total_sen,
            ],
            'customer_details' => [
                'first_name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'phone' => $order->shipping_phone,
                'shipping_address' => [
                    'first_name' => $order->shipping_name,
                    'phone' => $order->shipping_phone,
                    'address' => $order->shipping_address,
                    'city' => $order->shipping_city,
                    'postal_code' => $order->shipping_postal_code,
                    'country_code' => 'IDN',
                ],
            ],
            'item_details' => $itemDetails,
            'enabled_payments' => [
                'credit_card', 'mandiri_clickpay', 'cimb_clicks',
                'bca_va', 'bni_va', 'bri_va', 'other_va', 'gopay', 'indomaret',
                'shopeepay', 'akulaku'
            ],
        ];

        return Snap::getSnapToken($params);
    }
}
