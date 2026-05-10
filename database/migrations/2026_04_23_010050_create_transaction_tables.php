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
            CREATE TABLE IF NOT EXISTS bundles (
                id                  BIGSERIAL PRIMARY KEY,
                product_id          BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
                bundle_price_sen    BIGINT NOT NULL CHECK (bundle_price_sen >= 0),
                created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS bundle_items (
                id              BIGSERIAL PRIMARY KEY,
                bundle_id       BIGINT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                variation_id     BIGINT REFERENCES product_variations(id) ON DELETE SET NULL,
                qty             INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT bundle_items_product_unique UNIQUE (bundle_id, product_id, variation_id)
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS carts (
                id              BIGSERIAL PRIMARY KEY,
                user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
                session_id      VARCHAR(100) DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT carts_user_or_session CHECK (
                    (user_id IS NOT NULL AND session_id IS NULL) OR
                    (user_id IS NULL AND session_id IS NOT NULL)
                )
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS cart_items (
                id              BIGSERIAL PRIMARY KEY,
                user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                product_variation_id BIGINT REFERENCES product_variations(id) ON DELETE CASCADE,
                quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
                is_selected     BOOLEAN NOT NULL DEFAULT TRUE,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS orders (
                id                  BIGSERIAL PRIMARY KEY,
                order_number        VARCHAR(50) NOT NULL UNIQUE,
                user_id             BIGINT REFERENCES users(id) ON DELETE SET NULL,
                guest_email         VARCHAR(255) DEFAULT NULL,
                guest_name          VARCHAR(255) DEFAULT NULL,
                status              order_status NOT NULL DEFAULT 'PENDING',
                shipping_name       VARCHAR(255) NOT NULL,
                shipping_phone      VARCHAR(20) NOT NULL,
                shipping_address    TEXT NOT NULL,
                shipping_city       VARCHAR(100) NOT NULL,
                shipping_province   VARCHAR(100) NOT NULL,
                shipping_postal_code VARCHAR(10) NOT NULL,
                shipping_courier    VARCHAR(100) NOT NULL,
                shipping_service    VARCHAR(100) NOT NULL,
                shipping_cost_sen   BIGINT NOT NULL DEFAULT 0 CHECK (shipping_cost_sen >= 0),
                shipping_etd_days   INTEGER DEFAULT NULL,
                subtotal_sen        BIGINT NOT NULL CHECK (subtotal_sen >= 0),
                total_sen           BIGINT NOT NULL CHECK (total_sen >= 0),
                tracking_number     VARCHAR(100) DEFAULT NULL,
                tracking_url        VARCHAR(500) DEFAULT NULL,
                shipped_at          TIMESTAMPTZ DEFAULT NULL,
                delivered_at        TIMESTAMPTZ DEFAULT NULL,
                customer_notes      TEXT DEFAULT NULL,
                expires_at          TIMESTAMPTZ DEFAULT NULL,
                created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT orders_user_or_guest CHECK (
                    (user_id IS NOT NULL AND guest_email IS NULL) OR
                    (user_id IS NULL AND guest_email IS NOT NULL)
                )
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS order_items (
                id                      BIGSERIAL PRIMARY KEY,
                order_id                BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id              BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                variation_id            BIGINT REFERENCES product_variations(id) ON DELETE SET NULL,
                product_name_snapshot   VARCHAR(255) NOT NULL,
                variation_name_snapshot VARCHAR(255) DEFAULT NULL,
                product_sku_snapshot    VARCHAR(100) NOT NULL,
                product_image_url       VARCHAR(500) DEFAULT NULL,
                qty                     INTEGER NOT NULL CHECK (qty > 0),
                unit_price_sen          BIGINT NOT NULL CHECK (unit_price_sen >= 0),
                subtotal_sen            BIGINT NOT NULL CHECK (subtotal_sen >= 0),
                created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS payments (
                id                  BIGSERIAL PRIMARY KEY,
                order_id           BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
                midtrans_order_id  VARCHAR(255) NOT NULL,
                payment_type       payment_type NOT NULL,
                transaction_status  transaction_status NOT NULL DEFAULT 'pending',
                gross_amount_sen   BIGINT NOT NULL CHECK (gross_amount_sen >= 0),
                payment_url        VARCHAR(500) DEFAULT NULL,
                paid_at            TIMESTAMPTZ DEFAULT NULL,
                expires_at          TIMESTAMPTZ NOT NULL,
                created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS wishlists (
                id          BIGSERIAL PRIMARY KEY,
                user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT wishlists_user_product_unique UNIQUE (user_id, product_id)
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS reviews (
                id              BIGSERIAL PRIMARY KEY,
                user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                rating          SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                review_text     TEXT DEFAULT NULL,
                is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
                helpful_count   INTEGER NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT reviews_user_product_order_unique UNIQUE (user_id, product_id, order_id)
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS notifications (
                id              UUID PRIMARY KEY,
                type            VARCHAR(255) NOT NULL,
                notifiable_type VARCHAR(255) NOT NULL,
                notifiable_id   BIGINT NOT NULL,
                data            TEXT NOT NULL,
                read_at         TIMESTAMPTZ DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_notifications_notifiable ON notifications (notifiable_type, notifiable_id)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS notifications CASCADE');
        DB::statement('DROP TABLE IF EXISTS reviews CASCADE');
        DB::statement('DROP TABLE IF EXISTS wishlists CASCADE');
        DB::statement('DROP TABLE IF EXISTS payments CASCADE');
        DB::statement('DROP TABLE IF EXISTS order_items CASCADE');
        DB::statement('DROP TABLE IF EXISTS orders CASCADE');
        DB::statement('DROP TABLE IF EXISTS cart_items CASCADE');
        DB::statement('DROP TABLE IF EXISTS carts CASCADE');
        DB::statement('DROP TABLE IF EXISTS bundle_items CASCADE');
        DB::statement('DROP TABLE IF EXISTS bundles CASCADE');
    }
};
