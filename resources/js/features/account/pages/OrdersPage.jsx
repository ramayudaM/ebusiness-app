import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
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
                color: 'text-orange-600',
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                icon: Clock
            };
        }
        if (status === 'PAID' || status === 'PROCESSING') {
            return {
                label: 'Sedang Dikemas',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: Package
            };
        }
        if (status === 'SHIPPED') {
            return {
                label: 'Sedang Dikirim',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                icon: Truck
            };
        }
        if (status === 'COMPLETED' || status === 'DELIVERED') {
            return {
                label: 'Selesai',
                color: 'text-green-600',
                bg: 'bg-green-50',
                border: 'border-green-200',
                icon: CircleCheckBig
            };
        }
        if (status === 'CANCELLED') {
            return {
                label: 'Dibatalkan',
                color: 'text-red-600',
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: CircleX
            };
        }
        return {
            label: status,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
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
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-10">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">Beranda</Link>
                    <ChevronRight size={14} />
                    <span className="text-[var(--text-primary)]">Pesanan Saya</span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-[var(--text-muted)]">
                        <Loader2 className="animate-spin mb-4 text-[var(--primary)]" size={32} />
                        <p className="text-sm font-bold uppercase tracking-widest">Memuat daftar pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] p-16 text-center transition-colors">
                        <div className="w-24 h-24 bg-[var(--surface-secondary)] border border-[var(--border-soft)] rounded-full flex items-center justify-center mx-auto mb-8 text-[var(--primary)]">
                            <Package size={40} />
                        </div>
                        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4">Belum ada pesanan</h2>
                        <p className="text-[var(--text-secondary)] mb-10 max-w-md mx-auto leading-relaxed">Anda belum pernah melakukan pemesanan. Mulai telusuri koleksi kami dan temukan mahakarya Anda.</p>
                        <Link
                            to="/explore"
                            className="btn-atelier-primary px-10 py-4"
                        >
                            Eksplorasi Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-10 border-b border-[var(--border-premium)] pb-6">
                            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Pesanan Saya</h1>
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--surface-secondary)] px-4 py-2 rounded-full border border-[var(--border-soft)]">{orders.length} Pesanan</span>
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
                                    className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-[var(--primary)]/30 transition-all duration-500 cursor-pointer overflow-hidden group"
                                >
                                    <div className="px-6 md:px-8 py-5 border-b border-[var(--border-premium)] flex flex-wrap items-center justify-between gap-4 bg-[var(--surface-secondary)]/50">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl text-[var(--primary)]">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Nomor Pesanan</p>
                                                <p className="text-sm font-mono font-bold text-[var(--text-primary)]">{order.order_number}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-[var(--text-muted)]">{formatDate(order.created_at)}</span>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.color} ${config.border} text-[10px] font-black uppercase tracking-widest bg-opacity-20`}>
                                                <StatusIcon size={14} />
                                                {config.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="px-6 md:px-8 py-6 flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 min-w-0">
                                            {firstItem && (
                                                <div className="flex gap-5">
                                                    <div className="w-24 h-24 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-premium)] overflow-hidden shrink-0">
                                                        <ImageFallback
                                                            src={getImageUrl(firstItem.product?.images?.[0]?.url)}
                                                            alt={firstItem.product_name_snapshot}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                                        <h4 className="font-bold text-base text-[var(--text-primary)] line-clamp-1 mb-2 transition-colors group-hover:text-[var(--primary)]">{firstItem.product_name_snapshot}</h4>
                                                        {firstItem.variation_name_snapshot && (
                                                            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Varian: {firstItem.variation_name_snapshot}</p>
                                                        )}
                                                        <p className="text-xs font-mono text-[var(--text-muted)]">{firstItem.qty} × {formatPrice(firstItem.unit_price_sen)}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {otherCount > 0 && (
                                                <div className="mt-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] pl-[116px]">
                                                    + {otherCount} karya lainnya
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full md:w-48 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[var(--border-premium)] pt-5 md:pt-0 md:pl-8">
                                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Total Belanja</p>
                                            <p className="text-xl font-mono font-bold text-[var(--primary)]">{formatPrice(order.total_sen)}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 md:px-8 py-5 bg-[var(--surface-secondary)]/30 border-t border-[var(--border-premium)] flex flex-wrap items-center justify-end gap-4 transition-colors">
                                        <Link
                                            to={`/account/orders/${order.id}`}
                                            className="px-6 py-3 bg-transparent border border-[var(--border-premium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-soft)] hover:bg-[var(--surface-hover)] font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                                        >
                                            Lihat Detail
                                        </Link>
                                        {order.status === 'PENDING' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVerifyPayment(order.order_number);
                                                    }}
                                                    className="px-6 py-3 bg-[var(--surface-primary)] border border-[var(--border-premium)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest rounded-xl hover:border-[var(--primary)] transition-colors"
                                                >
                                                    Cek Status
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelOrder(order.id);
                                                    }}
                                                    className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePayNow(order);
                                                    }}
                                                    className="btn-atelier-primary px-8 py-3 text-xs"
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

            <Footer />
        </div>
    );
};
