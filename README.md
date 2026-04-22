# NadaKita — E-Commerce Platform Alat Musik

Platform belanja alat musik online dengan fitur audio/video preview instrumen,
pembayaran via Midtrans, dan kalkulasi ongkir via RajaOngkir.

## Tech Stack

| Layer     | Teknologi                                |
|-----------|------------------------------------------|
| Frontend  | React 18 + Vite 6 + TailwindCSS          |
| Backend   | Laravel 11 + PHP 8.3                     |
| Database  | PostgreSQL 15                            |
| Payment   | Midtrans Snap API                        |
| Shipping  | RajaOngkir Starter API                   |
| Container | Podman + Podman Compose (via Docker CLI) |

## Arsitektur

**Monolith** — React dijalankan di dalam Laravel menggunakan `laravel-vite-plugin`.
Tidak ada subfolder `backend/` atau `frontend/` yang terpisah.

```
Laravel (Port 8000 via Nginx)
├── routes/           → API routes (api.php) + SPA catch-all (web.php)
├── app/              → PHP backend (Controllers, Features, Models)
└── resources/js/     → Source code React (JSX, komponen, hooks)
```

---

## Prasyarat — Instalasi di Host Machine

> **Catatan:** PHP, Composer, dan PostgreSQL **tidak perlu** diinstall di host.
> Semua runtime berjalan di dalam Podman container.

Yang wajib diinstall di host:

- **Podman** ≥ 4.x
- **Docker Compose** (sebagai provider untuk `podman compose`)
- **Git** ≥ 2.x
- **Node.js** ≥ 20.x + **npm** ≥ 10.x *(dipakai untuk scaffold awal saja)*

---

### 1. Install Podman

#### Windows

1. Download Podman Desktop dari: https://podman-desktop.io/downloads
2. Jalankan installer dan ikuti petunjuknya.
3. Setelah selesai, buka terminal dan inisialisasi Podman Machine:

```powershell
podman machine init
podman machine start
```

4. Verifikasi instalasi:

```powershell
podman --version
# Output: podman version 5.x.x
```

#### macOS

```bash
brew install podman podman-desktop
podman machine init
podman machine start
podman --version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y podman
podman --version
```

---

### 2. Verifikasi `podman compose`

**Podman Desktop sudah menyertakan `podman compose` secara built-in** — tidak perlu menginstall Docker Compose secara terpisah.

Setelah Podman Desktop terinstall, verifikasi langsung di terminal:

```bash
podman compose --version
# Output: podman compose version x.x.x
```

Jika perintah di atas tidak ditemukan, pastikan Podman Desktop sudah berjalan (ikon muncul di system tray), lalu coba buka ulang terminal.

---

### 3. Install Git

```bash
# Windows: download dari https://git-scm.com/download/win
# macOS:
brew install git
# Linux:
sudo apt-get install git

git --version
# Output: git version 2.x.x
```

### 4. Install Node.js

Download dari https://nodejs.org (pilih versi LTS ≥ 20) atau gunakan nvm:

```bash
# Menggunakan nvm (rekomendasi)
nvm install 20
nvm use 20

node -v   # v20.x.x
npm -v    # 10.x.x
```

---

## Cara Menjalankan Project (Quick Start)

### Langkah 1 — Clone Repository

```bash
git clone <URL_REPOSITORY> nadakita-app
cd nadakita-app
```

### Langkah 2 — Konfigurasi Environment

Salin file contoh environment dan isi variabel yang dibutuhkan:

```bash
cp .env.example .env
```

Buka `.env` dan isi nilai berikut (wajib diisi sebelum container dijalankan):

```dotenv
# Database — sudah dikonfigurasi, jangan diubah
DB_HOST=db
DB_DATABASE=nadakita_db
DB_USERNAME=nadakita
DB_PASSWORD=secret

# Email — daftar gratis di https://mailtrap.io
MAIL_USERNAME=<username_mailtrap_anda>
MAIL_PASSWORD=<password_mailtrap_anda>

# Midtrans — daftar di https://dashboard.sandbox.midtrans.com
MIDTRANS_SERVER_KEY=<server_key_anda>
MIDTRANS_CLIENT_KEY=<client_key_anda>

# RajaOngkir — daftar di https://rajaongkir.com
RAJAONGKIR_API_KEY=<api_key_anda>
RAJAONGKIR_ORIGIN_CITY_ID=<id_kota_asal>
```

