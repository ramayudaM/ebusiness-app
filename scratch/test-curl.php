<?php
$ch = curl_init('https://api.rajaongkir.com/starter/province');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'key: vwzRkNya997aa653b22263c2Zr721pgE'
]);
// Force IPv4
curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
// Add timeout
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
// Disable SSL verification temporarily to test
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch) . "\n";
} else {
    echo "Success! Response length: " . strlen($response) . "\n";
    $data = json_decode($response, true);
    if(isset($data['rajaongkir']['results'])) {
        echo "Found " . count($data['rajaongkir']['results']) . " provinces.\n";
    } else {
        echo "Unexpected response:\n" . substr($response, 0, 200);
    }
}
curl_close($ch);
