<?php
$ch = curl_init('https://httpbin.org/get');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch) . "\n";
} else {
    echo "Success! Response length: " . strlen($response) . "\n";
}
curl_close($ch);
