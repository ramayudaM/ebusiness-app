<?php

use Illuminate\Support\Facades\Route;

/*
 * Semua route web dikembalikan ke React.
 * Laravel hanya melayani satu halaman (index) sebagai entry point SPA.
 * React Router akan menangani semua navigasi di sisi klien.
 *
 * Route API terpisah di routes/api.php dengan prefix /api/v1.
 */
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*');
