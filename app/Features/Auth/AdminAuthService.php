<?php
namespace App\Features\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthService
{
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi yang Anda masukkan salah.'],
            ]);
        }

        if ($user->role !== 'admin') {
            throw new \Exception('Akun ini tidak memiliki akses Admin.', 403);
        }

        if ($user->trashed()) {
            throw ValidationException::withMessages([
                'email' => ['Akun ini telah dinonaktifkan.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('admin_token', ['admin'])->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
