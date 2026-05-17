import React, { useEffect, useState } from 'react';
import { Layout } from '@/shared/components/Layout';
import { Package, ChevronRight, Loader2, Search, ArrowLeft, Clock, CircleCheckBig, Truck, CircleX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/shared/utils/api';
import { toast } from 'sonner';
import { ImageFallback } from '@/shared/components/ImageFallback';

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/orders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            toast.error('Gagal memuat pesanan');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusConfig = (status, paymentStatus) => {
        if (status === 'PENDING') {
            return {
                label: 'Menunggu Pembayaran',
                color: 'text-amber-400',
                bg: 'bg-amber-955/30',
                border: 'border-amber-900/40',
                icon: Clock
            };
        }
        if (status === 'PROCESSING') {
            return {
                label: 'Sedang Dikemas',
                color: 'text-blue-400',
                bg: 'bg-blue-955/30',
                border: 'border-blue-900/40',
                icon: Package
            };
        }
        if (status === 'SHIPPED') {
            return {
                label: 'Sedang Dikirim',
                color: 'text-purple-400',
                bg: 'bg-purple-955/30',
                border: 'border-purple-900/40',
                icon: Truck
            };
        }
        if (status === 'COMPLETED') {
            return {
                label: 'Selesai',
                color: 'text-green-400',
                bg: 'bg-green-955/30',
                border: 'border-green-900/40',
                icon: CircleCheckBig
            };
        }
        if (status === 'CANCELLED') {
            return {
                label: 'Dibatalkan',
                color: 'text-red-400',
                bg: 'bg-red-955/30',
                border: 'border-red-900/40',
                icon: CircleX
            };
        }
        return {
            label: status,
            color: 'text-zinc-400',
            bg: 'bg-zinc-900/30',
            border: 'border-zinc-800/40',
            icon: Package
        };
    };

    const handleCancelOrder = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;

        try {
            const res = await api.post(`/orders/${id}/cancel`);
            toast.success(res.data.message || 'Pesanan berhasil dibatalkan');
            fetchOrders();
        } catch (err) {
            console.error('Failed to cancel order:', err);
            toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan');
        }
    };

    const handleVerifyPayment = async (orderNumber) => {
        try {
            const res = await api.get(`/checkout/verify/${orderNumber}`);
            if (res.data.success) {
                toast.success('Status pembayaran diperbarui');
                fetchOrders();
            }
        } catch (err) {
            console.error('Failed to verify payment:', err);
            toast.error('Gagal memperbarui status');
        }
    };

    const handlePayNow = (order) => {
        if (order.payment_token) {
            window.snap.pay(order.payment_token, {
                onSuccess: (result) => {
                    toast.success('Pembayaran berhasil!');
                    handleVerifyPayment(order.order_number);
                },
                onPending: (result) => {
                    toast.info('Menunggu pembayaran...');
                    handleVerifyPayment(order.order_number);
                },
                onError: (result) => {
                    toast.error('Pembayaran gagal');
                },
                onClose: () => {
                    toast.warning('Anda menutup pembayaran sebelum selesai');
                }
            });
        } else {
            toast.error('Token pembayaran tidak ditemukan');
        }
    };

    return (
        <Layout>
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 selection:bg-orange-500/30">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 font-semibold uppercase tracking-wider text-[11px]">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
                    <ChevronRight size={12} className="text-zinc-600" />
                    <span className="text-white font-bold">Pesanan Saya</span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                        <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                        <p className="font-semibold">Memuat daftar pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-zinc-900/40 rounded-3xl p-12 md:p-20 text-center border border-zinc-800/80 shadow-2xl backdrop-blur-md">
                        <div className="w-32 h-32 bg-orange-950/20 border border-orange-900/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
                            <Package size={48} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Belum ada pesanan</h2>
                        <p className="text-zinc-400 max-w-md mx-auto mb-10 text-lg font-medium">Anda belum pernah melakukan pemesanan. Yuk telusuri produk kami dan mulai belanja!</p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-full transition-all shadow-[0_0_25px_rgba(234,88,12,0.3)] hover:-translate-y-1"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-6">
                            <h1 className="text-3xl font-black text-white tracking-tight">Pesanan Saya</h1>
                            <span className="bg-orange-950/40 border border-orange-900/30 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">({orders.length} Pesanan)</span>
                        </div>
                        {orders.map((order) => {
                            const config = getStatusConfig(order.status, order.payment_status);
                            const StatusIcon = config.icon;
                            const firstItem = order.items && order.items[0];
                            const otherCount = order.items ? order.items.length - 1 : 0;
                            
                            return (
                                <div 
                                    key={order.id} 
                                    onClick={() => navigate(`/account/orders/${order.id}`)}
                                    className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 overflow-hidden cursor-pointer group"
                                >
                                    <div className="px-6 py-4 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 bg-zinc-950/30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-955/30 border border-orange-900/20 rounded-lg text-orange-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest">Nomor Pesanan</p>
                                                <p className="text-sm font-black text-white tracking-wide">{order.order_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-zinc-400 font-semibold">{formatDate(order.created_at)}</span>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.color} ${config.border} text-[10px] font-black uppercase tracking-wider`}>
                                                <StatusIcon size={14} />
                                                {config.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 flex flex-col md:flex-row gap-6 bg-[#050505]/20">
                                        <div className="flex-1 min-w-0">
                                            {firstItem && (
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 bg-zinc-950 rounded-xl border border-zinc-850 overflow-hidden shrink-0">
                                                        <ImageFallback 
                                                            src={getImageUrl(firstItem.product?.images?.[0]?.url)} 
                                                            alt={firstItem.product_name_snapshot}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-1">
                                                        <h4 className="font-black text-white line-clamp-1 mb-1 transition-colors group-hover:text-orange-400 leading-snug">{firstItem.product_name_snapshot}</h4>
                                                        {firstItem.variation_name_snapshot && (
                                                            <p className="text-xs text-zinc-450 font-semibold mb-1">Varian: {firstItem.variation_name_snapshot}</p>
                                                        )}
                                                        <p className="text-xs text-zinc-400 font-semibold">{firstItem.qty} barang x {formatPrice(firstItem.unit_price_sen)}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {otherCount > 0 && (
                                                <div className="mt-4 text-xs font-bold text-zinc-450 uppercase tracking-widest pl-24">
                                                    + {otherCount} produk lainnya
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="w-full md:w-48 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-800/60 pt-4 md:pt-0 md:pl-6">
                                            <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest mb-1">Total Belanja</p>
                                            <p className="text-xl font-black text-white tracking-tight">{formatPrice(order.total_sen)}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 bg-zinc-950/40 border-t border-zinc-800/60 flex flex-wrap items-center justify-end gap-3 transition-colors">
                                        <Link 
                                            to={`/account/orders/${order.id}`}
                                            className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black text-xs rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                                        >
                                            Lihat Detail
                                        </Link>
                                        {order.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVerifyPayment(order.order_number);
                                                    }}
                                                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black text-xs rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                                                >
                                                    Cek Status
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelOrder(order.id);
                                                    }}
                                                    className="px-6 py-2.5 bg-zinc-900 border border-red-900/40 text-red-400 font-black text-xs rounded-xl hover:bg-red-950/15 hover:text-red-300 transition-all"
                                                >
                                                    Batalkan Pesanan
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePayNow(order);
                                                    }}
                                                    className="px-6 py-2.5 bg-orange-600 text-white font-black text-xs rounded-xl hover:bg-orange-500 transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                                                >
                                                    Bayar Sekarang
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </Layout>
    );
};
