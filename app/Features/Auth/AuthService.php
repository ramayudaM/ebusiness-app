<?php

namespace App\Features\Auth;

use App\Models\User;
use App\Models\CustomerProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register customer baru.
     *
     * @param array $data ['name', 'email', 'password']
     * @return array ['user' => User, 'token' => string]
     */
    public function register(array $data): array
    {
        // 1. Buat user baru dengan role 'customer'
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'customer',
        ]);

        // 2. Buat customer profile kosong (bisa diisi nanti di halaman profil)
        CustomerProfile::create([
            'user_id' => $user->id,
        ]);

        // 3. Buat Sanctum Bearer token for API
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    /**
     * Login user dengan email + password.
     *
     * @param string $email
     * @param string $password
     * @param bool   $remember  Untuk remember me (session lebih panjang)
     * @return array ['user' => User, 'token' => string]
     * @throws ValidationException Jika kredensial salah
     */
    public function login(string $email, string $password, bool $remember = false): array
    {
        // 1. Cari user berdasarkan email
        $user = User::where('email', $email)->first();

        // 2. Cek apakah user ada dan password cocok
        //    PENTING: Jangan beri tahu ke user apakah email atau password yang salah
        //    Gunakan pesan generik untuk keamanan
        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // 3. Cek apakah akun masih aktif (tidak soft-deleted)
        if ($user->trashed()) {
            throw ValidationException::withMessages([
                'email' => ['Akun ini telah dinonaktifkan.'],
            ]);
        }

        // 4. Hapus semua token lama (opsional: satu device satu token)
        $user->tokens()->delete();

        // 5. Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    /**
     * Logout user — hapus semua token yang aktif.
     *
     * @param User $user
     * @return void
     */
    public function logout(User $user): void
    {
        // Hapus semua token Sanctum milik user ini
        $user->tokens()->delete();
    }

    /**
     * Update profil user dan customer profile.
     *
     * @param User  $user
     * @param array $data
     * @return User
     */
    public function updateProfile(User $user, array $data): User
    {
        // Update nama di tabel users jika ada
        if (isset($data['name'])) {
            $user->update(['name' => $data['name']]);
        }

        // Update atau buat customer profile
        $profileData = array_filter([
            'phone'       => $data['phone'] ?? null,
            'address'     => $data['address'] ?? null,
            'city'        => $data['city'] ?? null,
            'province'    => $data['province'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,
        ], fn($v) => $v !== null);

        if (! empty($profileData)) {
            $user->customerProfile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        }

        // Return user dengan profile terbaru
        return $user->fresh(['customerProfile']);
    }
}
