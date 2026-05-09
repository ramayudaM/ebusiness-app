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

    const handlePayNow = () => {
        if (order?.payment_token) {
            window.snap.pay(order.payment_token, {
                onSuccess: (result) => {
                    toast.success('Pembayaran berhasil!');
                    fetchOrder();
                },
                onPending: (result) => {
                    toast.info('Menunggu pembayaran...');
                    fetchOrder();
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/account/orders" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                                Detail Pesanan
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">{order.order_number}</p>
                        </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.color} ${config.border} text-sm font-bold uppercase tracking-wider self-start sm:self-auto`}>
                        <StatusIcon size={18} />
                        {config.label}
                    </div>
                </div>

                {order.status === 'PENDING' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                                <CircleAlert size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Segera Lakukan Pembayaran</h3>
                                <p className="text-sm text-gray-600 mt-1">Selesaikan pembayaran sebelum pesanan Anda dibatalkan otomatis oleh sistem.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handlePayNow}
                            className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                                <Package size={20} className="text-gray-400" />
                                <h2 className="font-bold text-gray-900">Daftar Produk</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                                <ImageFallback 
                                                    src={getImageUrl(item.product?.images?.[0]?.url)} 
                                                    alt={item.product_name_snapshot}
                                                    className="w-full h-full object-cover"
                                                />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-gray-900 line-clamp-2">{item.product_name_snapshot}</h4>
                                            {item.variation_name_snapshot && (
                                                <p className="text-xs text-gray-500 mt-1">Varian: {item.variation_name_snapshot}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-gray-600">{item.qty} x {formatPrice(item.unit_price_sen)}</p>
                                                <p className="font-bold text-gray-900">{formatPrice(item.subtotal_sen)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                                <MapPin size={20} className="text-gray-400" />
                                <h2 className="font-bold text-gray-900">Info Pengiriman</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kurir</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-1 rounded">
                                            {order.shipping_courier}
                                        </span>
                                        <span className="font-bold text-gray-900">{order.shipping_service}</span>
                                    </div>
                                    {order.tracking_number && (
                                        <div className="mt-4">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">No. Resi</p>
                                            <p className="font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 inline-block">
                                                {order.tracking_number}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Tujuan</p>
                                    <p className="font-bold text-gray-900">{order.shipping_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.shipping_phone}</p>
                                    <p className="text-sm text-gray-600 mt-2">{order.shipping_address}</p>
                                    <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-[100px]">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                                <Receipt size={20} className="text-gray-400" />
                                <h2 className="font-bold text-gray-900">Ringkasan Pembayaran</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total Harga ({(order.items || []).reduce((acc, item) => acc + item.qty, 0)} Barang)</span>
                                    <span className="font-bold text-gray-900">{formatPrice(order.subtotal_sen)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total Ongkos Kirim</span>
                                    <span className="font-bold text-gray-900">{formatPrice(order.shipping_cost_sen)}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-900">Total Belanja</span>
                                    <span className="text-2xl font-black text-orange-600">{formatPrice(order.total_sen)}</span>
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
