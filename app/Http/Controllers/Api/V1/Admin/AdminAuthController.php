<?php
namespace App\Http\Controllers\Api\V1\Admin;

use App\Features\Auth\AdminAuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function __construct(
        private readonly AdminAuthService $adminAuthService
    ) {}

    public function login(AdminLoginRequest $request): JsonResponse
    {
        try {
            $result = $this->adminAuthService->login(
                $request->email,
                $request->password
            );

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil.',
                'data' => [
                    'user' => [
                        'id'    => $result['user']->id,
                        'name'  => $result['user']->name,
                        'email' => $result['user']->email,
                        'role'  => $result['user']->role,
                    ],
                    'token' => $result['token'],
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi yang Anda masukkan salah.',
                'code'    => 'INVALID_CREDENTIALS',
                'errors'  => $e->errors(),
            ], 401);

        } catch (\Exception $e) {
            $code = $e->getCode() === 403 ? 403 : 500;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code'    => $code === 403 ? 'FORBIDDEN' : 'SERVER_ERROR',
            ], $code);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $this->adminAuthService->logout($request->user());
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
            'data'    => null,
        ], 200);
    }
}
