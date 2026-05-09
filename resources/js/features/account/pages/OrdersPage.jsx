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

    const handlePayNow = (order) => {
        if (order.payment_token) {
            window.snap.pay(order.payment_token, {
                onSuccess: (result) => {
                    toast.success('Pembayaran berhasil!');
                    fetchOrders();
                },
                onPending: (result) => {
                    toast.info('Menunggu pembayaran...');
                    fetchOrders();
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/account" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pesanan Saya</h1>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p>Memuat daftar pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Package size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum ada pesanan</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Anda belum pernah melakukan pemesanan. Yuk telusuri produk kami dan mulai belanja!</p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center justify-center bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const config = getStatusConfig(order.status, order.payment_status);
                            const StatusIcon = config.icon;
                            const firstItem = order.items && order.items[0];
                            const otherCount = order.items ? order.items.length - 1 : 0;
                            
                            return (
                                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.color} ${config.border} text-xs font-bold uppercase tracking-wider`}>
                                                <StatusIcon size={14} />
                                                {config.label}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 min-w-0">
                                            {firstItem && (
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                                        <ImageFallback 
                                                            src={getImageUrl(firstItem.product?.images?.[0]?.url)} 
                                                            alt={firstItem.product_name_snapshot}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-1">
                                                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{firstItem.product_name_snapshot}</h4>
                                                        {firstItem.variation_name_snapshot && (
                                                            <p className="text-xs text-gray-500 mb-1">Varian: {firstItem.variation_name_snapshot}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500">{firstItem.qty} barang x {formatPrice(firstItem.unit_price_sen)}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {otherCount > 0 && (
                                                <div className="mt-4 text-sm font-medium text-gray-500 pl-24">
                                                    + {otherCount} produk lainnya
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="w-full md:w-48 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Belanja</p>
                                            <p className="text-xl font-black text-gray-900">{formatPrice(order.total_sen)}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-end gap-3">
                                        <Link 
                                            to={`/account/orders/${order.id}`}
                                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            Lihat Detail
                                        </Link>
                                        {order.status === 'PENDING' && (
                                            <button 
                                                onClick={() => handlePayNow(order)}
                                                className="px-6 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
                                            >
                                                Bayar Sekarang
                                            </button>
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
