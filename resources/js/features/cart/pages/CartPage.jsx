import React, { useEffect, useState } from 'react';
import { Layout } from '@/shared/components/Layout';
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
            <Layout>
                <div className="flex-1 flex items-center justify-center py-32">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 selection:bg-orange-500/30">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/explore" className="p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white flex items-center justify-center shadow-md bg-zinc-900/20">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">Keranjang Belanja</h1>
                            <span className="bg-orange-950/40 border border-orange-900/30 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {items.length} Produk
                            </span>
                        </div>
                    </div>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Selection Header */}
                            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                     <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={allSelected} 
                                            onChange={handleToggleAll}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-zinc-850 checked:bg-orange-650 checked:border-orange-650 transition-all bg-[#050505]"
                                        />
                                        <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">Pilih Semua</span>
                                </label>
                                
                                {selectedCount > 0 && (
                                    <button 
                                        onClick={() => {}} // Handle delete selected
                                        className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                                    >
                                        Hapus Terpilih
                                    </button>
                                )}
                            </div>

                            {/* Products */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.cartItemId} className="bg-zinc-900/40 p-4 md:p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all group">
                                        <div className="flex gap-4 md:gap-6">
                                            {/* Checkbox */}
                                             <div className="flex items-center">
                                                <div className="relative flex items-center justify-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={item.isSelected}
                                                        onChange={(e) => toggleSelection(item.cartItemId, e.target.checked)}
                                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-zinc-850 checked:bg-orange-655 checked:border-orange-655 transition-all bg-[#050505]"
                                                    />
                                                    <ShieldCheck className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800/60">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <Link to={`/product/${item.id}`} className="text-base md:text-lg font-bold text-white hover:text-orange-500 transition-colors line-clamp-1">
                                                         {item.name}
                                                    </Link>
                                                    {item.variation && (
                                                        <p className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">
                                                            Variasi: <span className="font-bold text-zinc-200">{item.variation.name}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-lg font-black text-orange-500 mt-2">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-1.5 p-1 bg-[#050505] rounded-xl border border-zinc-800 w-fit">
                                                        <button 
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                     <button 
                                                        onClick={() => removeItem(item.cartItemId)}
                                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl border border-transparent hover:border-red-900/30 transition-all"
                                                        title="Hapus dari keranjang"
                                                    >
                                                        <Trash2 size={18} />
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
                            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)] overflow-hidden relative backdrop-blur-md">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-600"></div>
                                
                                <h3 className="text-xl font-extrabold text-white mb-6">Ringkasan Pesanan</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-zinc-400">
                                        <span className="text-sm font-medium">Total Produk ({selectedCount})</span>
                                        <span className="font-bold text-white">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span className="text-sm font-medium">Biaya Pengiriman</span>
                                        <span className="text-xs font-semibold text-zinc-500 italic">Dihitung saat checkout</span>
                                    </div>
                                    <div className="flex justify-between text-green-400">
                                        <span className="text-sm font-medium">Diskon</span>
                                        <span className="font-bold">- {formatPrice(0)}</span>
                                    </div>
                                    
                                    <div className="h-px bg-zinc-800/80 my-4"></div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Pembayaran</p>
                                            <p className="text-2xl font-black text-white mt-1">{formatPrice(totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/checkout" className="block">
                                    <button 
                                        disabled={selectedCount === 0}
                                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:bg-zinc-800/50 disabled:border-zinc-850 disabled:text-zinc-600 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:shadow-none"
                                    >
                                        Checkout Sekarang
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-green-500 animate-pulse" /> Transaksi Aman & Terenkripsi
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                        <Truck size={14} className="text-blue-400 animate-pulse" /> Pengiriman Seluruh Indonesia
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-zinc-900/40 rounded-3xl p-12 md:p-20 text-center border border-zinc-800/80 shadow-2xl backdrop-blur-md">
                        <div className="w-32 h-32 bg-orange-950/20 border border-orange-900/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
                            <ShoppingCart size={48} className="text-orange-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Wah, Keranjangmu Kosong!</h2>
                        <p className="text-zinc-400 max-w-md mx-auto mb-10 text-lg font-medium">
                            Sepertinya Anda belum memilih instrumen impian. Ayo jelajahi koleksi kami sekarang!
                        </p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-full transition-all shadow-[0_0_25px_rgba(234,88,12,0.3)] hover:-translate-y-1"
                        >
                            Mulai Belanja
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                )}
            </main>
        </Layout>
    );
};
