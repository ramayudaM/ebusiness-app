<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Carts & Cart Items
        DB::table('carts')->insert([
            ['id' => 1, 'user_id' => 2, 'session_id' => null, 'created_at' => now()->subHour(), 'updated_at' => now()->subHour()],
            ['id' => 2, 'user_id' => 3, 'session_id' => null, 'created_at' => now()->subMinutes(30), 'updated_at' => now()->subMinutes(30)],
        ]);

        DB::table('cart_items')->insert([
            ['cart_id' => 1, 'product_id' => 1, 'variation_id' => 1, 'qty' => 1, 'created_at' => now()->subMinutes(60), 'updated_at' => now()],
            ['cart_id' => 1, 'product_id' => 13, 'variation_id' => null, 'qty' => 1, 'created_at' => now()->subMinutes(45), 'updated_at' => now()],
            ['cart_id' => 2, 'product_id' => 6, 'variation_id' => 6, 'qty' => 1, 'created_at' => now()->subMinutes(25), 'updated_at' => now()],
        ]);

        // 2. Orders
        DB::table('orders')->insert([
            [
                'id' => 1,
                'order_number' => 'NK-20260415-000001',
                'user_id' => 2,
                'status' => 'SHIPPED',
                'shipping_name' => 'Rina Septiani',
                'shipping_phone' => '085712345678',
                'shipping_address' => 'Perum Permata Bintaro Blok C-15, RT003/RW007',
                'shipping_city' => 'Tangerang Selatan',
                'shipping_province' => 'Banten',
                'shipping_postal_code' => '15322',
                'shipping_courier' => 'jne',
                'shipping_service' => 'REG',
                'shipping_cost_sen' => 25000,
                'shipping_etd_days' => 3,
                'subtotal_sen' => 3599000,
                'total_sen' => 3624000,
                'tracking_number' => 'JNE1234567890',
                'tracking_url' => 'https://track.jne.co.id/JNE1234567890',
                'shipped_at' => now()->subDays(2),
                'expires_at' => now()->addDay(),
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(2),
            ],
            [
                'id' => 2,
                'order_number' => 'NK-20260416-000001',
                'user_id' => 3,
                'status' => 'PROCESSING',
                'shipping_name' => 'Dimas Pratama',
                'shipping_phone' => '081987654321',
                'shipping_address' => 'Jl. Setiabudi No. 45, Hegarmanah, Bandung',
                'shipping_city' => 'Bandung',
                'shipping_province' => 'Jawa Barat',
                'shipping_postal_code' => '40162',
                'shipping_courier' => 'jnt',
                'shipping_service' => 'REG',
                'shipping_cost_sen' => 35000,
                'shipping_etd_days' => 2,
                'subtotal_sen' => 31498000,
                'total_sen' => 31533000,
                'tracking_number' => null,
                'tracking_url' => null,
                'shipped_at' => null,
                'expires_at' => now()->addDay(),
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ]
        ]);
        DB::statement("SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))");

        // 3. Order Items
        DB::table('order_items')->insert([
            [
                'order_id' => 1,
                'product_id' => 1,
                'variation_id' => 1,
                'product_name_snapshot' => 'Yamaha FG800 Acoustic Guitar - Natural',
                'variation_name_snapshot' => 'Natural',
                'product_sku_snapshot' => 'YAM-FG800-NAT',
                'qty' => 1,
                'unit_price_sen' => 3499000,
                'subtotal_sen' => 3499000
            ],
            [
                'order_id' => 1,
                'product_id' => 13,
                'variation_id' => null,
                'product_name_snapshot' => 'Daddario EXL110 Strings',
                'variation_name_snapshot' => null,
                'product_sku_snapshot' => 'DAD-EXL110',
                'qty' => 1,
                'unit_price_sen' => 100000,
                'subtotal_sen' => 100000
            ],
        ]);

        // 4. Payments
        DB::table('payments')->insert([
            [
                'order_id' => 1,
                'midtrans_order_id' => 'MID-ORD1-20260415-001',
                'payment_type' => 'va',
                'transaction_status' => 'settlement',
                'gross_amount_sen' => 3624000,
                'paid_at' => now()->subDays(3),
                'expires_at' => now()->subDays(2),
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ]
        ]);
    }
}
