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
                'id' => \Illuminate\Support\Str::uuid(),
                'type' => 'App\Notifications\OrderStatusUpdated',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => 2,
                'data' => json_encode([
                    'title' => 'Pesanan Sedang Dikirim!',
                    'message' => 'Pesanan NK-20260415-000001 sudah dikirim via JNE REG.',
                    'link_url' => '/orders/NK-20260415-000001',
                ]),
                'read_at' => null,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ]);

    }
}
