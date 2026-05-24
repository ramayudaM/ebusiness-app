import React, { useEffect } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore } from '@/shared/stores/cartStore';
import { ImageFallback } from '@/shared/components/ImageFallback';

export const WishlistPage = () => {
    const navigate = useNavigate();
    const { items, isLoading, fetchItems, toggleWishlist } = useWishlistStore();
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleRemove = async (product) => {
        try {
            await toggleWishlist(product);
            toast.info(`💔 ${product.name} dihapus dari wishlist`);
        } catch (error) {
            toast.error('Gagal menghapus dari wishlist');
        }
    };

    const handleAddToCart = (product) => {
        // Since we don't have variations here, we add the base product
        // or redirect to detail if it has variations.
        // For simplicity, let's just navigate to product detail to choose variations.
        navigate(`/product/${product.id}`);
    };

    const formatPrice = (price) => {
        const value = Number(price || 0);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20 relative">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-12 relative z-10">
                    <Link to="/explore" className="w-12 h-12 flex items-center justify-center bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-premium)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">Koleksi Impian</h1>
                        <p className="text-[var(--text-secondary)] font-medium mt-2">Kurasi instrumen pilihan yang menanti Anda.</p>
                    </div>
                    <span className="hidden md:inline-flex bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-[var(--primary)]/20 shadow-[0_0_15px_var(--glow-warm)]">
                        {items.length} Karya Seni
                    </span>
                </div>

                {isLoading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-32">
                        <Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" />
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
                        {items.map((item) => (
                            <div key={item.id} className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-elevated)] transition-all duration-500 group overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-secondary)]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    <ImageFallback
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        fallbackType="instrument"
                                    />
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:text-red-400 hover:bg-black/60 rounded-full shadow-lg transition-all transform hover:scale-110 z-20 border border-white/10"
                                        title="Hapus dari koleksi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <Link to={`/product/${item.id}`} className="font-display text-lg font-bold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors line-clamp-2 mb-3">
                                        {item.name}
                                    </Link>

                                    <div className="mt-auto pt-4 border-t border-[var(--border-premium)]">
                                        <p className="font-mono text-lg text-[var(--primary)] tracking-tight mb-5">
                                            {formatPrice(item.price)}
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="flex-1 btn-atelier-primary flex items-center justify-center gap-2 py-3 px-4 text-[10px]"
                                            >
                                                <ShoppingCart size={14} />
                                                Eksplorasi
                                            </button>
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="w-12 flex items-center justify-center border border-[var(--border-premium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
                                            >
                                                <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[var(--surface-primary)] rounded-[3rem] p-16 md:p-24 text-center border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] transition-colors relative z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-secondary)]/50 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="w-32 h-32 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-10 border border-[var(--border-soft)] shadow-inner">
                                <Heart size={40} className="text-[var(--text-muted)]" strokeWidth={1.5} />
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-5">Koleksi Impian Masih Kosong</h2>
                            <p className="text-[var(--text-secondary)] font-medium max-w-md mx-auto mb-12 text-lg">
                                Temukan instrumen mahakarya yang resonan dengan jiwa Anda dan simpan di ruang kurasi ini.
                            </p>
                            <Link
                                to="/explore"
                                className="inline-flex items-center gap-3 btn-atelier-primary px-10 py-5"
                            >
                                Eksplorasi Galeri
                                <ShoppingBag size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
