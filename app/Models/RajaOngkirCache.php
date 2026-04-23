<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RajaOngkirCache extends Model
{
    protected $table = 'raja_ongkir_cache';

    protected $fillable = [
        'cache_key',
        'cache_value',
        'expires_at',
    ];

    protected $casts = [
        'cache_value' => 'json',
        'expires_at' => 'datetime',
    ];
}
