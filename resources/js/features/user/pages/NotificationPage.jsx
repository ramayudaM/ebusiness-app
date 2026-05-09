import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useNotificationStore } from '@/shared/stores/notificationStore';
import { Bell, Trash2, CircleCheckBig, Clock, Filter, MoreVertical, ShoppingCart, Zap, Heart, Info, X } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationPage = () => {
    const notifications = useNotificationStore(state => state.notifications);
    const isLoading = useNotificationStore(state => state.isLoading);
    const fetchNotifications = useNotificationStore(state => state.fetchNotifications);
    const markAsRead = useNotificationStore(state => state.markAsRead);
    const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
    const deleteNotification = useNotificationStore(state => state.deleteNotification);
    const clearAllNotifications = useNotificationStore(state => state.clearAllNotifications);

    const [filter, setFilter] = useState('all'); // all, unread

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        return true;
    });

    const handleMarkRead = async (id) => {
        await markAsRead(id);
        toast.success('Notifikasi ditandai sebagai dibaca');
    };

    const handleDelete = async (id) => {
        await deleteNotification(id);
        toast.success('Notifikasi dihapus');
    };

    const handleClearAll = async () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
            await clearAllNotifications();
            toast.success('Semua notifikasi telah dihapus');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'cart': return <ShoppingCart size={18} className="text-blue-600" />;
            case 'promo': return <Zap size={18} className="text-purple-600" />;
            case 'wishlist': return <Heart size={18} className="text-red-600" />;
            default: return <Info size={18} className="text-gray-600" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'cart': return 'bg-blue-100';
            case 'promo': return 'bg-purple-100';
            case 'wishlist': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notifikasi</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola semua pemberitahuan dan info terbaru Anda.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                            >
                                <Trash2 size={16} /> Hapus Semua
                            </button>
                        )}
                        <button 
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
                        >
                            <CircleCheckBig size={16} /> Tandai Semua Dibaca
                        </button>
                    </div>
                </div>

                 {/* Filters */}
                <div className="flex items-center gap-2 mb-6 p-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 w-fit shadow-sm">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            filter === 'all' ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            filter === 'unread' ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Belum Dibaca
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {isLoading && notifications.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat notifikasi...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredNotifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`group p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/40 relative ${!n.read ? 'bg-orange-50/20 dark:bg-orange-950/20' : ''}`}
                                >
                                    {!n.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.3)]"></div>
                                    )}
                                    
                                    <div className="flex gap-4 md:gap-6">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${getIconBg(n.type)}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h3 className={`text-base md:text-lg truncate pr-4 ${!n.read ? 'font-extrabold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!n.read && (
                                                        <button 
                                                            onClick={() => handleMarkRead(n.id)}
                                                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                            title="Tandai dibaca"
                                                        >
                                                            <CircleCheckBig size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(n.id)}
                                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm md:text-base leading-relaxed mb-3 ${!n.read ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-800/60 px-2 py-1 rounded-md transition-colors">
                                                    <Clock size={14} />
                                                    {new Date(n.time).toLocaleString('id-ID', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric',
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                {!n.read && (
                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full"> Baru </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 px-6 text-center">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                <Bell size={40} className="text-gray-200 dark:text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak ada notifikasi</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                {filter === 'unread' 
                                    ? 'Hebat! Anda sudah membaca semua notifikasi terbaru.' 
                                    : 'Belum ada notifikasi baru untuk Anda saat ini.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};
