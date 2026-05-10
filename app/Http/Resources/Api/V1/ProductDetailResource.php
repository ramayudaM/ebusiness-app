<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'weight_gram' => $this->weight_gram,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ],
            // Check if variations exist. If empty, the frontend needs to handle this.
            'variations' => $this->variations->map(function ($variation) {
                return [
                    'id' => $variation->id,
                    'sku' => $variation->sku,
                    'name' => $variation->name, // e.g., "Red", "M"
                    'price_sen' => $variation->price_sen,
                    'stock_qty' => $variation->stock_qty,
                    'is_active' => $variation->is_active,
                ];
            }),
            'has_variations' => $this->variations->isNotEmpty(),
            
            // Format images, with a fallback placeholder if no images exist
            'images' => $this->images->isNotEmpty() ? $this->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->image_url,
                    'is_primary' => $image->is_primary,
                ];
            }) : [
                [
                    'id' => null,
                    'url' => null, // Frontend will use ImageFallback
                    'is_primary' => true
                ]
            ],

            'media' => $this->media->map(function ($media) {
                return [
                    'id' => $media->id,
                    'media_type' => $media->media_type,
                    'media_url' => $media->media_url,
                    'label' => $media->label,
                    'duration' => $media->duration_seconds,
                ];
            }),

            'reviews' => $this->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'name' => $review->user?->name,
                        'avatar' => $review->user?->avatar,
                    ],
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('Y-m-d H:i:s'),
                ];
            }),
            
            'average_rating' => $this->average_rating,
            'total_reviews' => $this->reviews_count ?? $this->reviews->count(),
            'is_active' => $this->is_active,
            'price_sen' => $this->price_sen, // Base price
            'primary_image_url' => $this->primary_image_url,
        ];
    }
}
