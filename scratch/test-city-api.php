<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

use Illuminate\Support\Facades\Http;

echo "Testing RajaOngkir API Cities Connection...\n";

try {
    $response = Http::timeout(10)->withHeaders([
        'key' => config('rajaongkir.api_key'),
        'User-Agent' => 'NadaKita/1.0'
    ])->get(config('rajaongkir.base_url') . '/city', ['province' => '9']);

    if ($response->successful()) {
        echo "SUCCESS! Cities found: " . count($response->json()['rajaongkir']['results']) . "\n";
    } else {
        echo "FAILED! Status: " . $response->status() . "\n";
        echo "Body: " . $response->body() . "\n";
    }
} catch (\Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
}
