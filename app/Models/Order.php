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

    protected $appends = ['payment_status'];

    protected $fillable = [
        'order_number',
        'user_id',
        'guest_email',
        'guest_name',

        'status',

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
        'courier',

        'processed_at',
        'shipped_at',
        'delivered_at',
        'completed_at',
        'cancelled_at',
        'paid_at',
        'expires_at',

        'customer_notes',
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

    public function getPaymentStatusAttribute($value): ?string
    {
        if ($value) {
            return $value;
        }

        $transactionStatus = $this->relationLoaded('payment')
            ? $this->payment?->transaction_status
            : $this->payment()->value('transaction_status');

        return match ($transactionStatus) {
            'settlement' => 'paid',
            'expire' => 'expired',
            'failure', 'cancel' => 'failed',
            'pending' => 'pending',
            default => $transactionStatus ? (string) $transactionStatus : 'unpaid',
        };
    }

    public function restoreVariationStock(): void
    {
        $this->loadMissing('items');

        foreach ($this->items as $item) {
            if (! $item->variation_id) {
                continue;
            }

            ProductVariation::whereKey($item->variation_id)->increment('stock_qty', $item->qty);
        }
    }
}
