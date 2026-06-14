<?php

use App\Models\ProductImage;
use App\Models\ProductMedia;
use Illuminate\Support\Facades\Storage;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$disk = Storage::disk('public');

$references = collect()
    ->merge(ProductImage::query()->pluck('url'))
    ->merge(ProductMedia::query()->pluck('url'))
    ->filter()
    ->reject(fn ($path) => filter_var($path, FILTER_VALIDATE_URL))
    ->map(fn ($path) => ltrim(str_replace('\\', '/', $path), '/'))
    ->unique()
    ->values();

$referenced = array_flip($references->all());
$files = collect($disk->allFiles('products'))
    ->map(fn ($path) => ltrim(str_replace('\\', '/', $path), '/'))
    ->values();

$orphans = $files
    ->reject(fn ($path) => isset($referenced[$path]))
    ->values();

foreach ($orphans as $path) {
    $disk->delete($path);
}

$remainingFiles = collect($disk->allFiles('products'))->count();

echo json_encode([
    'referenced_local_files' => count($referenced),
    'files_before' => $files->count(),
    'deleted_orphans' => $orphans->count(),
    'files_after' => $remainingFiles,
    'deleted' => $orphans->all(),
], JSON_PRETTY_PRINT), PHP_EOL;
