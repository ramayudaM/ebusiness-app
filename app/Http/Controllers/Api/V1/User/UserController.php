<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Features\Auth\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * GET /api/v1/user/profile
     * Mendapatkan data profil user yang sedang login.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load('customerProfile');

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'profile' => $user->customerProfile ? [
                    'phone'       => $user->customerProfile->phone,
                    'address'     => $user->customerProfile->address,
                    'city'        => $user->customerProfile->city,
                    'province'    => $user->customerProfile->province,
                    'postal_code' => $user->customerProfile->postal_code,
                ] : null,
            ],
        ]);
    }

    /**
     * PUT /api/v1/user/profile
     * Update profil user yang sedang login.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->authService->updateProfile(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'profile' => $user->customerProfile ? [
                    'phone'       => $user->customerProfile->phone,
                    'address'     => $user->customerProfile->address,
                    'city'        => $user->customerProfile->city,
                    'province'    => $user->customerProfile->province,
                    'postal_code' => $user->customerProfile->postal_code,
                ] : null,
            ],
        ]);
    }
}
