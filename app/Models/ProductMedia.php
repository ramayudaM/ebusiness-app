<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductMedia extends Model
{
    use HasFactory;

    protected $table = 'product_media';

    public $timestamps = false;

    protected $appends = ['media_url', 'media_type'];

    protected $fillable = [
        'product_id',
        'type',
        'url',
        'label',
        'duration_seconds',
        'file_size_bytes',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the full URL for the media.
     */
    public function getMediaUrlAttribute(): ?string
    {
        if (!$this->url) {
            return null;
        }

        return asset('storage/' . $this->url);
    }

    /**
     * Get the type of media.
     */
    public function getMediaTypeAttribute(): string
    {
        return $this->type;
    }
}
