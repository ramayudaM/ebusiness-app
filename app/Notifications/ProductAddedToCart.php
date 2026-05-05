<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductAddedToCart extends Notification
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
            'title' => 'Keranjang Diperbarui',
            'message' => "{$this->product->name} telah ditambahkan ke keranjang belanja Anda.",
            'product_id' => $this->product->id,
            'type' => 'cart'
        ];
    }
}
