<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminDashboardController extends Controller
{
    public function overview()
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        $totalProducts = Product::count();

        $totalOrders = Order::count();

        $totalCustomers = User::where('role', 'customer')->count();

        $totalReviews = class_exists(Review::class)
            ? Review::count()
            : 0;

        $monthlyRevenue = $this->getRevenueQuery()
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total_sen');

        $weeklyOrders = Order::where('created_at', '>=', $startOfWeek)->count();

        $todayOrders = Order::whereDate('created_at', $today)->count();

        $pendingOrders = $this->countOrderByNormalizedStatus('pending');

        $processingOrders = $this->countOrderByNormalizedStatus('processing');

        $shippingOrders = $this->countOrderByNormalizedStatus('shipping');

        $completedOrders = $this->countOrderByNormalizedStatus('completed');

        $cancelledOrders = $this->countOrderByNormalizedStatus('cancelled');

        $weeklySales = $this->getWeeklySales();

        $latestOrders = Order::query()
            ->with(['user', 'items.product'])
            ->latest()
            ->limit(5)
            ->get();

        $topProducts = $this->getTopProducts();

        $lowStockProducts = $this->getLowStockProducts();

        $categoryPerformance = $this->getCategoryPerformance();

        $recentActivities = $this->getRecentActivities($latestOrders, $lowStockProducts);

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_products' => $totalProducts,
                    'total_orders' => $totalOrders,
                    'total_customers' => $totalCustomers,
                    'total_reviews' => $totalReviews,
                    'monthly_revenue_sen' => (int) $monthlyRevenue,
                    'weekly_orders' => $weeklyOrders,
                    'today_orders' => $todayOrders,
                    'pending_orders' => $pendingOrders,
                    'processing_orders' => $processingOrders,
                    'shipping_orders' => $shippingOrders,
                    'completed_orders' => $completedOrders,
                    'cancelled_orders' => $cancelledOrders,
                ],
                'weekly_sales' => $weeklySales,
                'latest_orders' => $latestOrders,
                'top_products' => $topProducts,
                'low_stock_products' => $lowStockProducts,
                'category_performance' => $categoryPerformance,
                'recent_activities' => $recentActivities,
            ],
        ]);
    }

    private function getRevenueQuery()
    {
        $query = Order::query();

        if (Schema::hasColumn('orders', 'paid_at')) {
            return $query->whereNotNull('paid_at');
        }

        if (Schema::hasColumn('orders', 'payment_status')) {
            return $query->whereIn('payment_status', [
                'paid',
                'settlement',
                'capture',
                'success',
            ]);
        }

        return $query;
    }

    private function countOrderByNormalizedStatus(string $target): int
    {
        if (!Schema::hasColumn('orders', 'status')) {
            return 0;
        }

        $rawStatus = DB::table('orders')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
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

        $total = 0;

        foreach ($rawStatus as $status => $count) {
            $statusKey = strtolower((string) $status);

            if (in_array($statusKey, $groups[$target] ?? [], true)) {
                $total += (int) $count;
            }
        }

        return $total;
    }

    private function getWeeklySales()
    {
        $days = collect(range(0, 6))->map(function ($index) {
            $date = Carbon::now()->startOfWeek()->addDays($index);

            return [
                'date' => $date->toDateString(),
                'day' => $date->locale('id')->translatedFormat('D'),
                'label' => $date->locale('id')->translatedFormat('d M'),
                'revenue_sen' => 0,
                'orders_count' => 0,
            ];
        });

        $start = Carbon::now()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $orders = $this->getRevenueQuery()
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('DATE(created_at) as order_date'),
                DB::raw('COALESCE(SUM(total_sen), 0) as revenue_sen'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('order_date');

        return $days->map(function ($day) use ($orders) {
            $data = $orders->get($day['date']);

            return [
                'date' => $day['date'],
                'day' => $day['day'],
                'label' => $day['label'],
                'revenue_sen' => $data ? (int) $data->revenue_sen : 0,
                'orders_count' => $data ? (int) $data->orders_count : 0,
            ];
        })->values();
    }

    private function getTopProducts()
    {
        if (!Schema::hasTable('order_items')) {
            return collect();
        }

        return DB::table('order_items')
            ->select(
                'product_id',
                DB::raw('MAX(product_name_snapshot) as name'),
                DB::raw('MAX(product_sku_snapshot) as sku'),
                DB::raw('COALESCE(SUM(qty), 0) as sold'),
                DB::raw('COALESCE(SUM(subtotal_sen), 0) as revenue_sen')
            )
            ->groupBy('product_id')
            ->orderByDesc('sold')
            ->limit(3)
            ->get();
    }

    private function getLowStockProducts()
    {
        if (Schema::hasColumn('products', 'stock_qty')) {
            return Product::query()
                ->select('id', 'name', 'sku', 'stock_qty')
                ->orderBy('stock_qty')
                ->limit(5)
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
                ->limit(5)
                ->get();
        }

        return collect();
    }

    private function getCategoryPerformance()
    {
        if (!Schema::hasTable('categories') || !Schema::hasColumn('products', 'category_id')) {
            return collect();
        }

        return DB::table('categories')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COUNT(products.id) as total_products')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_products')
            ->limit(5)
            ->get();
    }

    private function getRecentActivities($latestOrders, $lowStockProducts)
    {
        $activities = collect();

        foreach ($latestOrders->take(3) as $order) {
            $customerName = $order->user->name ?? $order->guest_name ?? 'Customer';

            $activities->push([
                'type' => 'order',
                'title' => 'Pesanan baru masuk',
                'description' => "{$order->order_number} dari {$customerName}",
                'created_at' => optional($order->created_at)->toISOString(),
            ]);
        }

        foreach ($lowStockProducts->take(2) as $product) {
            $stock = $product->stock_qty ?? 0;

            $activities->push([
                'type' => 'stock',
                'title' => 'Stok produk rendah',
                'description' => "{$product->name} tersisa {$stock} unit",
                'created_at' => now()->toISOString(),
            ]);
        }

        return $activities->values();
    }
}