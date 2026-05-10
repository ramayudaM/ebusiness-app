<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'items.product'])
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
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
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
        $relations = ['user', 'items.product'];

        if (Schema::hasTable('order_internal_notes')) {
            $relations[] = 'internalNotes.admin';
        }

        return response()->json([
            'success' => true,
            'data' => $order->load($relations),
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
                    'completed',
                    'cancelled',
                ]),
            ],
        ]);

        $status = $validated['status'];

        $updateData = [
            'status' => $status,
        ];

        if (Schema::hasColumn('orders', 'processed_at') && $status === 'processing' && ! $order->processed_at) {
            $updateData['processed_at'] = now();
        }

        if (Schema::hasColumn('orders', 'shipped_at') && $status === 'shipped' && ! $order->shipped_at) {
            $updateData['shipped_at'] = now();
        }

        if (Schema::hasColumn('orders', 'completed_at') && $status === 'completed' && ! $order->completed_at) {
            $updateData['completed_at'] = now();
        }

        if (Schema::hasColumn('orders', 'cancelled_at') && $status === 'cancelled' && ! $order->cancelled_at) {
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
            'data' => $order->fresh()->load(['user', 'items.product']),
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

        $order->update($updateData);

        $this->createSystemNoteIfAvailable(
            $order,
            'Status pembayaran diperbarui menjadi ' . $this->formatPaymentStatus($paymentStatus) . '.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diperbarui.',
            'data' => $order->fresh()->load(['user', 'items.product']),
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
            'data' => $order->fresh()->load(['user', 'items.product']),
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
}