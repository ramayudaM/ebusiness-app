<?php

use App\Http\Controllers\Api\V1\Admin\AdminProductController;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$admin = User::where('role', 'admin')->firstOrFail();
auth()->login($admin);

echo "Logged in as admin: {$admin->email}\n";

$controller = app(AdminProductController::class);
$oldName = 'Gitar Custom Test Admin 20260614-021427';
$oldProduct = Product::with('images')->where('name', $oldName)->first();
$sourceImagePath = null;

if ($oldProduct) {
    $sourceImagePath = $oldProduct->images->first()?->url;
    $deleteResponse = $controller->destroy($oldProduct);
    echo "Deleted old product '{$oldName}' with status {$deleteResponse->getStatusCode()}\n";
} else {
    echo "Old product '{$oldName}' was not found.\n";
}

Product::where('name', 'like', 'Gitar Custom Admin Storage Check%')
    ->get()
    ->each(function (Product $product) use ($controller) {
        $response = $controller->destroy($product);
        echo "Deleted previous storage-check product '{$product->name}' with status {$response->getStatusCode()}\n";
    });

$disk = Storage::disk('public');
$sourceAbsolutePath = $sourceImagePath && $disk->exists($sourceImagePath)
    ? $disk->path($sourceImagePath)
    : storage_path('app/public/products/hJ41n0uUPPfaJSXHXxIUUvxMPOvOS7xfsrfoCqq4.jpg');

if (!file_exists($sourceAbsolutePath)) {
    throw new RuntimeException("No source image found at {$sourceAbsolutePath}");
}

$tempFile = tempnam(sys_get_temp_dir(), 'admin_product_image_');
copy($sourceAbsolutePath, $tempFile);

$category = Category::where('name', 'Gitar')->first() ?? Category::firstOrFail();
$timestamp = date('Ymd-His');
$newName = "Gitar Custom Admin Storage Check {$timestamp}";
$newSku = 'GTR-ADMIN-STORAGE-' . $timestamp;

$request = Request::create('/api/v1/admin/products', 'POST', [
    'category_id' => $category->id,
    'name' => $newName,
    'description' => 'Produk test admin untuk verifikasi folder media per produk.',
    'price_sen' => 135000000,
    'weight_gram' => 2200,
    'sku' => $newSku,
    'stock_qty' => 12,
    'is_active' => true,
]);

$request->files->set('image', new UploadedFile(
    $tempFile,
    'admin-storage-check-image',
    mime_content_type($tempFile) ?: 'image/png',
    null,
    true
));

$storeResponse = $controller->store($request);
$storeData = json_decode($storeResponse->getContent(), true);

echo "Created new product with status {$storeResponse->getStatusCode()}\n";
echo "Product name: {$storeData['data']['name']}\n";
echo "Product slug: {$storeData['data']['slug']}\n";

$imagePath = $storeData['data']['images'][0]['url'] ?? null;
$expectedPrefix = 'products/' . Str::slug($newName) . '/';

echo "Image DB path: {$imagePath}\n";
echo "Expected prefix: {$expectedPrefix}\n";
echo "Storage exists: " . ($imagePath && $disk->exists($imagePath) ? 'yes' : 'no') . "\n";
echo "Public path exists: " . ($imagePath && file_exists(public_path('storage/' . $imagePath)) ? 'yes' : 'no') . "\n";

if ($imagePath && !str_starts_with($imagePath, $expectedPrefix)) {
    throw new RuntimeException("Image path does not use expected product folder.");
}

if ($imagePath && !$disk->exists($imagePath)) {
    throw new RuntimeException("Image file is missing from public storage.");
}

if (file_exists($tempFile)) {
    unlink($tempFile);
}
