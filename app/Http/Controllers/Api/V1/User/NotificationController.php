<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications()->latest()->limit(20)->get();

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notifikasi ditandai sebagai dibaca'
        ]);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'Semua notifikasi ditandai sebagai dibaca'
        ]);
    }

    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json([
            'message' => 'Notifikasi dihapus'
        ]);
    }

    public function clearAll()
    {
        Auth::user()->notifications()->delete();

        return response()->json([
            'message' => 'Semua notifikasi berhasil dihapus'
        ]);
    }
}
