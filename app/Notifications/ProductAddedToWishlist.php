<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductAddedToWishlist extends Notification
{
    use Queueable;

    protected $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Wishlist Diperbarui',
            'message' => "{$this->product->name} telah ditambahkan ke daftar keinginan Anda.",
            'product_id' => $this->product->id,
            'type' => 'wishlist'
        ];
    }
}
