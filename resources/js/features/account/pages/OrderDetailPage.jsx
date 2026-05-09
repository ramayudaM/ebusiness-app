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
        if (status === 'PROCESSING') {
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
        if (status === 'COMPLETED') {
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p>Memuat detail pesanan...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) return null;

    const config = getStatusConfig(order.status, order.payment_status);
    const StatusIcon = config.icon;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/" className="hover:text-orange-600">Beranda</Link>
                    <ChevronRight size={14} />
                    <Link to="/account/orders" className="hover:text-orange-600">Pesanan Saya</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 dark:text-white font-bold">Detail Pesanan</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            Detail Pesanan
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.order_number}</p>
                    </div>
                </div>

                {order.status === 'PENDING' && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 shadow-sm">
                                <CircleAlert size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Segera Lakukan Pembayaran</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Selesaikan pembayaran sebelum pesanan Anda dibatalkan otomatis oleh sistem.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button 
                                onClick={handleVerifyPayment}
                                className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cek Status
                            </button>
                            <button 
                                onClick={handleCancelOrder}
                                className="px-8 py-3 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                                Batalkan Pesanan
                            </button>
                            <button 
                                onClick={handlePayNow}
                                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-100 dark:shadow-none whitespace-nowrap"
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
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className={`p-6 flex items-center justify-between ${config.bg} bg-opacity-10 dark:bg-opacity-20`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${config.bg} ${config.color} bg-opacity-20`}>
                                        <StatusIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">Status Pesanan</p>
                                        <h2 className={`text-xl font-black ${config.color}`}>{config.label}</h2>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tanggal Pesanan</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{formatDate(order.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/50">
                                <Package size={20} className="text-gray-400 dark:text-gray-500" />
                                <h2 className="font-bold text-gray-900 dark:text-white">Daftar Produk</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0">
                                                <ImageFallback 
                                                    src={getImageUrl(item.product?.images?.[0]?.url)} 
                                                    alt={item.product_name_snapshot}
                                                    className="w-full h-full object-cover"
                                                />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">{item.product_name_snapshot}</h4>
                                            {item.variation_name_snapshot && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Varian: {item.variation_name_snapshot}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.qty} x {formatPrice(item.unit_price_sen)}</p>
                                                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.subtotal_sen)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/50">
                                <MapPin size={20} className="text-gray-400 dark:text-gray-500" />
                                <h2 className="font-bold text-gray-900 dark:text-white">Info Pengiriman</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Kurir</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-1 rounded">
                                            {order.shipping_courier}
                                        </span>
                                        <span className="font-bold text-gray-900 dark:text-white">{order.shipping_service}</span>
                                    </div>
                                    {order.tracking_number && (
                                        <div className="mt-4">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">No. Resi</p>
                                            <p className="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700 inline-block">
                                                {order.tracking_number}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Alamat Tujuan</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{order.shipping_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.shipping_phone}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{order.shipping_address}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-[100px]">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/50">
                                <Receipt size={20} className="text-gray-400 dark:text-gray-500" />
                                <h2 className="font-bold text-gray-900 dark:text-white">Ringkasan Pembayaran</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Total Harga ({(order.items || []).reduce((acc, item) => acc + item.qty, 0)} Barang)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(order.subtotal_sen)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Total Ongkos Kirim</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(order.shipping_cost_sen)}</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total Belanja</span>
                                    <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{formatPrice(order.total_sen)}</span>
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
