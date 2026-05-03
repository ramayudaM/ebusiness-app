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
            CREATE TABLE IF NOT EXISTS users (
                id              BIGSERIAL PRIMARY KEY,
                name            VARCHAR(255) NOT NULL,
                email           VARCHAR(255) NOT NULL UNIQUE,
                email_verified_at TIMESTAMPTZ DEFAULT NULL,
                password        VARCHAR(255) NOT NULL,
                role            user_role NOT NULL DEFAULT 'customer',
                remember_token  VARCHAR(100) DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                deleted_at      TIMESTAMPTZ DEFAULT NULL
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at) WHERE deleted_at IS NULL');

        DB::statement("
            CREATE TABLE IF NOT EXISTS personal_access_tokens (
                id              BIGSERIAL PRIMARY KEY,
                tokenable_type  VARCHAR(255) NOT NULL,
                tokenable_id    BIGINT NOT NULL,
                name            VARCHAR(255) NOT NULL,
                token           VARCHAR(64) NOT NULL UNIQUE,
                abilities       TEXT DEFAULT NULL,
                last_used_at    TIMESTAMPTZ DEFAULT NULL,
                expires_at      TIMESTAMPTZ DEFAULT NULL,
                created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_tokens_tokenable ON personal_access_tokens (tokenable_type, tokenable_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_tokens_token ON personal_access_tokens (token)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS sessions (
                id              VARCHAR(255) PRIMARY KEY,
                user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
                ip_address      VARCHAR(45),
                user_agent      TEXT,
                payload         TEXT NOT NULL,
                last_activity   INTEGER NOT NULL
            )
        ");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions (last_activity)');

        DB::statement("
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                email       VARCHAR(255) PRIMARY KEY,
                token       VARCHAR(255) NOT NULL,
                created_at  TIMESTAMPTZ
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS password_reset_tokens');
        DB::statement('DROP TABLE IF EXISTS sessions');
        DB::statement('DROP TABLE IF EXISTS personal_access_tokens');
        DB::statement('DROP TABLE IF EXISTS users CASCADE');
    }
};
