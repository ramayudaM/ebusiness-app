<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    public function __construct(private OrderStockService $stockService)
    {
    }

    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'items.product', 'payment'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'ilike', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->whereIn('status', $this->databaseOrderStatuses($request->status));
        }

        if ($request->filled('payment_status')) {
            $this->applyPaymentStatusFilter($query, $request->payment_status);
        }

        $orders = $query->paginate($request->input('per_page', 10));

        $items = $orders->getCollection()
            ->map(fn (Order $order) => $this->serializeOrder($order))
            ->values();

        return response()->json([
            'success' => true,
            'data' => $items,
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'summary' => $this->getOrderSummary(),
            ],
        ]);
    }

    public function show(Order $order)
    {
        $relations = ['user', 'items.product', 'payment'];

        if (Schema::hasTable('order_internal_notes')) {
            $relations[] = 'internalNotes.admin';
        }

        return response()->json([
            'success' => true,
            'data' => $this->serializeOrder($order->load($relations)),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'pending',
                    'processing',
                    'shipped',
                    'shipping',
                    'completed',
                    'delivered',
                    'cancelled',
                    'canceled',
                    'PENDING',
                    'PROCESSING',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                ]),
            ],
        ]);

        $status = $this->databaseOrderStatus($validated['status']);
        $frontendStatus = $this->frontendOrderStatus($status);

        $updateData = [
            'status' => $status,
        ];

        if (Schema::hasColumn('orders', 'processed_at') && $frontendStatus === 'processing' && ! $order->processed_at) {
            $updateData['processed_at'] = now();
        }

        if (Schema::hasColumn('orders', 'shipped_at') && $frontendStatus === 'shipped' && ! $order->shipped_at) {
            $updateData['shipped_at'] = now();
        }

        if (Schema::hasColumn('orders', 'completed_at') && $frontendStatus === 'completed' && ! $order->completed_at) {
            $updateData['completed_at'] = now();
        }

        if (Schema::hasColumn('orders', 'delivered_at') && $frontendStatus === 'completed' && ! $order->delivered_at) {
            $updateData['delivered_at'] = now();
        }

        if (Schema::hasColumn('orders', 'cancelled_at') && $frontendStatus === 'cancelled' && ! $order->cancelled_at) {
            $updateData['cancelled_at'] = now();
        }

        DB::transaction(function () use ($order, $updateData, $frontendStatus) {
            if ($frontendStatus === 'cancelled') {
                $this->stockService->restoreForOrder($order);
            }

            $order->update($updateData);
        });

        $this->createSystemNoteIfAvailable(
            $order,
            'Status pesanan diperbarui menjadi ' . $this->formatOrderStatus($frontendStatus) . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui.',
            'data' => $this->serializeOrder($order->fresh()->load(['user', 'items.product', 'payment'])),
        ]);
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => [
                'required',
                Rule::in([
                    'unpaid',
                    'pending',
                    'paid',
                    'failed',
                    'expired',
                    'refunded',
                ]),
            ],
        ]);

        $paymentStatus = $validated['payment_status'];

        $updateData = [
            'payment_status' => $paymentStatus,
        ];

        if (Schema::hasColumn('orders', 'paid_at') && $paymentStatus === 'paid' && ! $order->paid_at) {
            $updateData['paid_at'] = now();
        }

        DB::transaction(function () use ($order, $updateData, $paymentStatus) {
            if (in_array($paymentStatus, ['failed', 'expired', 'refunded'], true)) {
                $this->stockService->restoreForOrder($order);

                if ($order->status === 'PENDING') {
                    $updateData['status'] = 'CANCELLED';
                    $updateData['cancelled_at'] = $order->cancelled_at ?: now();
                }
            }

            $order->update($updateData);
        });

        $this->createSystemNoteIfAvailable(
            $order,
            'Status pembayaran diperbarui menjadi ' . $this->formatPaymentStatus($paymentStatus) . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diperbarui.',
            'data' => $this->serializeOrder($order->fresh()->load(['user', 'items.product', 'payment'])),
        ]);
    }

    public function updateTrackingNumber(Request $request, Order $order)
    {
        $validated = $request->validate([
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'courier' => ['nullable', 'string', 'max:255'],
        ]);

        $updateData = [];

        if (Schema::hasColumn('orders', 'tracking_number')) {
            $updateData['tracking_number'] = $validated['tracking_number'] ?? null;
        }

        if (Schema::hasColumn('orders', 'courier')) {
            $updateData['courier'] = $validated['courier'] ?? $order->courier;
        }

        if (! empty($updateData)) {
            $order->update($updateData);
        }

        $this->createSystemNoteIfAvailable(
            $order,
            'Nomor resi diperbarui menjadi ' . ($validated['tracking_number'] ?? '-') . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Nomor resi berhasil diperbarui.',
            'data' => $this->serializeOrder($order->fresh()->load(['user', 'items.product', 'payment'])),
        ]);
    }

    public function addInternalNote(Request $request, Order $order)
    {
        if (! Schema::hasTable('order_internal_notes')) {
            return response()->json([
                'success' => false,
                'message' => 'Fitur catatan internal belum aktif karena tabel order_internal_notes belum tersedia.',
            ], 422);
        }

        $validated = $request->validate([
            'note' => ['required', 'string', 'max:2000'],
        ]);

        $note = \App\Models\OrderInternalNote::create([
            'order_id' => $order->id,
            'admin_id' => $request->user()?->id,
            'note' => $validated['note'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catatan internal berhasil ditambahkan.',
            'data' => $note->load('admin'),
        ], 201);
    }

    public function notifyCustomer(Order $order)
    {
        $this->createSystemNoteIfAvailable(
            $order,
            'Admin menandai notifikasi pesanan untuk dikirim ke customer.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi pesanan berhasil diproses.',
        ]);
    }

    private function createSystemNoteIfAvailable(Order $order, string $note): void
    {
        if (! Schema::hasTable('order_internal_notes')) {
            return;
        }

        if (! class_exists(\App\Models\OrderInternalNote::class)) {
            return;
        }

        \App\Models\OrderInternalNote::create([
            'order_id' => $order->id,
            'admin_id' => request()->user()?->id,
            'note' => $note,
        ]);
    }

    private function formatOrderStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'Menunggu',
            'processing' => 'Sedang Diproses',
            'shipped' => 'Dikirim',
            'delivered' => 'Selesai',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => $status,
        };
    }

    private function formatPaymentStatus(string $status): string
    {
        return match ($status) {
            'unpaid' => 'Belum Bayar',
            'pending' => 'Menunggu',
            'paid' => 'Lunas',
            'failed' => 'Gagal',
            'expired' => 'Kedaluwarsa',
            'refunded' => 'Refund',
            default => $status,
        };
    }

    private function serializeOrder(Order $order): array
    {
        $data = $order->toArray();
        $data['status'] = $this->frontendOrderStatus($order->status);
        $data['status_raw'] = $order->status;
        $data['payment_status'] = $this->frontendPaymentStatus($order);

        return $data;
    }

    private function databaseOrderStatus(string $status): string
    {
        return match (strtolower($status)) {
            'pending' => 'PENDING',
            'processing', 'processed', 'paid' => 'PROCESSING',
            'shipping', 'shipped' => 'SHIPPED',
            'completed', 'delivered' => 'DELIVERED',
            'cancelled', 'canceled' => 'CANCELLED',
            default => strtoupper($status),
        };
    }

    private function databaseOrderStatuses(string $status): array
    {
        return [$this->databaseOrderStatus($status)];
    }

    private function frontendOrderStatus(?string $status): string
    {
        return match (strtolower((string) $status)) {
            'pending' => 'pending',
            'processing', 'processed', 'paid' => 'processing',
            'shipping', 'shipped' => 'shipped',
            'completed', 'delivered' => 'completed',
            'cancelled', 'canceled', 'expired' => 'cancelled',
            default => strtolower((string) ($status ?: 'pending')),
        };
    }

    private function frontendPaymentStatus(Order $order): string
    {
        $status = strtolower((string) ($order->payment_status ?: ''));
        $transactionStatus = strtolower((string) ($order->payment?->transaction_status ?: ''));
        $transactionMappedStatus = match ($transactionStatus) {
            'settlement', 'capture', 'success' => 'paid',
            'pending' => 'pending',
            'expire' => 'expired',
            'failure', 'deny', 'cancel' => 'failed',
            default => '',
        };

        if ($transactionMappedStatus && in_array($status, ['', 'unpaid', 'pending'], true)) {
            return $transactionMappedStatus;
        }

        if ($status) {
            return match ($status) {
                'settlement', 'capture', 'success' => 'paid',
                'expire' => 'expired',
                'cancel' => 'failed',
                default => $status,
            };
        }

        return $transactionMappedStatus ?: 'unpaid';
    }

    private function applyPaymentStatusFilter($query, string $status): void
    {
        $status = strtolower($status);

        if ($status === 'unpaid') {
            $query->where(function ($statusQuery) {
                if (Schema::hasColumn('orders', 'payment_status')) {
                    $statusQuery->where('payment_status', 'unpaid')
                        ->orWhereNull('payment_status');
                }
            });

            if (Schema::hasTable('payments')) {
                $query->whereDoesntHave('payment', function ($paymentQuery) {
                    $paymentQuery->whereIn('transaction_status', [
                        'settlement',
                    ]);
                });
            }

            return;
        }

        $paymentTransactionStatuses = match ($status) {
            'paid' => ['settlement'],
            'pending' => ['pending'],
            'expired' => ['expire'],
            'failed' => ['failure', 'cancel'],
            default => [],
        };

        $query->where(function ($statusQuery) use ($status, $paymentTransactionStatuses) {
            if (Schema::hasColumn('orders', 'payment_status')) {
                $statusQuery->where('payment_status', $status);
            }

            if (! empty($paymentTransactionStatuses) && Schema::hasTable('payments')) {
                $statusQuery->orWhereHas('payment', function ($paymentQuery) use ($paymentTransactionStatuses) {
                    $paymentQuery->whereIn('transaction_status', $paymentTransactionStatuses);
                });
            }
        });
    }

    private function getOrderSummary(): array
    {
        $statuses = Order::query()
            ->selectRaw('status::text as status_value, COUNT(*) as total')
            ->groupBy('status_value')
            ->pluck('total', 'status_value');

        $summary = [
            'total' => Order::count(),
            'pending' => 0,
            'processing' => 0,
            'shipped' => 0,
            'completed' => 0,
            'cancelled' => 0,
            'paid_revenue_sen' => (int) $this->paidRevenueQuery()->sum('total_sen'),
        ];

        foreach ($statuses as $status => $count) {
            $key = $this->frontendOrderStatus($status);

            if (array_key_exists($key, $summary)) {
                $summary[$key] += (int) $count;
            }
        }

        return $summary;
    }

    private function paidRevenueQuery()
    {
        return Order::query()
            ->where(function ($query) {
                if (Schema::hasColumn('orders', 'paid_at')) {
                    $query->orWhereNotNull('paid_at');
                }

                if (Schema::hasColumn('orders', 'payment_status')) {
                    $query->orWhereIn('payment_status', [
                        'paid',
                        'settlement',
                        'capture',
                        'success',
                    ]);
                }

                if (Schema::hasTable('payments')) {
                    $query->orWhereHas('payment', function ($paymentQuery) {
                        $paymentQuery->whereIn('transaction_status', [
                            'settlement',
                        ]);
                    });
                }
            });
    }
}
