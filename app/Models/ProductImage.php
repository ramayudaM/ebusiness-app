<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $appends = ['image_url'];

    protected $fillable = [
        'product_id',
        'url',
        'sort_order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->url) {
            return null;
        }

        if (filter_var($this->url, FILTER_VALIDATE_URL)) {
            return $this->url;
        }

        return asset('storage/' . $this->url);
    }
}