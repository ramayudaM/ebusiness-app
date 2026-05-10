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
    /*
    |--------------------------------------------------------------------------
    | Public Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])
        ->name('home');

    Route::get('/categories', [\App\Http\Controllers\Api\V1\Public\CategoryController::class, 'index'])
        ->name('categories.index');

    Route::get('/products', [\App\Http\Controllers\Api\V1\Public\ProductController::class, 'index'])
        ->name('products.index');

    Route::get('/products/{slug}', [\App\Http\Controllers\Api\V1\Public\ProductController::class, 'show'])
        ->name('products.show');

    /*
    |--------------------------------------------------------------------------
    | Auth Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])
            ->name('auth.register');

        Route::post('/login', [AuthController::class, 'login'])
            ->name('auth.login');
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Auth Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin')->group(function () {
        Route::post('/auth/login', [
            \App\Http\Controllers\Api\V1\Admin\AdminAuthController::class,
            'login',
        ])->name('admin.auth.login');

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::post('/auth/logout', [
                \App\Http\Controllers\Api\V1\Admin\AdminAuthController::class,
                'logout',
            ])->name('admin.auth.logout');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Protected Customer Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        Route::get('/user/profile', [UserController::class, 'profile'])
            ->name('user.profile');

        Route::put('/user/profile', [UserController::class, 'updateProfile'])
            ->name('user.profile.update');

        Route::post('/user/avatar', [UserController::class, 'updateAvatar'])
            ->name('user.avatar.update');

        /*
        |--------------------------------------------------------------------------
        | Cart
        |--------------------------------------------------------------------------
        */

        Route::get('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'index'])
            ->name('cart.index');

        Route::post('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'store'])
            ->name('cart.store');

        Route::post('/cart/toggle-all', [\App\Http\Controllers\Api\V1\User\CartController::class, 'toggleAll'])
            ->name('cart.toggle_all');

        Route::put('/cart/{id}', [\App\Http\Controllers\Api\V1\User\CartController::class, 'update'])
            ->name('cart.update');

        Route::delete('/cart/{id}', [\App\Http\Controllers\Api\V1\User\CartController::class, 'destroy'])
            ->name('cart.destroy');

        Route::delete('/cart', [\App\Http\Controllers\Api\V1\User\CartController::class, 'clear'])
            ->name('cart.clear');

        /*
        |--------------------------------------------------------------------------
        | Wishlist
        |--------------------------------------------------------------------------
        */

        Route::get('/wishlist', [\App\Http\Controllers\Api\V1\User\WishlistController::class, 'index'])
            ->name('wishlist.index');

        Route::post('/wishlist/toggle', [\App\Http\Controllers\Api\V1\User\WishlistController::class, 'toggle'])
            ->name('wishlist.toggle');

        /*
        |--------------------------------------------------------------------------
        | Notifications
        |--------------------------------------------------------------------------
        */

        Route::get('/notifications', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'index'])
            ->name('notifications.index');

        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');

        Route::post('/notifications/read-all', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'markAllAsRead'])
            ->name('notifications.read_all');

        Route::delete('/notifications/clear-all', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'clearAll'])
            ->name('notifications.clear_all');

        Route::delete('/notifications/{id}', [\App\Http\Controllers\Api\V1\User\NotificationController::class, 'destroy'])
            ->name('notifications.destroy');

        /*
        |--------------------------------------------------------------------------
        | Addresses
        |--------------------------------------------------------------------------
        */

        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{id}', [AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
        Route::get('/provinces', [AddressController::class, 'getProvinces']);
        Route::get('/cities/{provinceId}', [AddressController::class, 'getCities']);

        /*
        |--------------------------------------------------------------------------
        | Checkout
        |--------------------------------------------------------------------------
        */

        Route::post('/checkout/shipping-cost', [CheckoutController::class, 'calculateShipping']);
        Route::post('/checkout/process', [CheckoutController::class, 'process']);
        Route::get('/checkout/verify/{orderNumber}', [CheckoutController::class, 'verify']);

        /*
        |--------------------------------------------------------------------------
        | Customer Orders
        |--------------------------------------------------------------------------
        */

        Route::get('/orders', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'index']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'show']);
        Route::post('/orders/{id}/cancel', [\App\Http\Controllers\Api\V1\User\OrderController::class, 'cancel']);
    });

    /*
    |--------------------------------------------------------------------------
    | Public Midtrans Webhook
    |--------------------------------------------------------------------------
    */

    Route::post('/payments/webhook', [
        \App\Http\Controllers\Api\V1\User\CheckoutController::class,
        'webhook',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard/overview', [
            \App\Http\Controllers\Api\V1\Admin\AdminDashboardController::class,
            'overview',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Categories & Products
        |--------------------------------------------------------------------------
        */

        Route::apiResource('/categories', \App\Http\Controllers\Api\V1\Admin\AdminCategoryController::class);
        Route::apiResource('/products', \App\Http\Controllers\Api\V1\Admin\AdminProductController::class);

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */

        Route::get('/orders', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'index',
        ]);

        Route::get('/orders/{order}', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'show',
        ]);

        Route::patch('/orders/{order}/status', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'updateStatus',
        ]);

        Route::patch('/orders/{order}/payment-status', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'updatePaymentStatus',
        ]);

        Route::patch('/orders/{order}/tracking-number', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'updateTrackingNumber',
        ]);

        Route::post('/orders/{order}/notes', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'addInternalNote',
        ]);

        Route::post('/orders/{order}/notify', [
            \App\Http\Controllers\Api\V1\Admin\AdminOrderController::class,
            'notifyCustomer',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Customers
        |--------------------------------------------------------------------------
        */

        Route::get('/customers', [
            \App\Http\Controllers\Api\V1\Admin\AdminCustomerController::class,
            'index',
        ]);

        Route::get('/customers/{id}', [
            \App\Http\Controllers\Api\V1\Admin\AdminCustomerController::class,
            'show',
        ]);

        Route::patch('/customers/{id}/deactivate', [
            \App\Http\Controllers\Api\V1\Admin\AdminCustomerController::class,
            'deactivate',
        ]);

        Route::patch('/customers/{id}/restore', [
            \App\Http\Controllers\Api\V1\Admin\AdminCustomerController::class,
            'restore',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Reviews
        |--------------------------------------------------------------------------
        */

        Route::get('/reviews', [
            \App\Http\Controllers\Api\V1\Admin\AdminReviewController::class,
            'index',
        ]);

        Route::patch('/reviews/{review}/visibility', [
            \App\Http\Controllers\Api\V1\Admin\AdminReviewController::class,
            'updateVisibility',
        ]);

        Route::delete('/reviews/{review}', [
            \App\Http\Controllers\Api\V1\Admin\AdminReviewController::class,
            'destroy',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Reports
        |--------------------------------------------------------------------------
        */

        Route::get('/reports/overview', [
            \App\Http\Controllers\Api\V1\Admin\AdminReportController::class,
            'overview',
        ]);
    });
});