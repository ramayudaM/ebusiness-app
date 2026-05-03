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
        // Skip untuk SQLite, hanya untuk PostgreSQL
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }
        
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        DB::statement('CREATE EXTENSION IF NOT EXISTS "pg_trgm"');

        DB::statement("
            DO \$\$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                    CREATE TYPE user_role AS ENUM ('admin', 'customer');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
                    CREATE TYPE order_status AS ENUM ('PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','EXPIRED','CANCELLED');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type') THEN
                    CREATE TYPE payment_type AS ENUM ('va', 'qris', 'ewallet');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
                    CREATE TYPE transaction_status AS ENUM ('pending', 'settlement', 'expire', 'failure', 'cancel');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
                    CREATE TYPE media_type AS ENUM ('audio', 'video');
                END IF;
            END \$\$;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS media_type');
        DB::statement('DROP TYPE IF EXISTS transaction_status');
        DB::statement('DROP TYPE IF EXISTS payment_type');
        DB::statement('DROP TYPE IF EXISTS order_status');
        DB::statement('DROP TYPE IF EXISTS user_role');
    }
};
