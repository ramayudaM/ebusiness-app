# Testing Auth System - NadaKita

## Cara Test Register & Login

### 1. Jalankan Backend (Laravel)
```bash
php artisan serve
```
Backend akan jalan di: `http://localhost:8000`

### 2. Jalankan Frontend (React)
```bash
npm run dev
```
Frontend akan jalan di: `http://localhost:5173`

### 3. Test Register User Baru
1. Buka: `http://localhost:5173/register`
2. Isi form:
   - Nama: Naomi
   - Email: naomi@email.com
   - Password: password123
   - Konfirmasi Password: password123
   - Centang "Setuju dengan Syarat & Ketentuan"
3. Klik "Daftar"
4. Jika berhasil, akan otomatis login dan redirect ke homepage

### 4. Test Login
1. Buka: `http://localhost:5173/login`
2. Isi form:
   - Email: naomi@email.com
   - Password: password123
3. Klik "MASUK"
4. Jika berhasil, akan redirect ke homepage (customer) atau dashboard (admin)

### 5. Test Customer Profile
1. Setelah login, klik "Akun Saya" di navbar
2. Atau akses: `http://localhost:5173/customer/profile`
3. Anda akan melihat:
   - Avatar dengan inisial nama
   - Data diri (nama & email)
   - Kontak & alamat (bisa di-edit)
   - Keamanan (ubah password)
   - Notifikasi (toggle email & promo)
   - Tombol logout

## API Endpoints yang Digunakan

### Register
- **POST** `/api/v1/auth/register`
- Body:
```json
{
  "name": "Naomi",
  "email": "naomi@email.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Login
- **POST** `/api/v1/auth/login`
- Body:
```json
{
  "email": "naomi@email.com",
  "password": "password123",
  "remember": false
}
```

### Logout
- **POST** `/api/v1/auth/logout`
- Headers: `Authorization: Bearer {token}`

### Get Profile
- **GET** `/api/v1/user/profile`
- Headers: `Authorization: Bearer {token}`

### Update Profile
- **PUT** `/api/v1/user/profile`
- Headers: `Authorization: Bearer {token}`
- Body:
```json
{
  "phone": "081234567890",
  "address": "Jl. Melodi Indah No. 42, Jakarta Selatan, 12345"
}
```

## Database
User akan tersimpan di tabel `users` dengan struktur:
- id
- name
- email
- password (hashed)
- role (default: 'customer')
- phone (nullable)
- address (nullable)
- email_verified_at (nullable)
- created_at
- updated_at

## Fitur yang Sudah Terintegrasi
✅ Register dengan validasi
✅ Login dengan remember me
✅ Logout dengan hapus token
✅ Protected routes (harus login)
✅ Auto redirect berdasarkan role
✅ Token management (localStorage + Bearer)
✅ Error handling global
✅ Customer profile page
✅ Update profile (phone & address)
✅ Password strength indicator
✅ Form validation
