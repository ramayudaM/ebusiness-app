<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>NadaKita — Toko Alat Musik Online</title>
    <meta name="description" content="Platform belanja alat musik online dengan fitur audio/video preview, pembayaran via Midtrans, dan kalkulasi ongkir via RajaOngkir.">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <script>
        window.onerror = function(message, source, lineno, colno, error) {
            document.body.innerHTML += '<div style="color:red; background:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%; font-family:monospace;"><h3>Global Error:</h3><p>' + message + '</p><p>Line: ' + lineno + '</p><pre>' + (error && error.stack ? error.stack : '') + '</pre></div>';
        };
        window.addEventListener('unhandledrejection', function(event) {
            document.body.innerHTML += '<div style="color:red; background:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%; font-family:monospace;"><h3>Unhandled Promise Rejection:</h3><pre>' + (event.reason && event.reason.stack ? event.reason.stack : event.reason) + '</pre></div>';
        });
    </script>
    <div id="root"></div>
</body>
</html>
