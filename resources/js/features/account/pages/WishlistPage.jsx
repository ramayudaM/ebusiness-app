import React, { useEffect } from 'react';
import { Layout } from '@/shared/components/Layout';
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
        <Layout>
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 selection:bg-orange-500/30">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/explore" className="p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white flex items-center justify-center shadow-md bg-zinc-900/20">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">Wishlist Saya</h1>
                            <span className="bg-orange-950/40 border border-orange-900/30 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {items.length} Favorit
                            </span>
                        </div>
                    </div>
                </div>

                {isLoading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-32">
                        <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-1.5 group overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950 border-b border-zinc-850">
                                    <ImageFallback 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        fallbackType="instrument"
                                    />
                                    <button 
                                        onClick={() => handleRemove(item)}
                                        className="absolute top-3 right-3 p-2 bg-[#050505]/80 hover:bg-[#050505]/95 text-zinc-400 hover:text-red-500 rounded-full shadow-md border border-zinc-800 transition-all transform hover:scale-110"
                                        title="Hapus dari wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <Link to={`/product/${item.id}`} className="text-base font-black text-white hover:text-orange-400 transition-colors line-clamp-2 mb-2 h-12 leading-snug">
                                        {item.name}
                                    </Link>
                                    
                                    <div className="mt-auto">
                                        <p className="text-lg font-black text-orange-500 mb-4 tracking-tight">
                                            {formatPrice(item.price)}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAddToCart(item)}
                                                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(234,88,12,0.15)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                                            >
                                                <ShoppingCart size={14} />
                                                Detail & Beli
                                            </button>
                                            <Link 
                                                to={`/product/${item.id}`}
                                                className="p-2.5 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
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
                    <div className="bg-zinc-900/40 rounded-3xl p-12 md:p-20 text-center border border-zinc-800/80 shadow-2xl backdrop-blur-md">
                        <div className="w-32 h-32 bg-orange-950/20 border border-orange-900/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
                            <Heart size={48} className="text-orange-500 fill-current animate-pulse" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Wishlist-mu Masih Kosong</h2>
                        <p className="text-zinc-400 max-w-md mx-auto mb-10 text-lg font-medium">
                            Simpan instrumen favoritmu di sini agar tidak lupa saat ingin membelinya nanti.
                        </p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-full transition-all shadow-[0_0_25px_rgba(234,88,12,0.3)] hover:-translate-y-1"
                        >
                            Cari Instrumen
                            <ShoppingBag size={20} />
                        </Link>
                    </div>
                )}
            </main>
        </Layout>
    );
};
