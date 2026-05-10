<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'guest_email',
        'guest_name',

        'status',
        'payment_status',

        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'shipping_city',
        'shipping_province',
        'shipping_postal_code',
        'shipping_courier',
        'shipping_service',
        'shipping_cost_sen',
        'shipping_etd_days',

        'subtotal_sen',
        'total_sen',

        'payment_token',

        'tracking_number',
        'tracking_url',

        'processed_at',
        'shipped_at',
        'delivered_at',
        'completed_at',
        'cancelled_at',
        'paid_at',
        'expires_at',
    ];

    protected $casts = [
        'shipping_cost_sen' => 'integer',
        'subtotal_sen' => 'integer',
        'total_sen' => 'integer',

        'processed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function internalNotes(): HasMany
    {
        return $this->hasMany(OrderInternalNote::class)->latest();
    }
}