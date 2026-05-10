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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/explore" className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Wishlist Saya</h1>
                    <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                        {items.length} Favorit
                    </span>
                </div>

                {isLoading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-800">
                                    <ImageFallback 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        fallbackType="instrument"
                                    />
                                    <button 
                                        onClick={() => handleRemove(item)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-400 hover:text-red-600 rounded-full shadow-sm transition-all transform hover:scale-110"
                                        title="Hapus dari wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <Link to={`/product/${item.id}`} className="text-base font-bold text-gray-900 dark:text-white hover:text-orange-600 transition-colors line-clamp-2 mb-2 h-12">
                                        {item.name}
                                    </Link>
                                    
                                    <div className="mt-auto">
                                        <p className="text-lg font-black text-orange-600 mb-4">
                                            {formatPrice(item.price)}
                                        </p>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAddToCart(item)}
                                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                                            >
                                                <ShoppingCart size={14} />
                                                Detail & Beli
                                            </button>
                                            <Link 
                                                to={`/product/${item.id}`}
                                                className="p-2.5 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 md:p-20 text-center border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <div className="w-32 h-32 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Heart size={48} className="text-red-500 fill-current" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Wishlist-mu Masih Kosong</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg">
                            Simpan instrumen favoritmu di sini agar tidak lupa saat ingin membelinya nanti.
                        </p>
                        <Link 
                            to="/explore" 
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-4 rounded-full transition-all shadow-xl shadow-orange-100 dark:shadow-none hover:-translate-y-1"
                        >
                            Cari Instrumen
                            <ShoppingBag size={20} />
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
