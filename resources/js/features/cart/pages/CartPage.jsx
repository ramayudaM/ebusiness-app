import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useCartStore } from '@/shared/stores/cartStore';
import { ShoppingBag, Trash2, Minus, Plus, ChevronRight, ArrowLeft, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CartPage = () => {
    const navigate = useNavigate();
    const { 
        items, 
        isLoading, 
        fetchItems, 
        updateQuantity, 
        removeItem, 
        toggleSelection, 
        toggleAllSelection,
        getSelectedTotalPrice,
        getSelectedTotalItems
    } = useCartStore();

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const allSelected = items.length > 0 && items.every(item => item.isSelected);
    const selectedCount = getSelectedTotalItems();
    const totalPrice = getSelectedTotalPrice();

    const handleToggleAll = () => {
        toggleAllSelection(!allSelected);
    };

    const handleCheckout = () => {
        if (selectedCount === 0) {
            toast.error('Pilih setidaknya satu produk untuk checkout');
            return;
        }
        navigate('/checkout');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (isLoading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/explore" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Keranjang Belanja</h1>
                    <span className="ml-2 bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
                        {items.length} Produk
                    </span>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Selection Header */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={allSelected} 
                                            onChange={handleToggleAll}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 transition-all"
                                        />
                                        <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Pilih Semua</span>
                                </label>
                                
                                {selectedCount > 0 && (
                                    <button 
                                        onClick={() => {}} // Handle delete selected
                                        className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                                    >
                                        Hapus Terpilih
                                    </button>
                                )}
                            </div>

                            {/* Products */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.cartItemId} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex gap-4 md:gap-6">
                                            {/* Checkbox */}
                                            <div className="flex items-center">
                                                <div className="relative flex items-center justify-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={item.isSelected}
                                                        onChange={(e) => toggleSelection(item.cartItemId, e.target.checked)}
                                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-orange-600 checked:border-orange-600 transition-all"
                                                    />
                                                    <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                </div>
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <Link to={`/product/${item.id}`} className="text-base md:text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    {item.variation && (
                                                        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                                            Variasi: <span className="font-medium text-gray-700">{item.variation.name}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-lg font-extrabold text-orange-600 mt-1 md:mt-2">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100 w-fit">
                                                        <button 
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1 hover:bg-white rounded-md text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                            className="p-1 hover:bg-white rounded-md text-gray-500 transition-colors shadow-sm"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button 
                                                        onClick={() => removeItem(item.cartItemId)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Hapus dari keranjang"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:sticky lg:top-[100px]">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                                
                                <h3 className="text-xl font-extrabold text-gray-900 mb-6">Ringkasan Pesanan</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600">
                                        <span className="text-sm">Total Produk ({selectedCount})</span>
                                        <span className="font-bold">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="text-sm">Biaya Pengiriman</span>
                                        <span className="text-xs font-medium text-gray-400 italic">Dihitung saat checkout</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span className="text-sm">Diskon</span>
                                        <span className="font-bold">- {formatPrice(0)}</span>
                                    </div>
                                    
                                    <div className="h-px bg-gray-100 my-4"></div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Pembayaran</p>
                                            <p className="text-2xl font-black text-gray-950 mt-1">{formatPrice(totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/checkout" className="block">
                                    <button 
                                        disabled={selectedCount === 0}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed group shadow-lg shadow-orange-100"
                                    >
                                        Checkout Sekarang
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-green-500" /> Transaksi Aman & Terenkripsi
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        <Truck size={14} className="text-blue-500" /> Pengiriman Seluruh Indonesia
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 md:p-20 text-center border border-gray-100 shadow-sm">
                        <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
                            <ShoppingCart size={48} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Wah, Keranjangmu Kosong!</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                            Sepertinya Anda belum memilih instrumen impian. Ayo jelajahi koleksi kami sekarang!
                        </p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-4 rounded-full transition-all shadow-xl shadow-orange-100 hover:shadow-orange-200 hover:-translate-y-1"
                        >
                            Mulai Belanja
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
