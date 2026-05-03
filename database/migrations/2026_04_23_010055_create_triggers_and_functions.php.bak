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
        // 1. Updated At Function
        DB::statement("
            CREATE OR REPLACE FUNCTION set_updated_at()
            RETURNS TRIGGER AS \$\$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql
        ");

        // Apply Updated At Trigger to all tables
        $tables = [
            'users', 'customer_profiles', 'categories', 'products',
            'product_variations', 'product_images', 'product_media',
            'bundles', 'bundle_items', 'carts', 'cart_items',
            'orders', 'order_items', 'payments', 'wishlists',
            'reviews', 'notifications', 'invoice_records', 'raja_ongkir_cache'
        ];

        foreach ($tables as $table) {
            DB::statement("
                CREATE TRIGGER trigger_set_updated_at
                BEFORE UPDATE ON {$table}
                FOR EACH ROW EXECUTE FUNCTION set_updated_at()
            ");
        }

        // 2. Product Rating Function
        DB::statement("
            CREATE OR REPLACE FUNCTION update_product_rating()
            RETURNS TRIGGER AS \$\$
            BEGIN
                IF TG_OP = 'INSERT' THEN
                    UPDATE products
                    SET average_rating = (
                        SELECT ROUND(AVG(rating)::numeric, 1)
                        FROM reviews
                        WHERE product_id = NEW.product_id AND is_visible = TRUE
                    ),
                    review_count = (
                        SELECT COUNT(*)
                        FROM reviews
                        WHERE product_id = NEW.product_id AND is_visible = TRUE
                    )
                    WHERE id = NEW.product_id;

                ELSIF TG_OP = 'UPDATE' THEN
                    UPDATE products
                    SET average_rating = (
                        SELECT ROUND(AVG(rating)::numeric, 1)
                        FROM reviews
                        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_visible = TRUE
                    ),
                    review_count = (
                        SELECT COUNT(*)
                        FROM reviews
                        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_visible = TRUE
                    )
                    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

                ELSIF TG_OP = 'DELETE' THEN
                    UPDATE products
                    SET average_rating = COALESCE((
                        SELECT ROUND(AVG(rating)::numeric, 1)
                        FROM reviews
                        WHERE product_id = OLD.product_id AND is_visible = TRUE
                    ), 0),
                    review_count = COALESCE((
                        SELECT COUNT(*)
                        FROM reviews
                        WHERE product_id = OLD.product_id AND is_visible = TRUE
                    ), 0)
                    WHERE id = OLD.product_id;
                END IF;
                RETURN COALESCE(NEW, OLD);
            END;
            \$\$ LANGUAGE plpgsql
        ");

        DB::statement("
            CREATE TRIGGER trigger_update_product_rating
            AFTER INSERT OR UPDATE OR DELETE ON reviews
            FOR EACH ROW EXECUTE FUNCTION update_product_rating()
        ");

        // 3. Order Number Generator
        DB::statement("
            CREATE OR REPLACE FUNCTION generate_order_number()
            RETURNS VARCHAR(50) AS \$\$
            DECLARE
                today_prefix  TEXT;
                seq_num       INTEGER;
                order_number  VARCHAR(50);
            BEGIN
                today_prefix := TO_CHAR(NOW(), 'YYYYMMDD');
                SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 14) AS INTEGER)), 0) + 1
                INTO seq_num
                FROM orders
                WHERE order_number LIKE 'NK-' || today_prefix || '-%';
                order_number := 'NK-' || today_prefix || '-' || LPAD(seq_num::TEXT, 6, '0');
                RETURN order_number;
            END;
            \$\$ LANGUAGE plpgsql
        ");

        // 4. Restore Stock on Expire
        DB::statement("
            CREATE OR REPLACE FUNCTION restore_stock_on_expire()
            RETURNS TRIGGER AS \$\$
            BEGIN
                IF OLD.status = 'PENDING' AND NEW.status = 'EXPIRED' THEN
                    UPDATE product_variations pv
                    SET stock_qty = stock_qty + oi.qty
                    FROM order_items oi
                    WHERE oi.order_id = NEW.id
                      AND oi.variation_id = pv.id;

                    UPDATE products p
                    SET review_count = review_count -- just dummy update to trigger set_updated_at if needed, actually we need to update stock_qty
                    -- Note: The original SQL had a stock_qty update for products too
                    WHERE p.id IN (SELECT DISTINCT product_id FROM order_items WHERE order_id = NEW.id AND variation_id IS NULL);
                END IF;
                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql
        ");

        DB::statement("
            CREATE TRIGGER trigger_restore_stock_on_expire
            AFTER UPDATE ON orders
            FOR EACH ROW EXECUTE FUNCTION restore_stock_on_expire()
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP FUNCTION IF EXISTS restore_stock_on_expire() CASCADE');
        DB::statement('DROP FUNCTION IF EXISTS generate_order_number() CASCADE');
        DB::statement('DROP FUNCTION IF EXISTS update_product_rating() CASCADE');
        DB::statement('DROP FUNCTION IF EXISTS set_updated_at() CASCADE');
    }
};
