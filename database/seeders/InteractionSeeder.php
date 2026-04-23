<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InteractionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Wishlists
        DB::table('wishlists')->insert([
            ['user_id' => 2, 'product_id' => 7, 'created_at' => now()->subDays(10)],
            ['user_id' => 2, 'product_id' => 6, 'created_at' => now()->subDays(5)],
        ]);

        // 2. Reviews
        DB::table('reviews')->insert([
            [
                'user_id' => 5,
                'product_id' => 1,
                'order_id' => 1, // Assume order ID exists
                'rating' => 5,
                'review_text' => 'Kualitas suara sangat baik untuk range harga ini. Spruce top memberikan resonansi yang hangat.',
                'is_visible' => true,
                'helpful_count' => 3,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
        ]);

        // 3. Notifications
        DB::table('notifications')->insert([
            [
                'user_id' => 2,
                'type' => 'order_status',
                'title' => 'Pesanan Sedang Dikirim!',
                'message' => 'Pesanan NK-20260415-000001 sudah dikirim via JNE REG.',
                'link_url' => '/orders/NK-20260415-000001',
                'is_read' => false,
                'created_at' => now()->subDays(2),
                'read_at' => null,
            ],
        ]);

        // 4. RajaOngkir Cache
        DB::table('raja_ongkir_cache')->insert([
            [
                'cache_key' => 'raja_ongkir:provinces',
                'cache_value' => json_encode([
                    ['province_id' => '1', 'province' => 'Bali'],
                    ['province_id' => '6', 'province' => 'DKI Jakarta'],
                    ['province_id' => '9', 'province' => 'Jawa Barat'],
                ]),
                'expires_at' => now()->addMonth(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
