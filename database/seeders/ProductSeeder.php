<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Products
        DB::table('products')->insert([
            ['id' => 1, 'category_id' => 8, 'name' => 'Yamaha FG800 Acoustic Guitar - Natural', 'slug' => 'yamaha-fg800-natural', 'description' => 'Yamaha FG800 adalah gitar akustik entry-level terbaik...', 'price_sen' => 3499000, 'weight_gram' => 2000, 'sku' => 'YAM-FG800-NAT', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.7, 'review_count' => 12, 'created_at' => now()->subDays(30), 'updated_at' => now()],
            ['id' => 2, 'category_id' => 8, 'name' => 'Fender CD-60S Acoustic Guitar - Sunburst', 'slug' => 'fender-cd-60s-sunburst', 'description' => 'Fender CD-60S adalah gitar akustik...', 'price_sen' => 4299000, 'weight_gram' => 2100, 'sku' => 'FEN-CD60S-SB', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.5, 'review_count' => 8, 'created_at' => now()->subDays(28), 'updated_at' => now()],
            ['id' => 6, 'category_id' => 9, 'name' => 'Fender Player Stratocaster - Sunburst', 'slug' => 'fender-player-strat-sunburst', 'description' => 'Fender Player Stratocaster adalah ikon...', 'price_sen' => 12999000, 'weight_gram' => 3500, 'sku' => 'FEN-PLAYER-STR-SB', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.9, 'review_count' => 15, 'created_at' => now()->subDays(35), 'updated_at' => now()],
            ['id' => 7, 'category_id' => 9, 'name' => 'Gibson Les Paul Studio - Wine Red', 'slug' => 'gibson-les-paul-studio-wine', 'description' => 'Gibson Les Paul Studio adalah kombinasi...', 'price_sen' => 32999000, 'weight_gram' => 4000, 'sku' => 'GIB-LP-STUDIO-WR', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.7, 'review_count' => 7, 'created_at' => now()->subDays(32), 'updated_at' => now()],
            ['id' => 8, 'category_id' => 9, 'name' => 'Ibanez RG550 - Desert Sun Yellow', 'slug' => 'ibanez-rg550-dsy', 'description' => 'Ibanez RG550 adalah superstrat legend...', 'price_sen' => 18499000, 'weight_gram' => 3200, 'sku' => 'IBZ-RG550-DSY', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.8, 'review_count' => 9, 'created_at' => now()->subDays(22), 'updated_at' => now()],
            ['id' => 13, 'category_id' => 20, 'name' => 'Daddario EXL110 Light Gauge Electric Strings', 'slug' => 'daddario-exl110-electric', 'description' => 'Daddario EXL110 adalah set string...', 'price_sen' => 149000, 'weight_gram' => 100, 'sku' => 'DAD-EXL110', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.9, 'review_count' => 20, 'created_at' => now()->subDays(60), 'updated_at' => now()],
            ['id' => 4, 'category_id' => 8, 'name' => 'Taylor BT1 Baby Taylor Acoustic Guitar', 'slug' => 'taylor-bt1-baby', 'description' => 'Taylor BT1...', 'price_sen' => 5450000, 'weight_gram' => 1600, 'sku' => 'TAY-BT1', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.8, 'review_count' => 4, 'created_at' => now()->subDays(20), 'updated_at' => now()],
            ['id' => 5, 'category_id' => 8, 'name' => 'Martin LX1 Little Martin Acoustic Guitar', 'slug' => 'martin-lx1-little', 'description' => 'Martin LX1...', 'price_sen' => 6200000, 'weight_gram' => 1500, 'sku' => 'MAR-LX1', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.6, 'review_count' => 3, 'created_at' => now()->subDays(18), 'updated_at' => now()],
            ['id' => 14, 'category_id' => 17, 'name' => 'Fender Champion 50 Guitar Amplifier', 'slug' => 'fender-champion-50', 'description' => 'Fender Champion 50...', 'price_sen' => 3499000, 'weight_gram' => 9000, 'sku' => 'FEN-CHAMP-50', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.4, 'review_count' => 3, 'created_at' => now()->subDays(20), 'updated_at' => now()],
            ['id' => 15, 'category_id' => 22, 'name' => 'Boss TU-3 Chromatic Tuner', 'slug' => 'boss-tu-3-tuner', 'description' => 'Boss TU-3...', 'price_sen' => 1899000, 'weight_gram' => 600, 'sku' => 'BOSS-TU3', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.8, 'review_count' => 18, 'created_at' => now()->subDays(45), 'updated_at' => now()],
            ['id' => 17, 'category_id' => 14, 'name' => 'Yamaha Stage Custom Birch 5-Piece Drum Kit - Jet Black', 'slug' => 'yamaha-stage-custom-jet-black', 'description' => 'Yamaha Stage Custom Birch...', 'price_sen' => 12999000, 'weight_gram' => 28000, 'sku' => 'YAM-SC-BIRCH-5-JB', 'is_bundle' => false, 'is_active' => true, 'average_rating' => 4.7, 'review_count' => 4, 'created_at' => now()->subDays(40), 'updated_at' => now()],
            ['id' => 18, 'category_id' => 9, 'name' => 'Starter Pack Gitar Elektrik — Fender Strat + Accessories', 'slug' => 'starter-pack-fender-strat', 'description' => 'Paket lengkap...', 'price_sen' => 15999000, 'weight_gram' => 4500, 'sku' => 'BUN-FENDER-START', 'is_bundle' => true, 'is_active' => true, 'average_rating' => 0.0, 'review_count' => 0, 'created_at' => now()->subDays(10), 'updated_at' => now()],
        ]);
        DB::statement("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))");

        // 2. Variations
        DB::table('product_variations')->insert([
            ['id' => 1, 'product_id' => 1, 'name' => 'Natural', 'sku' => 'YAM-FG800-NAT', 'price_sen' => null, 'stock_qty' => 8, 'is_active' => true],
            ['id' => 2, 'product_id' => 1, 'name' => 'Black', 'sku' => 'YAM-FG800-BLK', 'price_sen' => null, 'stock_qty' => 5, 'is_active' => true],
            ['id' => 4, 'product_id' => 2, 'name' => '3-Color Sunburst', 'sku' => 'FEN-CD60S-SB', 'price_sen' => null, 'stock_qty' => 4, 'is_active' => true],
            ['id' => 6, 'product_id' => 6, 'name' => '3-Color Sunburst', 'sku' => 'FEN-PLAYER-STR-SB', 'price_sen' => null, 'stock_qty' => 3, 'is_active' => true],
            ['id' => 9, 'product_id' => 8, 'name' => 'Desert Sun Yellow', 'sku' => 'IBZ-RG550-DSY', 'price_sen' => null, 'stock_qty' => 2, 'is_active' => true],
        ]);
        DB::statement("SELECT setval('product_variations_id_seq', (SELECT MAX(id) FROM product_variations))");

        // 3. Bundles
        DB::table('bundles')->insert([
            ['product_id' => 18, 'bundle_price_sen' => 13999000, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 4. Bundle Items
        DB::table('bundle_items')->insert([
            ['bundle_id' => 1, 'product_id' => 6, 'variation_id' => 6, 'qty' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['bundle_id' => 1, 'product_id' => 14, 'variation_id' => null, 'qty' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['bundle_id' => 1, 'product_id' => 13, 'variation_id' => null, 'qty' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 5. Images
        DB::table('product_images')->insert([
            ['product_id' => 1, 'url' => 'products/yamaha-fg800/yamaha-fg800-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 1, 'url' => 'products/yamaha-fg800/yamaha-fg800-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],
            ['product_id' => 1, 'url' => 'products/yamaha-fg800/yamaha-fg800-3.png', 'sort_order' => 2, 'is_primary' => false, 'created_at' => now()],
            
            ['product_id' => 2, 'url' => 'products/fender-cd-60s-sunburst/fender-cd60s-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 2, 'url' => 'products/fender-cd-60s-sunburst/fender-cd60s-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 6, 'url' => 'products/fender-player-strat-sunburst/strat-sunburst-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 6, 'url' => 'products/fender-player-strat-sunburst/strat-sunburst-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 7, 'url' => 'products/gibson-les-paul-studio-wine/gibson-les-paul-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 7, 'url' => 'products/gibson-les-paul-studio-wine/gibson-les-paul-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 8, 'url' => 'products/ibanez-rg550-dsy/ibanez-rg550-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 8, 'url' => 'products/ibanez-rg550-dsy/ibanez-rg550-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 13, 'url' => 'products/daddario-exl110-electric/daddario-strings-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 13, 'url' => 'products/daddario-exl110-electric/daddario-strings-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 4, 'url' => 'products/taylor-bt1-baby/taylor-bt1-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 4, 'url' => 'products/taylor-bt1-baby/taylor-bt1-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 5, 'url' => 'products/martin-lx1-little/martin-lx1-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 5, 'url' => 'products/martin-lx1-little/martin-lx1-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 14, 'url' => 'products/fender-champion-50/fender-champion-50-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 14, 'url' => 'products/fender-champion-50/fender-champion-50-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 15, 'url' => 'products/boss-tu-3-tuner/boss-tu3-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 15, 'url' => 'products/boss-tu-3-tuner/boss-tu3-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 17, 'url' => 'products/yamaha-stage-custom-jet-black/yamaha-stage-custom-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 17, 'url' => 'products/yamaha-stage-custom-jet-black/yamaha-stage-custom-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],

            ['product_id' => 18, 'url' => 'products/starter-pack-fender-strat/starter-pack-1.png', 'sort_order' => 0, 'is_primary' => true, 'created_at' => now()],
            ['product_id' => 18, 'url' => 'products/starter-pack-fender-strat/starter-pack-2.png', 'sort_order' => 1, 'is_primary' => false, 'created_at' => now()],
        ]);

        // 6. Media
        DB::table('product_media')->insert([
            ['product_id' => 1, 'type' => 'audio', 'url' => 'products/yamaha-fg800/preview/fg800-strumming-demo.mp3', 'label' => 'Demo Strumming', 'duration_seconds' => 45, 'file_size_bytes' => 720000, 'created_at' => now()],
            ['product_id' => 2, 'type' => 'audio', 'url' => 'products/fender-cd-60s-sunburst/preview/acoustic-demo.mp3', 'label' => 'Acoustic Sound', 'duration_seconds' => 30, 'file_size_bytes' => 500000, 'created_at' => now()],
            ['product_id' => 4, 'type' => 'audio', 'url' => 'products/taylor-bt1-baby/preview/baby-taylor-demo.mp3', 'label' => 'Bright Tone Demo', 'duration_seconds' => 25, 'file_size_bytes' => 400000, 'created_at' => now()],
            ['product_id' => 5, 'type' => 'audio', 'url' => 'products/martin-lx1-little/preview/martin-demo.mp3', 'label' => 'Warm Tone Demo', 'duration_seconds' => 28, 'file_size_bytes' => 450000, 'created_at' => now()],
            ['product_id' => 6, 'type' => 'video', 'url' => 'products/fender-player-strat-sunburst/preview/strat-sound-demo.mp4', 'label' => 'Full Sound Demo', 'duration_seconds' => 300, 'file_size_bytes' => 60000000, 'created_at' => now()],
            ['product_id' => 7, 'type' => 'audio', 'url' => 'products/gibson-les-paul-studio-wine/preview/electric-demo.mp3', 'label' => 'Crunch Demo', 'duration_seconds' => 40, 'file_size_bytes' => 600000, 'created_at' => now()],
            ['product_id' => 8, 'type' => 'audio', 'url' => 'products/ibanez-rg550-dsy/preview/shred-demo.mp3', 'label' => 'High Gain Demo', 'duration_seconds' => 35, 'file_size_bytes' => 550000, 'created_at' => now()],
            ['product_id' => 17, 'type' => 'audio', 'url' => 'products/yamaha-stage-custom-jet-black/preview/drum-demo.mp3', 'label' => 'Drum Kit Sample', 'duration_seconds' => 50, 'file_size_bytes' => 800000, 'created_at' => now()],
            ['product_id' => 18, 'type' => 'audio', 'url' => 'products/starter-pack-fender-strat/preview/starter-demo.mp3', 'label' => 'Beginner Guide Audio', 'duration_seconds' => 60, 'file_size_bytes' => 900000, 'created_at' => now()],
        ]);
    }
}
