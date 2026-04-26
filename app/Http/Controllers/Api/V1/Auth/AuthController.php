<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Features\Auth\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * POST /api/v1/auth/register
     * Mendaftarkan customer baru.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Selamat datang di NadaKita!',
            'data'    => [
                'user'  => [
                    'id'    => $result['user']->id,
                    'name'  => $result['user']->name,
                    'email' => $result['user']->email,
                    'role'  => $result['user']->role,
                ],
                'token' => $result['token'],
            ],
        ], 201);
    }

    /**
     * POST /api/v1/auth/login
     * Login dengan email dan password.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            email:    $request->email,
            password: $request->password,
            remember: $request->boolean('remember', false),
        );

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'user'  => [
                    'id'    => $result['user']->id,
                    'name'  => $result['user']->name,
                    'email' => $result['user']->email,
                    'role'  => $result['user']->role,
                ],
                'token' => $result['token'],
            ],
        ]);
    }

    /**
     * POST /api/v1/auth/logout
     * Logout — hapus semua token aktif.
     * Endpoint ini MEMBUTUHKAN autentikasi (Bearer token).
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
            'data'    => null,
        ]);
    }
}
