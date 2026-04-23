<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE TABLE IF NOT EXISTS customer_profiles (
                id              BIGSERIAL PRIMARY KEY,
                user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                phone           VARCHAR(20) DEFAULT NULL,
                address         TEXT DEFAULT NULL,
                city            VARCHAR(100) DEFAULT NULL,
                province        VARCHAR(100) DEFAULT NULL,
                postal_code     VARCHAR(10) DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON customer_profiles (user_id)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS categories (
                id          BIGSERIAL PRIMARY KEY,
                parent_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL,
                name        VARCHAR(255) NOT NULL,
                slug        VARCHAR(255) NOT NULL UNIQUE,
                sort_order  INTEGER NOT NULL DEFAULT 0,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories (parent_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories (sort_order)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS products (
                id              BIGSERIAL PRIMARY KEY,
                category_id     BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
                name            VARCHAR(255) NOT NULL,
                slug            VARCHAR(255) NOT NULL UNIQUE,
                description     TEXT DEFAULT NULL,
                price_sen       BIGINT NOT NULL CHECK (price_sen >= 0),
                weight_gram     INTEGER NOT NULL CHECK (weight_gram > 0),
                sku             VARCHAR(100) NOT NULL UNIQUE,
                is_bundle       BOOLEAN NOT NULL DEFAULT FALSE,
                is_active       BOOLEAN NOT NULL DEFAULT TRUE,
                average_rating  NUMERIC(2,1) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
                review_count    INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at      TIMESTAMPTZ DEFAULT NULL
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin (name gin_trgm_ops)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS product_variations (
                id              BIGSERIAL PRIMARY KEY,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                name            VARCHAR(255) NOT NULL,
                sku             VARCHAR(100) NOT NULL UNIQUE,
                price_sen       BIGINT DEFAULT NULL CHECK (price_sen IS NULL OR price_sen >= 0),
                stock_qty       INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
                is_active       BOOLEAN NOT NULL DEFAULT TRUE,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_variations_product_id ON product_variations (product_id)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS product_images (
                id              BIGSERIAL PRIMARY KEY,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                url             VARCHAR(500) NOT NULL,
                sort_order      INTEGER NOT NULL DEFAULT 0,
                is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS product_media (
                id              BIGSERIAL PRIMARY KEY,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                type            media_type NOT NULL,
                url             VARCHAR(500) NOT NULL,
                label           VARCHAR(255) DEFAULT NULL,
                file_size_bytes BIGINT DEFAULT NULL CHECK (file_size_bytes IS NULL OR file_size_bytes > 0),
                duration_seconds INTEGER DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS product_media CASCADE');
        DB::statement('DROP TABLE IF EXISTS product_images CASCADE');
        DB::statement('DROP TABLE IF EXISTS product_variations CASCADE');
        DB::statement('DROP TABLE IF EXISTS products CASCADE');
        DB::statement('DROP TABLE IF EXISTS categories CASCADE');
        DB::statement('DROP TABLE IF EXISTS customer_profiles CASCADE');
    }
};
