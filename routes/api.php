<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\User\UserController;
use App\Http\Controllers\Api\V1\User\AddressController;
use App\Http\Controllers\Api\V1\User\CheckoutController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — NadaKita v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // HOMEPAGE
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

    // ===================================================================
    // PUBLIC CATALOG ROUTES — Tidak perlu login
    // ===================================================================
    Route::get('/categories', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'index'])->name('categories.index');
    Route::get('/products', [\App\Http\Controllers\Api\V1\Public\ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{slug}', [\App\Http\Controllers\Api\V1\Public\ProductController::class, 'show'])->name('products.show');

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

        // POST /api/v1/user/avatar
        Route::post('/user/avatar', [UserController::class, 'updateAvatar'])
            ->name('user.avatar.update');

        // CART
        Route::get('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'store'])->name('cart.store');
        Route::post('/cart/toggle-all', [\App\Http\Controllers\Api\V1\User\CartController::class, 'toggleAll'])->name('cart.toggle_all');
        Route::put('/cart/{id}', [\App\Http\Controllers\Api\V1\User\CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{id}', [\App\Http\Controllers\Api\V1\User\CartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'clear'])->name('cart.clear');
        
        // WISHLIST
        Route::get('/wishlist', [\App\Http\Controllers\Api\V1\User\WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/toggle', [\App\Http\Controllers\Api\V1\User\WishlistController::class, 'toggle'])->name('wishlist.toggle');

        // NOTIFICATIONS
        Route::get('/notifications', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'markAllAsRead'])->name('notifications.read_all');
        Route::delete('/notifications/clear-all', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'clearAll'])->name('notifications.clear_all');
        Route::delete('/notifications/{id}', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'destroy'])->name('notifications.destroy');

        // ADDRESSES
        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{id}', [AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
        Route::get('/provinces', [AddressController::class, 'getProvinces']);
        Route::get('/cities/{provinceId}', [AddressController::class, 'getCities']);

        // CHECKOUT
        Route::post('/checkout/shipping-cost', [CheckoutController::class, 'calculateShipping']);
        Route::post('/checkout/process', [CheckoutController::class, 'process']);
        Route::get('/checkout/verify/{orderNumber}', [CheckoutController::class, 'verify']);

        // ORDERS
        Route::get('/orders', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'index']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'show']);
        Route::post('/orders/{id}/cancel', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'cancel']);

    });

    // Public Midtrans Webhook
    Route::post('/payments/webhook', [\App\Http\Controllers\Api\V1\User\CheckoutController::class, 'webhook']);

    // ===================================================================
    // ADMIN ROUTES — Membutuhkan Bearer token + role admin
    // ===================================================================
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        // Tambahkan admin routes di sini pada langkah selanjutnya
        // Contoh: Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    });

});

