<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'items.product', 'items.variation', 'payment'])
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
            $query->where('status', $this->normalizeOrderStatus($request->status));
        }

        if ($request->filled('payment_status')) {
            $paymentStatus = $this->normalizePaymentStatus($request->payment_status);
            $query->whereHas('payment', function ($paymentQuery) use ($paymentStatus) {
                $paymentQuery->where('transaction_status', $paymentStatus);
            });
        }

        $orders = $query->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Order $order)
    {
        $relations = ['user', 'items.product', 'items.variation', 'payment'];

        if (Schema::hasTable('order_internal_notes')) {
            $relations[] = 'internalNotes';
        }

        return response()->json([
            'success' => true,
            'data' => $order->load($relations),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        // Valid order status enum values from database
        $validStatuses = [
            'PENDING',
            'PAID',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'EXPIRED',
            'CANCELLED',
        ];

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
            ],
        ]);

        $status = $this->normalizeOrderStatus($validated['status']);

        if (! in_array($status, $validStatuses, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Status pesanan tidak valid.',
            ], 422);
        }

        $updateData = [
            'status' => $status,
        ];

        // Set timestamps based on status transition
        if ($status === 'PROCESSING' && !$order->processed_at) {
            $updateData['processed_at'] = now();
        }

        if ($status === 'SHIPPED' && !$order->shipped_at) {
            $updateData['shipped_at'] = now();
        }

        if ($status === 'DELIVERED' && !$order->delivered_at) {
            $updateData['delivered_at'] = now();
        }

        if ($status === 'CANCELLED' && ! in_array($order->status, ['CANCELLED', 'EXPIRED'], true)) {
            $order->restoreVariationStock();
        }

        if ($status === 'CANCELLED' && !$order->cancelled_at) {
            $updateData['cancelled_at'] = now();
        }

        $order->update($updateData);

        $this->createSystemNoteIfAvailable(
            $order,
            'Status pesanan diperbarui menjadi ' . $this->formatOrderStatus($status) . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui.',
            'data' => $order->fresh()->load(['user', 'items.product', 'items.variation', 'payment']),
        ]);
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        // Payment status adalah transaction_status di table payments
        $payment = $order->payment;
        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Record pembayaran tidak ditemukan untuk order ini.',
            ], 422);
        }

        // Valid transaction status enum values from database
        $validStatuses = [
            'pending',
            'settlement',
            'expire',
            'failure',
            'cancel',
        ];

        $validated = $request->validate([
            'transaction_status' => [
                'nullable',
                'string',
            ],
            'payment_status' => [
                'nullable',
                'string',
            ],
        ]);

        $statusInput = $validated['transaction_status'] ?? $validated['payment_status'] ?? null;
        $status = $this->normalizePaymentStatus($statusInput);

        if (! in_array($status, $validStatuses, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Status pembayaran tidak valid.',
            ], 422);
        }

        $updateData = [
            'transaction_status' => $status,
        ];

        if ($status === 'settlement' && !$payment->paid_at) {
            $updateData['paid_at'] = now();
            $order->update([
                'status' => 'PROCESSING',
                'paid_at' => $order->paid_at ?: now(),
            ]);
        }

        if (($status === 'expire' || $status === 'failure' || $status === 'cancel') && ! in_array($order->status, ['CANCELLED', 'EXPIRED'], true)) {
            $order->restoreVariationStock();
            $order->update(['status' => 'CANCELLED']);
        }

        $payment->update($updateData);

        $this->createSystemNoteIfAvailable(
            $order,
            'Status pembayaran diperbarui menjadi ' . $this->formatPaymentStatus($status) . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diperbarui.',
            'data' => $order->fresh()->load(['user', 'items.product', 'items.variation', 'payment']),
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
            'data' => $order->fresh()->load(['user', 'items.product', 'items.variation', 'payment']),
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
            'PENDING' => 'Menunggu Pembayaran',
            'PAID' => 'Sudah Dibayar',
            'PROCESSING' => 'Sedang Diproses',
            'SHIPPED' => 'Dikirim',
            'DELIVERED' => 'Selesai',
            'EXPIRED' => 'Kedaluwarsa',
            'CANCELLED' => 'Dibatalkan',
            default => $status,
        };
    }

    private function formatPaymentStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'Menunggu',
            'settlement' => 'Lunas',
            'expire' => 'Kedaluwarsa',
            'failure' => 'Gagal',
            'cancel' => 'Dibatalkan',
            default => $status,
        };
    }

    private function normalizeOrderStatus(string $status): string
    {
        return match (strtolower($status)) {
            'pending' => 'PENDING',
            'paid' => 'PAID',
            'processing' => 'PROCESSING',
            'shipped' => 'SHIPPED',
            'completed', 'delivered' => 'DELIVERED',
            'expired' => 'EXPIRED',
            'cancelled', 'canceled' => 'CANCELLED',
            default => strtoupper($status),
        };
    }

    private function normalizePaymentStatus(?string $status): ?string
    {
        return match (strtolower((string) $status)) {
            'unpaid', 'pending' => 'pending',
            'paid', 'settlement', 'capture' => 'settlement',
            'expired', 'expire' => 'expire',
            'failed', 'failure', 'deny' => 'failure',
            'cancelled', 'canceled', 'cancel' => 'cancel',
            default => $status,
        };
    }
}
