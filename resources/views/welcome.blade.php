<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>NadaKita — Toko Alat Musik Online</title>
    <meta name="description" content="Platform belanja alat musik online dengan fitur audio/video preview, pembayaran via Midtrans, dan kalkulasi ongkir via RajaOngkir.">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
