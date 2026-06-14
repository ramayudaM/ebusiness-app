<?php

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rows = Product::with('images')
    ->orderBy('id')
    ->get()
    ->map(function (Product $product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'images' => $product->images->map(function ($image) {
                $isRemote = filter_var($image->url, FILTER_VALIDATE_URL) !== false;

                return [
                    'url' => $image->url,
                    'type' => $isRemote ? 'remote_url' : 'local_storage',
                    'exists' => $isRemote ? null : Storage::disk('public')->exists($image->url),
                ];
            })->all(),
        ];
    });

echo json_encode($rows, JSON_PRETTY_PRINT), PHP_EOL;
