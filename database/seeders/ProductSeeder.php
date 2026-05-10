<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category' => 'Gitar',
                'name' => 'Yamaha F310 Acoustic Guitar',
                'sku' => 'GTR-YMH-F310',
                'price_sen' => 2350000,
                'stock_qty' => 12,
                'weight_gram' => 2500,
                'description' => 'Gitar akustik populer untuk pemula dan intermediate dengan suara natural.',
                'image_url' => 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=900',
            ],
            [
                'category' => 'Gitar',
                'name' => 'Cort AD810 Acoustic Guitar',
                'sku' => 'GTR-CRT-AD810',
                'price_sen' => 1900000,
                'stock_qty' => 10,
                'weight_gram' => 2500,
                'description' => 'Gitar akustik dreadnought dengan tone hangat dan nyaman untuk latihan.',
                'image_url' => 'https://images.unsplash.com/photo-1558098329-a11cff621064?w=900',
            ],
            [
                'category' => 'Gitar',
                'name' => 'Squier Sonic Stratocaster Electric Guitar',
                'sku' => 'GTR-SQR-SONIC-ST',
                'price_sen' => 3650000,
                'stock_qty' => 6,
                'weight_gram' => 3800,
                'description' => 'Gitar elektrik bergaya Stratocaster untuk latihan, rekaman, dan panggung kecil.',
                'image_url' => 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900',
            ],
            [
                'category' => 'Bass',
                'name' => 'Ibanez GSR200 Electric Bass',
                'sku' => 'BSS-IBZ-GSR200',
                'price_sen' => 3600000,
                'stock_qty' => 6,
                'weight_gram' => 4200,
                'description' => 'Bass elektrik nyaman untuk pemula hingga pemain intermediate.',
                'image_url' => 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=900',
            ],
            [
                'category' => 'Keyboard',
                'name' => 'Roland GO:KEYS Keyboard',
                'sku' => 'KEY-ROL-GOKEYS',
                'price_sen' => 4700000,
                'stock_qty' => 8,
                'weight_gram' => 4500,
                'description' => 'Keyboard portable modern untuk latihan, produksi musik, dan performa.',
                'image_url' => 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900',
            ],
            [
                'category' => 'Keyboard',
                'name' => 'Yamaha PSR-E373 Portable Keyboard',
                'sku' => 'KEY-YMH-PSRE373',
                'price_sen' => 3850000,
                'stock_qty' => 7,
                'weight_gram' => 4600,
                'description' => 'Keyboard arranger portable dengan banyak voice dan style musik.',
                'image_url' => 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900',
            ],
            [
                'category' => 'Microphone',
                'name' => 'Shure SM58 Dynamic Microphone',
                'sku' => 'MIC-SHR-SM58',
                'price_sen' => 1450000,
                'stock_qty' => 15,
                'weight_gram' => 500,
                'description' => 'Microphone dynamic legendaris untuk vokal live dan studio sederhana.',
                'image_url' => 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900',
            ],
            [
                'category' => 'Microphone',
                'name' => 'Audio Technica AT2020 Condenser Microphone',
                'sku' => 'MIC-AT-2020',
                'price_sen' => 1950000,
                'stock_qty' => 9,
                'weight_gram' => 650,
                'description' => 'Microphone condenser untuk rekaman vocal, podcast, dan home studio.',
                'image_url' => 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900',
            ],
            [
                'category' => 'Audio Interface',
                'name' => 'Focusrite Scarlett Solo 3rd Gen',
                'sku' => 'AUD-FCS-SOLO3',
                'price_sen' => 2350000,
                'stock_qty' => 9,
                'weight_gram' => 800,
                'description' => 'Audio interface USB compact untuk rekaman vokal dan instrumen.',
                'image_url' => 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900',
            ],
            [
                'category' => 'Drum',
                'name' => 'Pearl Roadshow Drum Set',
                'sku' => 'DRM-PRL-RDS',
                'price_sen' => 7900000,
                'stock_qty' => 4,
                'weight_gram' => 25000,
                'description' => 'Drum set lengkap untuk latihan band, studio, dan panggung kecil.',
                'image_url' => 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=900',
            ],
            [
                'category' => 'Aksesoris',
                'name' => 'Guitar Stand Universal',
                'sku' => 'ACC-GTR-STAND',
                'price_sen' => 175000,
                'stock_qty' => 30,
                'weight_gram' => 900,
                'description' => 'Stand gitar universal yang kokoh untuk gitar akustik maupun elektrik.',
                'image_url' => 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900',
            ],
            [
                'category' => 'Aksesoris',
                'name' => 'Instrument Cable 3 Meter',
                'sku' => 'ACC-CBL-3M',
                'price_sen' => 85000,
                'stock_qty' => 40,
                'weight_gram' => 300,
                'description' => 'Kabel instrumen 3 meter untuk gitar, bass, keyboard, dan audio gear.',
                'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900',
            ],
        ];

        foreach ($products as $index => $item) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($item['category'])],
                [
                    'name' => $item['category'],
                    'description' => null,
                    'parent_id' => null,
                    'sort_order' => $index,
                ]
            );

            $product = Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']) . '-' . strtolower(Str::slug($item['sku'])),
                    'description' => $item['description'],
                    'price_sen' => $item['price_sen'],
                    'weight_gram' => $item['weight_gram'],
                    'is_bundle' => false,
                    'is_active' => true,
                ]
            );

            ProductVariation::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'name' => 'Default',
                ],
                [
                    'sku' => $item['sku'] . '-DEFAULT',
                    'price_sen' => null,
                    'stock_qty' => $item['stock_qty'],
                    'is_active' => true,
                ]
            );

            $product->images()->where('is_primary', true)->update([
                'is_primary' => false,
            ]);

            ProductImage::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'url' => $item['image_url'],
                ],
                [
                    'sort_order' => 0,
                    'is_primary' => true,
                ]
            );
        }
    }
}