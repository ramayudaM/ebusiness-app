<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — NadaKita v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ===================================================================
    // AUTH ROUTES — Tidak perlu login
    // ===================================================================
    Route::prefix('auth')->group(function () {

        // POST /api/v1/auth/register
        Route::post('/register', [AuthController::class, 'register'])
            ->name('auth.register');

        // POST /api/v1/auth/login
        Route::post('/login', [AuthController::class, 'login'])
            ->name('auth.login');

    });

    // ===================================================================
    // ADMIN AUTH ROUTES
    // ===================================================================
    Route::prefix('admin')->group(function () {
        Route::post('/auth/login', [
            \App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'login'
        ])->name('admin.auth.login');

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::post('/auth/logout', [
                \App\Http\Controllers\Api\V1\Admin\AdminAuthController::class, 'logout'
            ])->name('admin.auth.logout');
        });
    });

    // ===================================================================
    // PROTECTED ROUTES — Membutuhkan Bearer token
    // ===================================================================
    Route::middleware(['auth:sanctum'])->group(function () {

        // POST /api/v1/auth/logout
        Route::post('/auth/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        // GET  /api/v1/user/profile
        Route::get('/user/profile', [UserController::class, 'profile'])
            ->name('user.profile');

        // PUT  /api/v1/user/profile
        Route::put('/user/profile', [UserController::class, 'updateProfile'])
            ->name('user.profile.update');

    });

    // ===================================================================
    // ADMIN ROUTES — Membutuhkan Bearer token + role admin
    // ===================================================================
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        // Tambahkan admin routes di sini pada langkah selanjutnya
        // Contoh: Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    });

});

