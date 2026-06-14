#!/bin/sh
set -eu

login_response="$(curl -s -X POST http://nginx/api/v1/admin/auth/login \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@nadakita.id","password":"password123"}')"

token="$(printf '%s' "$login_response" | php -r '$d=json_decode(stream_get_contents(STDIN), true); echo $d["data"]["token"] ?? "";')"

if [ -z "$token" ]; then
  echo "Login admin gagal"
  echo "$login_response"
  exit 1
fi

bad_id="$(php artisan tinker --execute 'echo \App\Models\Product::where("sku", "GTR-WEB-UPLOAD-20260614-040215")->value("id");' 2>/dev/null || true)"
if [ -n "$bad_id" ]; then
  curl -s -X DELETE "http://nginx/api/v1/admin/products/$bad_id" \
    -H "Authorization: Bearer $token" \
    -H 'Accept: application/json' >/dev/null
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
name="Gitar Admin Website Upload $timestamp"
sku="GTR-WEB-UPLOAD-$timestamp"
source="/tmp/admin-product-upload.png"

printf '%s' 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=' | base64 -d > "$source"

response="$(curl -s -X POST http://nginx/api/v1/admin/products \
  -H "Authorization: Bearer $token" \
  -H 'Accept: application/json' \
  -F category_id=1 \
  -F "name=$name" \
  -F 'description=Produk baru dibuat lewat endpoint website admin untuk validasi upload storage.' \
  -F price_sen=175000000 \
  -F weight_gram=2400 \
  -F "sku=$sku" \
  -F stock_qty=9 \
  -F is_active=1 \
  -F "image=@$source;type=image/png")"

printf '%s' "$response" | php -r '
$d = json_decode(stream_get_contents(STDIN), true);
if (!$d) {
    fwrite(STDERR, "Response bukan JSON valid\n");
    exit(2);
}
echo json_encode([
    "success" => $d["success"] ?? null,
    "message" => $d["message"] ?? null,
    "name" => $d["data"]["name"] ?? null,
    "sku" => $d["data"]["sku"] ?? null,
    "image" => $d["data"]["images"][0]["url"] ?? null,
], JSON_PRETTY_PRINT), PHP_EOL;
'
