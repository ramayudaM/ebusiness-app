<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_endpoint_returns_correct_structure(): void
    {
        $response = $this->getJson('/api/v1/home');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'hero' => [
                        'title',
                        'subtitle',
                        'image_url',
                        'cta_text',
                        'cta_link'
                    ],
                    'categories',
                    'flash_sale',
                    'new_arrivals'
                ]
            ]);
    }
}
