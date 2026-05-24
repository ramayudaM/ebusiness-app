import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { Package, ChevronRight, Loader2, ArrowLeft, Clock, CircleCheckBig, Truck, CircleX, MapPin, Receipt, CircleAlert } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '@/shared/utils/api';
import { toast } from 'sonner';
import { ImageFallback } from '@/shared/components/ImageFallback';

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
        } catch (err) {
            console.error('Failed to fetch order:', err);
            toast.error('Gagal memuat detail pesanan');
            navigate('/account/orders');
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
        if (!dateString) return '-';
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

    const handleCancelOrder = async () => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;

        try {
            const res = await api.post(`/orders/${id}/cancel`);
            toast.success(res.data.message || 'Pesanan berhasil dibatalkan');
            fetchOrder();
        } catch (err) {
            console.error('Failed to cancel order:', err);
            toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan');
        }
    };

    const handleVerifyPayment = async () => {
        try {
            const res = await api.get(`/checkout/verify/${order.order_number}`);
            if (res.data.success) {
                toast.success('Status pembayaran diperbarui');
                fetchOrder();
            }
        } catch (err) {
            console.error('Failed to verify payment:', err);
            toast.error('Gagal memperbarui status');
        }
    };

    const handlePayNow = () => {
        if (order?.payment_token) {
            window.snap.pay(order.payment_token, {
                onSuccess: (result) => {
                    toast.success('Pembayaran berhasil!');
                    handleVerifyPayment();
                },
                onPending: (result) => {
                    toast.info('Menunggu pembayaran...');
                    handleVerifyPayment();
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-500">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
                    <Loader2 className="animate-spin mb-4 text-[var(--primary)]" size={32} />
                    <p className="text-sm font-bold uppercase tracking-widest">Memuat detail pesanan...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) return null;

    const config = getStatusConfig(order.status, order.payment_status);
    const StatusIcon = config.icon;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-10">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">Beranda</Link>
                    <ChevronRight size={14} />
                    <Link to="/account/orders" className="hover:text-[var(--primary)] transition-colors">Pesanan Saya</Link>
                    <ChevronRight size={14} />
                    <span className="text-[var(--text-primary)]">Detail Pesanan</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] tracking-tight mb-2">
                            Detail Pesanan
                        </h1>
                        <p className="text-sm font-mono text-[var(--text-secondary)]">{order.order_number}</p>
                    </div>
                </div>

                {order.status === 'PENDING' && (
                    <div className="bg-[var(--surface-secondary)] border border-[var(--primary)]/30 rounded-[2rem] p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_20px_var(--glow-warm)]">
                        <div className="flex gap-5">
                            <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0 border border-[var(--primary)]/20">
                                <CircleAlert size={28} />
                            </div>
                            <div>
                                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-1">Segera Lakukan Pembayaran</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed">Selesaikan pembayaran Anda untuk segera mendapatkan karya ini.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleVerifyPayment}
                                className="px-8 py-4 bg-transparent border border-[var(--border-premium)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-soft)] font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                            >
                                Cek Status
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="px-8 py-4 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handlePayNow}
                                className="btn-atelier-primary px-10 py-4 text-xs"
                            >
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Card */}
                        <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden">
                            <div className={`p-8 flex items-center justify-between ${config.bg} bg-opacity-10`}>
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${config.bg} ${config.color} bg-opacity-20`}>
                                        <StatusIcon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Status Pesanan</p>
                                        <h2 className={`text-2xl font-display font-bold ${config.color}`}>{config.label}</h2>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Tanggal Pesanan</p>
                                    <p className="font-bold text-[var(--text-primary)]">{formatDate(order.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden">
                            <div className="px-8 py-5 border-b border-[var(--border-premium)] flex items-center gap-4 bg-[var(--surface-secondary)]/50">
                                <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
                                    <Package size={20} />
                                </div>
                                <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Daftar Karya</h2>
                            </div>
                            <div className="p-8 flex flex-col gap-8">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-6">
                                        <div className="w-24 h-24 bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-premium)] overflow-hidden shrink-0">
                                            <ImageFallback
                                                src={getImageUrl(item.product?.images?.[0]?.url)}
                                                alt={item.product_name_snapshot}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-lg text-[var(--text-primary)] line-clamp-2 mb-2">{item.product_name_snapshot}</h4>
                                            {item.variation_name_snapshot && (
                                                <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">Varian: {item.variation_name_snapshot}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-auto">
                                                <p className="text-xs font-mono text-[var(--text-muted)]">{item.qty} × {formatPrice(item.unit_price_sen)}</p>
                                                <p className="font-mono font-bold text-[var(--text-primary)]">{formatPrice(item.subtotal_sen)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden">
                            <div className="px-8 py-5 border-b border-[var(--border-premium)] flex items-center gap-4 bg-[var(--surface-secondary)]/50">
                                <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Info Pengiriman</h2>
                            </div>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Kurir</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg shadow-sm border border-[var(--primary)]">
                                            {order.shipping_courier}
                                        </span>
                                        <span className="font-bold text-[var(--text-primary)]">{order.shipping_service}</span>
                                    </div>
                                    {order.tracking_number && (
                                        <div className="mt-6">
                                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">No. Resi</p>
                                            <p className="font-mono font-bold text-[var(--primary)] bg-[var(--surface-secondary)] px-4 py-3 rounded-xl border border-[var(--border-premium)] inline-block tracking-wider">
                                                {order.tracking_number}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Alamat Tujuan</p>
                                    <div className="bg-[var(--surface-secondary)] p-5 rounded-2xl border border-[var(--border-premium)]">
                                        <p className="font-bold text-[var(--text-primary)] mb-1">{order.shipping_name}</p>
                                        <p className="text-sm font-mono text-[var(--text-secondary)] mb-3 pb-3 border-b border-[var(--border-soft)]">{order.shipping_phone}</p>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{order.shipping_address}</p>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary */}
                        <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden sticky top-28">
                            <div className="px-8 py-5 border-b border-[var(--border-premium)] flex items-center gap-4 bg-[var(--surface-secondary)]/50">
                                <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg">
                                    <Receipt size={20} />
                                </div>
                                <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Ringkasan Nilai</h2>
                            </div>
                            <div className="p-8 space-y-5">
                                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                    <span>Total Karya ({(order.items || []).reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span className="font-mono font-bold text-[var(--text-primary)]">{formatPrice(order.subtotal_sen)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                    <span>Biaya Pengiriman</span>
                                    <span className="font-mono font-bold text-[var(--text-primary)]">{formatPrice(order.shipping_cost_sen)}</span>
                                </div>
                                <div className="h-px bg-[var(--border-premium)] my-6"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Keseluruhan</span>
                                    <span className="text-3xl font-mono font-bold text-[var(--primary)]">{formatPrice(order.total_sen)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
