import React, { useEffect, useState } from 'react';
import { Layout } from '@/shared/components/Layout';
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
            <Layout>
                <div className="flex-1 flex flex-col items-center justify-center py-40 text-zinc-400">
                    <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                    <p className="font-semibold">Memuat detail pesanan...</p>
                </div>
            </Layout>
        );
    }

    if (!order) return null;

    const config = getStatusConfig(order.status, order.payment_status);
    const StatusIcon = config.icon;

    return (
        <Layout>
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 selection:bg-orange-500/30">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 font-semibold uppercase tracking-wider text-[11px]">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
                    <ChevronRight size={12} className="text-zinc-650" />
                    <Link to="/account/orders" className="hover:text-orange-500 transition-colors">Pesanan Saya</Link>
                    <ChevronRight size={12} className="text-zinc-650" />
                    <span className="text-white font-bold">Detail Pesanan</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            Detail Pesanan
                        </h1>
                        <p className="text-sm font-semibold text-zinc-450 mt-1 uppercase tracking-wider">{order.order_number}</p>
                    </div>
                </div>

                {order.status === 'PENDING' && (
                    <div className="bg-amber-955/20 border border-amber-900/40 rounded-2xl p-6 mb-8 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-amber-955/40 border border-amber-900/40 rounded-full flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                                <CircleAlert size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-white">Segera Lakukan Pembayaran</h3>
                                <p className="text-sm text-zinc-400 mt-1">Selesaikan pembayaran sebelum pesanan Anda dibatalkan otomatis oleh sistem.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                            <button 
                                onClick={handleVerifyPayment}
                                className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black text-xs rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                            >
                                Cek Status
                            </button>
                            <button 
                                onClick={handleCancelOrder}
                                className="px-6 py-2.5 bg-zinc-900 border border-red-900/40 text-red-400 font-black text-xs rounded-xl hover:bg-red-955/15 hover:text-red-300 transition-all"
                            >
                                Batalkan Pesanan
                            </button>
                            <button 
                                onClick={handlePayNow}
                                className="px-6 py-2.5 bg-orange-600 text-white font-black text-xs rounded-xl hover:bg-orange-500 transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] whitespace-nowrap"
                            >
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md overflow-hidden">
                            <div className={`p-6 flex items-center justify-between ${config.bg} bg-opacity-20`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-white">
                                        <StatusIcon size={24} className={config.color} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest opacity-70">Status Pesanan</p>
                                        <h2 className={`text-xl font-black ${config.color}`}>{config.label}</h2>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest">Tanggal Pesanan</p>
                                    <p className="font-black text-white mt-0.5">{formatDate(order.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-950/30">
                                <Package size={20} className="text-zinc-450" />
                                <h2 className="font-black text-white">Daftar Produk</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6 bg-[#050505]/20">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-zinc-950 rounded-xl border border-zinc-850 overflow-hidden shrink-0">
                                            <ImageFallback 
                                                src={getImageUrl(item.product?.images?.[0]?.url)} 
                                                alt={item.product_name_snapshot}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-black text-white line-clamp-2 leading-snug">{item.product_name_snapshot}</h4>
                                            {item.variation_name_snapshot && (
                                                <p className="text-xs text-zinc-455 font-semibold mt-1">Varian: {item.variation_name_snapshot}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-zinc-400 font-semibold">{item.qty} x {formatPrice(item.unit_price_sen)}</p>
                                                <p className="font-black text-white">{formatPrice(item.subtotal_sen)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-950/30">
                                <MapPin size={20} className="text-zinc-450" />
                                <h2 className="font-black text-white">Info Pengiriman</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#050505]/20">
                                <div>
                                    <p className="text-[10px] text-zinc-455 font-bold uppercase tracking-widest mb-2">Kurir</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase bg-orange-950/60 border border-orange-900/40 text-orange-400 px-2.5 py-1 rounded">
                                            {order.shipping_courier}
                                        </span>
                                        <span className="font-black text-white pl-1">{order.shipping_service}</span>
                                    </div>
                                    {order.tracking_number && (
                                        <div className="mt-4">
                                            <p className="text-[10px] text-zinc-455 font-bold uppercase tracking-widest mb-1.5">No. Resi</p>
                                            <p className="font-bold text-white bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-850 inline-block font-mono text-sm tracking-wider">
                                                {order.tracking_number}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-455 font-bold uppercase tracking-widest mb-2">Alamat Tujuan</p>
                                    <p className="font-black text-white">{order.shipping_name}</p>
                                    <p className="text-sm text-zinc-400 font-semibold mt-1">{order.shipping_phone}</p>
                                    <p className="text-sm text-zinc-400 mt-2 font-medium leading-relaxed">{order.shipping_address}</p>
                                    <p className="text-sm text-zinc-400 font-medium">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md overflow-hidden sticky top-[92px]">
                            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-950/30">
                                <Receipt size={20} className="text-zinc-450" />
                                <h2 className="font-black text-white">Ringkasan Pembayaran</h2>
                            </div>
                            <div className="p-6 space-y-4 bg-[#050505]/20">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-semibold">Total Harga ({(order.items || []).reduce((acc, item) => acc + item.qty, 0)} Barang)</span>
                                    <span className="font-bold text-white">{formatPrice(order.subtotal_sen)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-semibold">Total Ongkos Kirim</span>
                                    <span className="font-bold text-white">{formatPrice(order.shipping_cost_sen)}</span>
                                </div>
                                <div className="h-px bg-zinc-800/60 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-white">Total Belanja</span>
                                    <span className="text-2xl font-black text-orange-500 tracking-tight">{formatPrice(order.total_sen)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};
