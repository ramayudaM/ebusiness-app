<?php
// Bootstrapping Laravel
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Bootstrapping Auth for testing
$user = \App\Models\User::first();
if (!$user) {
    echo "No user found in DB\n";
    exit;
}
\Illuminate\Support\Facades\Auth::login($user);

$address = \App\Models\Address::where('user_id', $user->id)->first();
if (!$address) {
    // Fallback to any address
    $address = \App\Models\Address::first();
}

if (!$address) {
    echo "No address found in DB\n";
    exit;
}

echo "Testing calculateShipping with User ID: {$user->id}, Address ID: {$address->id}...\n";

$request = new \Illuminate\Http\Request();
$request->merge(['address_id' => $address->id]);

$controller = app(\App\Http\Controllers\Api\V1\User\CheckoutController::class);
$response = $controller->calculateShipping($request);

echo "Response Status: " . $response->status() . "\n";
echo "Response Content:\n";
echo json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT) . "\n";
