<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminProductUploadTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@nadakita.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create category
        $this->category = Category::create([
            'name' => 'Gitar',
            'slug' => 'gitar',
            'description' => 'Kategori gitar',
            'sort_order' => 1,
        ]);
    }

    public function test_admin_can_upload_product_with_image(): void
    {
        Storage::fake('public');

        Sanctum::actingAs($this->adminUser);

        $image = UploadedFile::fake()->image('gitar-akustik.jpg', 600, 600);

        $payload = [
            'category_id' => $this->category->id,
            'name' => 'Gitar Akustik Yamaha FS800',
            'description' => 'Gitar akustik berkualitas tinggi',
            'price_sen' => 250000000, // Rp 2.500.000
            'weight_gram' => 2500,
            'sku' => 'YMH-FS800',
            'stock_qty' => 10,
            'is_active' => true,
            'image' => $image,
        ];

        $response = $this->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);

        // Verify product exists in database
        $product = Product::where('sku', 'YMH-FS800')->firstOrFail();
        $this->assertEquals('Gitar Akustik Yamaha FS800', $product->name);

        // Verify product image database entry
        $productImage = ProductImage::where('product_id', $product->id)->firstOrFail();
        $this->assertTrue($productImage->is_primary);
        $this->assertStringStartsWith('products/gitar-akustik-yamaha-fs800/', $productImage->url);
        
        // Assert storage has file
        Storage::disk('public')->assertExists($productImage->url);
    }

    public function test_admin_can_update_product_and_replace_image(): void
    {
        Storage::fake('public');

        Sanctum::actingAs($this->adminUser);

        // First, create a product
        $oldImage = UploadedFile::fake()->image('old-gitar.jpg', 600, 600);

        $payload = [
            'category_id' => $this->category->id,
            'name' => 'Gitar Akustik Yamaha FS800',
            'description' => 'Gitar akustik berkualitas tinggi',
            'price_sen' => 250000000,
            'weight_gram' => 2500,
            'sku' => 'YMH-FS800',
            'stock_qty' => 10,
            'is_active' => true,
            'image' => $oldImage,
        ];

        $createResponse = $this->postJson('/api/v1/admin/products', $payload);
        $createResponse->assertStatus(201);

        $product = Product::where('sku', 'YMH-FS800')->firstOrFail();
        $oldProductImage = ProductImage::where('product_id', $product->id)->firstOrFail();
        $oldPath = $oldProductImage->url;

        // Verify original image exists in storage
        Storage::disk('public')->assertExists($oldPath);

        // Now, update product with new image
        $newImage = UploadedFile::fake()->image('new-gitar.jpg', 800, 800);

        $updatePayload = [
            'category_id' => $this->category->id,
            'name' => 'Gitar Akustik Yamaha FS800 Updated',
            'description' => 'Gitar akustik berkualitas tinggi updated',
            'price_sen' => 260000000,
            'weight_gram' => 2500,
            'sku' => 'YMH-FS800',
            'stock_qty' => 8,
            'is_active' => true,
            'image' => $newImage,
        ];

        $updateResponse = $this->putJson("/api/v1/admin/products/{$product->id}", $updatePayload);
        $updateResponse->assertStatus(200);

        // Verify database updated
        $product->refresh();
        $this->assertEquals('Gitar Akustik Yamaha FS800 Updated', $product->name);

        // Verify old image is deleted from storage
        Storage::disk('public')->assertMissing($oldPath);

        // Verify new image is saved in storage and DB
        $newProductImage = ProductImage::where('product_id', $product->id)->firstOrFail();
        Storage::disk('public')->assertExists($newProductImage->url);
        $this->assertNotEquals($oldPath, $newProductImage->url);
        $this->assertStringStartsWith('products/gitar-akustik-yamaha-fs800-updated/', $newProductImage->url);
    }

    public function test_admin_can_upload_product_with_multiple_images(): void
    {
        Storage::fake('public');

        Sanctum::actingAs($this->adminUser);

        $payload = [
            'category_id' => $this->category->id,
            'name' => 'Gitar Multi Image Test',
            'description' => 'Produk test dengan beberapa gambar',
            'price_sen' => 250000000,
            'weight_gram' => 2500,
            'sku' => 'GTR-MULTI-IMG',
            'stock_qty' => 10,
            'is_active' => true,
            'images' => [
                UploadedFile::fake()->image('gitar-depan.jpg', 600, 600),
                UploadedFile::fake()->image('gitar-belakang.jpg', 600, 600),
                UploadedFile::fake()->image('gitar-detail.jpg', 600, 600),
            ],
        ];

        $response = $this->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201);

        $product = Product::where('sku', 'GTR-MULTI-IMG')->firstOrFail();
        $images = ProductImage::where('product_id', $product->id)
            ->orderBy('sort_order')
            ->get();

        $this->assertCount(3, $images);
        $this->assertTrue($images[0]->is_primary);
        $this->assertFalse($images[1]->is_primary);
        $this->assertFalse($images[2]->is_primary);

        foreach ($images as $image) {
            $this->assertStringStartsWith('products/gitar-multi-image-test/', $image->url);
            Storage::disk('public')->assertExists($image->url);
        }
    }

    public function test_admin_can_create_product_with_multiple_variations(): void
    {
        Storage::fake('public');

        Sanctum::actingAs($this->adminUser);

        $payload = [
            'category_id' => $this->category->id,
            'name' => 'Gitar Multi Variation Test',
            'description' => 'Produk test dengan beberapa variasi',
            'price_sen' => 250000000,
            'weight_gram' => 2500,
            'sku' => 'GTR-MULTI-VAR',
            'stock_qty' => 15,
            'is_active' => true,
            'variations' => [
                ['name' => 'Natural', 'stock_qty' => 10],
                ['name' => 'Hitam', 'stock_qty' => 5],
            ],
            'image' => UploadedFile::fake()->image('gitar-variasi.jpg', 600, 600),
        ];

        $response = $this->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201);

        $product = Product::where('sku', 'GTR-MULTI-VAR')->firstOrFail();
        $variations = ProductVariation::where('product_id', $product->id)
            ->orderBy('name')
            ->get();

        $this->assertCount(2, $variations);
        $this->assertEquals(['Hitam', 'Natural'], $variations->pluck('name')->all());
        $this->assertEquals(15, $variations->sum('stock_qty'));
    }
}
