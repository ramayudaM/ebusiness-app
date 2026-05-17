import React, { useEffect, useState } from 'react';
import { Layout } from '@/shared/components/Layout';
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
            case 'cart': return <ShoppingCart size={18} className="text-blue-400" />;
            case 'promo': return <Zap size={18} className="text-amber-400" />;
            case 'wishlist': return <Heart size={18} className="text-red-400" />;
            default: return <Info size={18} className="text-zinc-400" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'cart': return 'bg-blue-950/30 border border-blue-900/20';
            case 'promo': return 'bg-amber-950/30 border border-amber-900/20';
            case 'wishlist': return 'bg-red-950/30 border border-red-900/20';
            default: return 'bg-zinc-950 border border-zinc-800/60';
        }
    };

    return (
        <Layout>
            <main className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12 relative z-10 selection:bg-orange-500/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Notifikasi</h1>
                        <p className="text-zinc-400 mt-1 font-medium">Kelola semua pemberitahuan dan info terbaru Anda.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all border border-transparent hover:border-red-900/30"
                            >
                                <Trash2 size={16} /> Hapus Semua
                            </button>
                        )}
                        <button 
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-orange-400 hover:text-orange-500 hover:bg-orange-950/20 rounded-xl transition-all border border-transparent hover:border-orange-900/30"
                        >
                            <CircleCheckBig size={16} /> Tandai Semua Dibaca
                        </button>
                    </div>
                </div>

                 {/* Filters */}
                <div className="flex items-center gap-2 mb-6 p-1 bg-zinc-900/40 rounded-xl border border-zinc-800 backdrop-blur-md w-fit shadow-lg">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            filter === 'all' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            filter === 'unread' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        Belum Dibaca
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-zinc-900/40 rounded-2xl shadow-xl border border-zinc-800/80 backdrop-blur-md overflow-hidden">
                    {isLoading && notifications.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-zinc-450 font-medium">Memuat notifikasi...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-zinc-800/50">
                            {filteredNotifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`group p-5 md:p-6 transition-all hover:bg-zinc-900/20 relative ${!n.read ? 'bg-orange-950/5' : ''}`}
                                >
                                    {!n.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]"></div>
                                    )}
                                    
                                    <div className="flex gap-4 md:gap-6">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-md ${getIconBg(n.type)}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h3 className={`text-base md:text-lg truncate pr-4 ${!n.read ? 'font-extrabold text-white' : 'font-semibold text-zinc-300'}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!n.read && (
                                                        <button 
                                                            onClick={() => handleMarkRead(n.id)}
                                                            className="p-2 text-zinc-500 hover:text-orange-400 hover:bg-orange-950/20 rounded-lg transition-all"
                                                            title="Tandai dibaca"
                                                        >
                                                            <CircleCheckBig size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(n.id)}
                                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm md:text-base leading-relaxed mb-3 ${!n.read ? 'text-zinc-100 font-medium' : 'text-zinc-400'}`}>
                                                {n.message}
                                            </p>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-450 bg-[#050505]/40 border border-zinc-800/60 px-2 py-1 rounded-md transition-colors">
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
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-900/30 px-2 py-0.5 rounded-full"> Baru </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 px-6 text-center">
                            <div className="w-24 h-24 bg-zinc-950 border border-zinc-800/65 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                <Bell size={40} className="text-zinc-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tidak ada notifikasi</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto font-medium">
                                {filter === 'unread' 
                                    ? 'Hebat! Anda sudah membaca semua notifikasi terbaru.' 
                                    : 'Belum ada notifikasi baru untuk Anda saat ini.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
};
