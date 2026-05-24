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
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-500">
                <Navbar />
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="animate-spin w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full relative z-10"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <Link to="/explore" className="w-12 h-12 flex items-center justify-center bg-[var(--surface-primary)] border border-[var(--border-premium)] hover:border-[var(--primary)] rounded-full transition-all text-[var(--text-secondary)] hover:text-[var(--primary)] shadow-[var(--shadow-subtle)]">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] tracking-tight">Koleksi Terpilih</h1>
                    <span className="ml-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {items.length} Karya
                    </span>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Selection Header */}
                            <div className="bg-[var(--surface-primary)] p-5 rounded-[1.5rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] flex items-center justify-between">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${allSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)] group-hover:border-[var(--primary)]/50'}`}>
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleToggleAll}
                                            className="hidden"
                                        />
                                        {allSelected && <ShieldCheck size={14} className="text-[var(--bg-primary)]" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">Pilih Semua Karya</span>
                                </label>

                                {selectedCount > 0 && (
                                    <button
                                        onClick={() => { }} // Handle delete selected
                                        className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-2"
                                    >
                                        Hapus Terpilih
                                    </button>
                                )}
                            </div>

                            {/* Products */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.cartItemId} className="bg-[var(--surface-primary)] p-5 md:p-6 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] hover:border-[var(--primary)]/30 hover:shadow-xl transition-all duration-300 group">
                                        <div className="flex gap-5 md:gap-8 items-center">
                                            {/* Checkbox */}
                                            <div className="flex items-center shrink-0">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${item.isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)] hover:border-[var(--primary)]/50'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isSelected}
                                                        onChange={(e) => toggleSelection(item.cartItemId, e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    {item.isSelected && <ShieldCheck size={14} className="text-[var(--bg-primary)]" />}
                                                </div>
                                            </div>

                                            {/* Product Image */}
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-soft)] shrink-0 relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                                                <div>
                                                    <Link to={`/product/${item.id}`} className="text-lg md:text-xl font-display font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    {item.variation && (
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mt-2">
                                                            Varian: <span className="text-[var(--text-secondary)]">{item.variation.name}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-xl font-black text-[var(--primary)] mt-3">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-soft)] w-fit">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-primary)] rounded-lg text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-black text-[var(--text-primary)]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-primary)] rounded-lg text-[var(--text-secondary)] transition-colors shadow-sm"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.cartItemId)}
                                                        className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        title="Hapus mahakarya ini"
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
                        <div className="lg:sticky lg:top-32">
                            <div className="bg-[var(--surface-primary)] p-8 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-elevated)] overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-amber-500"></div>

                                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8">Ringkasan</h3>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between text-[var(--text-secondary)]">
                                        <span className="text-sm font-medium">Mahakarya Terpilih ({selectedCount})</span>
                                        <span className="font-bold text-[var(--text-primary)]">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-[var(--text-secondary)]">
                                        <span className="text-sm font-medium">Pengiriman Eksekutif</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] italic">Kalkulasi di Checkout</span>
                                    </div>
                                    <div className="flex justify-between text-green-500">
                                        <span className="text-sm font-medium">Privilese Diskon</span>
                                        <span className="font-bold">- {formatPrice(0)}</span>
                                    </div>

                                    <div className="h-px bg-[var(--border-premium)] my-6"></div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Total Investasi</p>
                                            <p className="font-display text-3xl font-bold text-[var(--primary)] mt-1 tracking-tight">{formatPrice(totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={selectedCount === 0}
                                    className="w-full btn-atelier-primary disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                                >
                                    Lanjutkan Checkout
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-8 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={14} className="text-green-500" /> 
                                        </div>
                                        <span>Transaksi Aman Terenkripsi</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                            <Truck size={14} className="text-blue-500" /> 
                                        </div>
                                        <span>Pengiriman Eksekutif Seluruh Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[var(--surface-primary)] rounded-[2rem] py-24 px-8 text-center border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] relative overflow-hidden z-10">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
                        <div className="w-32 h-32 bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                            <ShoppingCart size={40} className="text-[var(--primary)]" />
                        </div>
                        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4 relative z-10">Ruang Kurasi Kosong</h2>
                        <p className="text-[var(--text-secondary)] font-medium max-w-md mx-auto mb-10 text-lg relative z-10">
                            Sepertinya Anda belum memilih mahakarya apa pun. Mulai eksplorasi dan temukan instrumen yang tepat.
                        </p>
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-3 btn-atelier-primary px-10 py-5 relative z-10 group"
                        >
                            Eksplorasi Mahakarya
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