> **Tips:** `DB_HOST=db` adalah nama service Podman Compose, bukan `localhost`.
> Jangan diubah ke `127.0.0.1`.

### Langkah 3 — Build dan Jalankan Container

```bash
podman compose build
podman compose up -d
```

Tunggu hingga semua container berstatus `running`.
Verifikasi dengan:

```bash
podman ps
```

Output yang diharapkan:

```
CONTAINER ID  IMAGE                   COMMAND     STATUS          NAMES
xxxxxxxxxxxx  postgres:15-alpine      postgres    Up (healthy)    nadakita-db
xxxxxxxxxxxx  nadakita-app-app:latest php-fpm     Up              nadakita-app
xxxxxxxxxxxx  nginx:alpine            nginx ...   Up              nadakita-nginx
```

### Langkah 4 — Inisialisasi Laravel (hanya pertama kali)

```bash
# Generate application key
podman exec nadakita-app php artisan key:generate

# Jalankan migrasi database
podman exec nadakita-app php artisan migrate --seed

# Buat symlink storage
podman exec nadakita-app php artisan storage:link
```

### Langkah 5 — Jalankan Vite Dev Server

Buka terminal baru (biarkan container tetap berjalan di terminal sebelumnya):

```bash
podman exec nadakita-app npm run dev
```

Output yang diharapkan:

```
VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://0.0.0.0:5173/

  LARAVEL v11.x.x  plugin v1.x.x

  ➜  APP_URL: http://localhost:8000
```

### Langkah 6 — Buka di Browser

| URL                         | Keterangan                          |
|-----------------------------|-------------------------------------|
| http://localhost:8000       | Aplikasi utama (React via Nginx)    |
| http://localhost:8000/catalog | Halaman katalog (React Router)    |
| http://localhost:8000/admin | Panel admin                         |
| http://localhost:5432       | PostgreSQL (untuk tools seperti TablePlus) |

> **Penting:** Akses aplikasi melalui **port 8000**, bukan 5173.
> Port 5173 hanya dipakai untuk Vite HMR (Hot Module Replacement).

---

## Shortcut Perintah (Makefile)

```bash
make up        # Jalankan semua container (podman compose up -d)
make down      # Hentikan semua container
make build     # Rebuild image container
make shell     # Masuk ke shell container app (bash)
make migrate   # Jalankan php artisan migrate
make seed      # Jalankan php artisan db:seed
make logs      # Lihat log semua container secara live

# Contoh perintah artisan kustom:
make artisan route:list
make artisan make:model Product -m

# Contoh perintah npm kustom:
make npm install <package-name>
```

---

## Struktur Folder

```
nadakita-app/
├── app/
│   ├── Features/               # Service layer per fitur bisnis
│   │   ├── Auth/
│   │   ├── Catalog/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Wishlist/
│   │   ├── Review/
│   │   ├── Admin/
│   │   ├── Notification/
│   │   └── Webhook/
│   ├── Http/
│   │   ├── Controllers/Api/V1/ # Controller thin (hanya request/response)
│   │   ├── Requests/           # Form Request validation
│   │   └── Resources/          # API Resource transformer
│   ├── Models/
│   ├── Jobs/                   # Background queue jobs
│   ├── Mail/                   # Email Mailable templates
│   └── Policies/               # Authorization policies
├── resources/
│   ├── css/app.css             # Global CSS + TailwindCSS directives
│   ├── js/
│   │   ├── app.jsx             # Entry point React
│   │   ├── app/
│   │   │   ├── App.jsx         # Root component
│   │   │   └── routes.jsx      # React Router config
│   │   ├── features/           # Komponen + hooks per fitur
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── auth/
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   ├── review/
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   ├── shared/
│   │   │   ├── ui/             # Komponen UI reusable (Button, Input, Modal)
│   │   │   ├── hooks/          # Custom React hooks lintas fitur
│   │   │   ├── utils/          # Helper functions (format Rupiah, tanggal)
│   │   │   └── components/     # Komponen shared (Navbar, Footer)
│   │   └── lib/
│   │       ├── api.js          # Axios instance + interceptors
│   │       └── queryClient.js  # TanStack Query configuration
│   └── views/
│       └── welcome.blade.php   # Single Blade — entry point SPA
├── routes/
│   ├── api.php                 # API routes (prefix /api/v1)
│   └── web.php                 # Catch-all → React SPA
├── docker/
│   └── nginx/default.conf      # Konfigurasi Nginx
├── docker-compose.yml          # Konfigurasi Podman Compose
├── Dockerfile.dev              # Image development (PHP + Node)
├── Dockerfile                  # Image production
├── Makefile                    # Shortcut perintah
└── vite.config.js              # Konfigurasi Vite + laravel-vite-plugin
```

