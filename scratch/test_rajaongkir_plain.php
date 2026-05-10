<?php
$apiKey = 'vwzRkNya997aa653b22263c2Zr721pgE';
$url = 'https://api.rajaongkir.com/starter/province';

echo "Testing RajaOngkir API connection with plain PHP...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["key: $apiKey"]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Just in case of cert issues

$response = curl_exec($ch);
$err = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    echo "cURL Error: " . $err . "\n";
} else {
    echo "Status: $httpCode\n";
    echo "Body: " . substr($response, 0, 500) . "...\n";
}
