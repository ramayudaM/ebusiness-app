<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('orders', 'promo_code')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('promo_code')->nullable();
            });
        }

        if (! Schema::hasColumn('orders', 'shipping_discount_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->bigInteger('shipping_discount_sen')->default(0);
            });
        }

        if (! Schema::hasColumn('orders', 'discount_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->bigInteger('discount_sen')->default(0);
            });
        }

        if (! Schema::hasColumn('orders', 'payable_total_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->bigInteger('payable_total_sen')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('orders', 'payable_total_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('payable_total_sen');
            });
        }

        if (Schema::hasColumn('orders', 'discount_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('discount_sen');
            });
        }

        if (Schema::hasColumn('orders', 'shipping_discount_sen')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('shipping_discount_sen');
            });
        }

        if (Schema::hasColumn('orders', 'promo_code')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('promo_code');
            });
        }
    }
};