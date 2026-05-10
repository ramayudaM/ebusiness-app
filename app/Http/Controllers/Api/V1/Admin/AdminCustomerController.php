<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withTrashed()
            ->where('role', 'customer')
            ->with(['customerProfile'])
            ->withCount('orders')
            ->withSum('orders as total_spent_sen', 'total_sen')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->whereNull('deleted_at');
            }

            if ($request->status === 'inactive') {
                $query->whereNotNull('deleted_at');
            }
        }

        $customers = $query->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $customer = User::withTrashed()
            ->where('role', 'customer')
            ->with([
                'customerProfile',
                'orders' => function ($query) {
                    $query->latest()->limit(10);
                },
                'orders.items.product',
            ])
            ->withCount('orders')
            ->withSum('orders as total_spent_sen', 'total_sen')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    public function deactivate($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer berhasil dinonaktifkan.',
        ]);
    }

    public function restore($id)
    {
        $customer = User::withTrashed()
            ->where('role', 'customer')
            ->findOrFail($id);

        $customer->restore();

        return response()->json([
            'success' => true,
            'message' => 'Customer berhasil diaktifkan kembali.',
        ]);
    }
}