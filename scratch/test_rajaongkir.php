<?php
require 'vendor/autoload.php';
use Illuminate\Support\Facades\Http;

$apiKey = 'vwzRkNya997aa653b22263c2Zr721pgE';
$url = 'https://api.rajaongkir.com/starter/province';

echo "Testing RajaOngkir API connection...\n";
try {
    $response = Http::timeout(20)->withHeaders(['key' => $apiKey])->get($url);
    if ($response->successful()) {
        echo "Success! Received " . count($response->json()['rajaongkir']['results']) . " provinces.\n";
    } else {
        echo "Failed! Status: " . $response->status() . "\n";
        echo "Body: " . $response->body() . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
