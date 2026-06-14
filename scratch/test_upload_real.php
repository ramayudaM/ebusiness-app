<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\Admin\AdminProductController;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// 1. Authenticate as Admin
$admin = User::where('role', 'admin')->first();
if (!$admin) {
    echo "ERROR: Admin user not found in database!\n";
    exit(1);
}
auth()->login($admin);
echo "Logged in as Admin: {$admin->email}\n";

// 2. Prepare fake file to upload (using real storage temp path)
$tempFile = tempnam(sys_get_temp_dir(), 'test_img');
$imageContent = file_get_contents('https://placehold.co/400x400/png?text=Test+Product');
if ($imageContent === false) {
    // Fallback to locally generated dummy image data if network is unavailable
    $im = imagecreatetruecolor(400, 400);
    $text_color = imagecolorallocate($im, 233, 14, 91);
    imagestring($im, 5, 100, 190,  'NadaKita Test Product', $text_color);
    ob_start();
    imagepng($im);
    $imageContent = ob_get_clean();
    imagedestroy($im);
}
file_put_contents($tempFile, $imageContent);

$uploadedFile = new UploadedFile(
    $tempFile,
    'produk-test-real.png',
    'image/png',
    null,
    true // test mode
);

// 3. Construct Request
$category = \App\Models\Category::first();
if (!$category) {
    echo "ERROR: Category not found. Seeding Category first...\n";
    exit(1);
}

$request = new Request();
$request->setMethod('POST');
$request->request->add([
    'category_id' => $category->id, // Use dynamic category ID
    'name' => 'Gitar Custom Test Admin ' . date('Ymd-His'),
    'description' => 'Produk test untuk memastikan fitur upload gambar produk bekerja secara real di local storage.',
    'price_sen' => 125000000, // Rp 1.250.000
    'weight_gram' => 2000,
    'sku' => 'GTR-CUST-TEST-' . time(),
    'stock_qty' => 15,
    'is_active' => true,
]);
$request->files->add(['image' => $uploadedFile]);

// 4. Call Controller Store Method
echo "Calling AdminProductController@store...\n";
$controller = app(AdminProductController::class);
$response = $controller->store($request);

echo "Response Status: " . $response->getStatusCode() . "\n";
echo "Response Body: \n";
$responseData = json_decode($response->getContent(), true);
print_r($responseData);

// 5. Clean up temp file
if (file_exists($tempFile)) {
    unlink($tempFile);
}

// 6. Verify file exists in public storage
if (isset($responseData['success']) && $responseData['success'] && isset($responseData['data']['images'][0]['url'])) {
    $savedPath = $responseData['data']['images'][0]['url'];
    echo "Saved image path in DB: {$savedPath}\n";
    $disk = Storage::disk('public');
    if ($disk->exists($savedPath)) {
        echo "SUCCESS: File exists in public storage!\n";
        echo "Public URL: " . $disk->url($savedPath) . "\n";
    } else {
        echo "FAILED: File NOT found in public storage!\n";
    }
} else {
    echo "FAILED: Response format unexpected or product creation failed.\n";
}
