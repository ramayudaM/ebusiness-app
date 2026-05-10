<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminReportController extends Controller
{
    public function overview()
    {
        $totalProducts = Product::count();

        $activeProducts = Schema::hasColumn('products', 'is_active')
            ? Product::where('is_active', true)->count()
            : $totalProducts;

        $totalCustomers = User::where('role', 'customer')->count();

        $totalOrders = Order::count();

        $statusSummary = $this->getOrderStatusSummary();
        $normalizedStatus = $statusSummary['normalized'];
        $rawStatus = $statusSummary['raw'];

        $totalRevenue = $this->getTotalRevenue();

        $latestOrders = Order::query()
            ->with(['user'])
            ->latest()
            ->limit(6)
            ->get();

        $lowStockProducts = $this->getLowStockProducts();
        $topProducts = $this->getTopProducts();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_products' => $totalProducts,
                    'active_products' => $activeProducts,
                    'total_customers' => $totalCustomers,
                    'total_orders' => $totalOrders,
                    'pending_orders' => $normalizedStatus['pending'] ?? 0,
                    'processing_orders' => $normalizedStatus['processing'] ?? 0,
                    'shipping_orders' => $normalizedStatus['shipping'] ?? 0,
                    'completed_orders' => $normalizedStatus['completed'] ?? 0,
                    'cancelled_orders' => $normalizedStatus['cancelled'] ?? 0,
                    'total_revenue_sen' => (int) $totalRevenue,
                ],
                'latest_orders' => $latestOrders,
                'low_stock_products' => $lowStockProducts,
                'top_products' => $topProducts,
                'order_status_summary' => [
                    'raw' => $rawStatus,
                    'normalized' => $normalizedStatus,
                ],
            ],
        ]);
    }

    private function getTotalRevenue(): int
    {
        $query = Order::query();

        if (Schema::hasColumn('orders', 'paid_at')) {
            return (int) $query->whereNotNull('paid_at')->sum('total_sen');
        }

        if (Schema::hasColumn('orders', 'payment_status')) {
            return (int) $query
                ->whereIn('payment_status', [
                    'paid',
                    'settlement',
                    'capture',
                    'success',
                ])
                ->sum('total_sen');
        }

        return (int) $query->sum('total_sen');
    }

    private function getOrderStatusSummary(): array
    {
        if (!Schema::hasColumn('orders', 'status')) {
            return [
                'raw' => [],
                'normalized' => [
                    'pending' => 0,
                    'processing' => 0,
                    'shipping' => 0,
                    'completed' => 0,
                    'cancelled' => 0,
                ],
            ];
        }

        $rawStatus = DB::table('orders')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($value) => (int) $value)
            ->toArray();

        $groups = [
            'pending' => [
                'pending',
                'menunggu',
                'awaiting_payment',
                'waiting_payment',
                'unpaid',
            ],
            'processing' => [
                'processing',
                'processed',
                'diproses',
                'paid',
                'confirmed',
            ],
            'shipping' => [
                'shipping',
                'shipped',
                'dikirim',
                'on_delivery',
                'delivery',
            ],
            'completed' => [
                'completed',
                'delivered',
                'selesai',
                'done',
                'success',
                'finished',
            ],
            'cancelled' => [
                'cancelled',
                'canceled',
                'dibatalkan',
                'expired',
                'failed',
                'rejected',
            ],
        ];

        $normalized = [
            'pending' => 0,
            'processing' => 0,
            'shipping' => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        foreach ($rawStatus as $status => $count) {
            $statusKey = strtolower((string) $status);

            foreach ($groups as $groupName => $aliases) {
                if (in_array($statusKey, $aliases, true)) {
                    $normalized[$groupName] += (int) $count;
                    break;
                }
            }
        }

        return [
            'raw' => $rawStatus,
            'normalized' => $normalized,
        ];
    }

    private function getLowStockProducts()
    {
        if (Schema::hasColumn('products', 'stock_qty')) {
            return Product::query()
                ->select('id', 'name', 'sku', 'stock_qty')
                ->orderBy('stock_qty')
                ->limit(6)
                ->get();
        }

        if (
            Schema::hasTable('product_variations') &&
            Schema::hasColumn('product_variations', 'stock_qty')
        ) {
            return Product::query()
                ->leftJoin('product_variations', 'products.id', '=', 'product_variations.product_id')
                ->select(
                    'products.id',
                    'products.name',
                    'products.sku',
                    DB::raw('COALESCE(SUM(product_variations.stock_qty), 0) as stock_qty')
                )
                ->groupBy('products.id', 'products.name', 'products.sku')
                ->orderBy('stock_qty')
                ->limit(6)
                ->get();
        }

        return collect();
    }

    private function getTopProducts()
    {
        if (!Schema::hasTable('order_items')) {
            return collect();
        }

        return DB::table('order_items')
            ->select(
                'product_id',
                DB::raw('MAX(product_name_snapshot) as product_name'),
                DB::raw('MAX(product_sku_snapshot) as product_sku'),
                DB::raw('COALESCE(SUM(qty), 0) as total_sold'),
                DB::raw('COALESCE(SUM(subtotal_sen), 0) as total_revenue_sen')
            )
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(6)
            ->get();
    }
}