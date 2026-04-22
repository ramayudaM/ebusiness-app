# NadaKita — E-Commerce Platform Alat Musik

Platform belanja alat musik online dengan fitur audio/video preview,
pembayaran via Midtrans, dan kalkulasi ongkir via RajaOngkir.

## Tech Stack
- Frontend : React 18 + Vite 5 + JavaScript + TailwindCSS (di dalam Laravel)
- Backend  : Laravel 11 + PHP 8.3
- Database : PostgreSQL 15
- Payment  : Midtrans Snap API
- Shipping : RajaOngkir Starter API
- Container: Podman + Podman Compose

## Arsitektur
Monolith — React dijalankan di dalam Laravel menggunakan laravel-vite-plugin.
Tidak ada subfolder backend/frontend yang terpisah.

## Cara Menjalankan
1. Salin .env.example ke .env dan isi variabel yang dibutuhkan
2. podman compose up -d
3. podman exec -it nadakita-app php artisan migrate --seed
4. Buka http://localhost:8000
