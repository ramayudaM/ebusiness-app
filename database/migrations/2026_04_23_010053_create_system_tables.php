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
            CREATE TABLE IF NOT EXISTS raja_ongkir_cache (
                id          BIGSERIAL PRIMARY KEY,
                cache_key   VARCHAR(255) NOT NULL UNIQUE,
                cache_value TEXT NOT NULL,
                expires_at  TIMESTAMPTZ NOT NULL,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS job_batches (
                id          BIGSERIAL PRIMARY KEY,
                uuid        VARCHAR(255) NOT NULL UNIQUE,
                name        VARCHAR(255) NOT NULL,
                total_jobs  INTEGER NOT NULL DEFAULT 0,
                pending_jobs INTEGER NOT NULL DEFAULT 0,
                failed_jobs INTEGER NOT NULL DEFAULT 0,
                failed_job_ids TEXT NOT NULL,
                options     TEXT DEFAULT NULL,
                cancelled_at TIMESTAMPTZ DEFAULT NULL,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                finished_at TIMESTAMPTZ DEFAULT NULL
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS failed_jobs (
                id          BIGSERIAL PRIMARY KEY,
                uuid        VARCHAR(255) NOT NULL UNIQUE,
                connection  TEXT NOT NULL,
                queue       TEXT NOT NULL,
                payload     TEXT NOT NULL,
                exception   TEXT NOT NULL,
                failed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS invoice_records (
                id              BIGSERIAL PRIMARY KEY,
                order_id        BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
                invoice_number  VARCHAR(50) NOT NULL UNIQUE,
                file_path       VARCHAR(500) NOT NULL,
                generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");

        DB::statement("
            CREATE TABLE IF NOT EXISTS cache (
                key         VARCHAR(255) PRIMARY KEY,
                value       TEXT NOT NULL,
                expiration  TIMESTAMPTZ DEFAULT NULL
            )
        ");
        
        DB::statement("
            CREATE TABLE IF NOT EXISTS jobs (
                id BIGSERIAL PRIMARY KEY,
                queue VARCHAR(255) NOT NULL,
                payload TEXT NOT NULL,
                attempts SMALLINT NOT NULL,
                reserved_at INTEGER DEFAULT NULL,
                available_at INTEGER NOT NULL,
                created_at INTEGER NOT NULL
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_jobs_queue ON jobs (queue)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS jobs CASCADE');
        DB::statement('DROP TABLE IF EXISTS cache CASCADE');
        DB::statement('DROP TABLE IF EXISTS invoice_records CASCADE');
        DB::statement('DROP TABLE IF EXISTS failed_jobs CASCADE');
        DB::statement('DROP TABLE IF EXISTS job_batches CASCADE');
        DB::statement('DROP TABLE IF EXISTS raja_ongkir_cache CASCADE');
    }
};