---

## Troubleshooting

### Container tidak mau start

```bash
# Lihat log container yang bermasalah
podman logs nadakita-app
podman logs nadakita-nginx
podman logs nadakita-db

# Restart ulang semua container
podman compose down
podman compose up -d
```

### Error: `DB_HOST` tidak bisa terhubung

Pastikan `DB_HOST=db` di file `.env` (bukan `127.0.0.1` atau `localhost`).
Nama `db` adalah nama service di `docker-compose.yml`.

### Error: `APP_KEY` kosong / tidak valid

```bash
podman exec nadakita-app php artisan key:generate
```

### Vite HMR tidak bekerja (perubahan JSX tidak auto-reload)

Pastikan `vite.config.js` sudah mengatur:

```js
server: {
  host: '0.0.0.0',
  hmr: { host: 'localhost' },
}
```

Lalu restart Vite dev server:

```bash
# Ctrl+C untuk stop, lalu:
podman exec nadakita-app npm run dev
```

### Port sudah dipakai (EADDRINUSE)

```bash
# Hentikan semua container
podman compose down

# Cek proses yang menggunakan port
netstat -ano | findstr :8000   # Windows
lsof -i :8000                  # macOS/Linux
```

### Reset database (hapus semua data, mulai dari awal)

```bash
podman exec nadakita-app php artisan migrate:fresh --seed
```

> ⚠️ **Peringatan:** Perintah ini akan menghapus **seluruh data** di database.

---

## Environment Variables

| Variable                    | Keterangan                                   | Contoh Nilai                     |
|-----------------------------|----------------------------------------------|----------------------------------|
| `APP_KEY`                   | Application key Laravel (auto-generated)     | `base64:xxx...`                  |
| `DB_HOST`                   | Host database — **harus** `db`               | `db`                             |
| `DB_DATABASE`               | Nama database                                | `nadakita_db`                    |
| `DB_USERNAME`               | Username PostgreSQL                          | `nadakita`                       |
| `DB_PASSWORD`               | Password PostgreSQL                          | `secret`                         |
| `MAIL_USERNAME`             | Username Mailtrap (untuk sandbox email)      | `xxxxxxxxxxxxxxxx`               |
| `MAIL_PASSWORD`             | Password Mailtrap                            | `xxxxxxxxxxxxxxxx`               |
| `MIDTRANS_SERVER_KEY`       | Server Key dari dashboard Midtrans sandbox   | `SB-Mid-server-xxx`              |
| `MIDTRANS_CLIENT_KEY`       | Client Key dari dashboard Midtrans sandbox   | `SB-Mid-client-xxx`              |
| `MIDTRANS_IS_PRODUCTION`    | `false` untuk sandbox, `true` untuk produksi | `false`                          |
| `RAJAONGKIR_API_KEY`        | API Key dari RajaOngkir                      | `xxxxxxxxxxxxxxxx`               |
| `RAJAONGKIR_ORIGIN_CITY_ID` | ID kota asal toko di RajaOngkir              | `501` (Jakarta)                  |
| `SENTRY_LARAVEL_DSN`        | DSN untuk error monitoring (opsional)        | `https://xxx@sentry.io/xxx`      |

---

## Layanan Eksternal yang Dibutuhkan

| Layanan    | URL Pendaftaran                             | Tier Gratis |
|------------|---------------------------------------------|-------------|
| Mailtrap   | https://mailtrap.io                         | ✅ Ya       |
| Midtrans   | https://dashboard.sandbox.midtrans.com      | ✅ Sandbox  |
| RajaOngkir | https://rajaongkir.com                      | ✅ Starter  |
| Sentry     | https://sentry.io                           | ✅ Ya       |
