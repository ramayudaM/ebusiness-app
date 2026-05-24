<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('cart_items', 'is_selected')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->boolean('is_selected')->default(true)->after('qty');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('cart_items', 'is_selected')) {
            Schema::table('cart_items', function (Blueprint $table) {
                $table->dropColumn('is_selected');
            });
        }
    }
};
