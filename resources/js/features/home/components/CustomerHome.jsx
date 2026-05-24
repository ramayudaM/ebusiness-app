import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/features/auth/authStore';
import { useCartStore } from '@/shared/stores/cartStore';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { Search, Package, Heart, Tag, ArrowRight, Zap, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CategorySkeleton = () => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--surface-secondary)] border border-[var(--border-premium)] animate-pulse mb-4"></div>
        <div className="h-3 w-16 bg-[var(--surface-secondary)] animate-pulse rounded"></div>
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-3xl overflow-hidden flex flex-col h-full relative">
        <div className="relative aspect-[4/3] bg-[var(--surface-secondary)] animate-pulse"></div>
        <div className="p-6 flex flex-col flex-1 h-40">
            <div className="h-4 bg-[var(--surface-secondary)] animate-pulse rounded w-full mb-3"></div>
            <div className="h-4 bg-[var(--surface-secondary)] animate-pulse rounded w-3/4 mb-5"></div>
            <div className="h-3 bg-[var(--surface-secondary)] animate-pulse rounded w-1/4 mb-5"></div>
            <div className="mt-auto h-10 bg-[var(--surface-secondary)] animate-pulse rounded w-full"></div>
        </div>
    </div>
);

export const CustomerHome = ({ categories, newArrivals, isLoading }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Quick stats for functional dashboard feel
    const cartCount = useCartStore(state => state.getTotalItems());
    const wishlistCount = useWishlistStore(state => state.items?.length || 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const FALLBACK_CATEGORY = 'https://images.unsplash.com/photo-1550985543-f47f38aeea53?q=80&w=100&auto=format&fit=crop';

    const customerName = user?.name?.split(' ')[0] || 'Kolektor';

    return (
        <div className="w-full flex-1 pb-24">
            {/* A. COMPACT WELCOME HEADER */}
            <section className="relative pt-32 pb-16 overflow-hidden bg-[var(--surface-primary)] border-b border-[var(--border-premium)]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-brass)]/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="container-page relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="w-full lg:w-1/2">
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mb-4"
                        >
                            Selamat Datang Kembali
                        </motion.p>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6"
                        >
                            Halo, <span className="italic text-[var(--primary)]">{customerName}</span>.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[var(--text-secondary)] font-medium text-lg max-w-md mb-8"
                        >
                            Koleksi eksklusif dan rekomendasi instrumen pilihan telah menanti untuk Anda jelajahi.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <Link to="/explore" className="btn-atelier-primary px-8 py-4 text-xs tracking-widest uppercase">
                                Belanja Sekarang
                            </Link>
                        </motion.div>
                    </div>

                    {/* B. PREMIUM SEARCH AREA */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-1/2 max-w-md ml-auto"
                    >
                        <div className="bg-[var(--bg-primary)] border border-[var(--border-premium)] rounded-[2rem] p-6 md:p-8 shadow-[var(--shadow-subtle)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            <h3 className="font-display font-bold text-xl mb-4 relative z-10">Temukan Mahakarya</h3>
                            
                            <form onSubmit={handleSearch} className="relative z-10">
                                <div className="relative flex items-center bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-full focus-within:border-[var(--primary)] focus-within:shadow-[0_0_20px_var(--glow-warm)] transition-all duration-300 overflow-hidden">
                                    <Search size={16} className="absolute left-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Cari Fender, Yamaha, Gibson..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-24 py-4 bg-transparent border-none text-sm focus:ring-0 placeholder-[var(--text-muted)] text-[var(--text-primary)] font-bold outline-none"
                                    />
                                    <button 
                                        type="submit" 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-6 flex items-center gap-3 relative z-10">
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Cepat:</p>
                                <div className="flex gap-2">
                                    <Link to="/explore?category=gitar-elektrik" className="text-xs bg-[var(--surface-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-full hover:text-[var(--primary)] transition-colors">Gitar</Link>
                                    <Link to="/explore?category=piano-digital" className="text-xs bg-[var(--surface-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-full hover:text-[var(--primary)] transition-colors">Piano</Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* E. FUNCTIONAL SHORTCUTS */}
            <section className="container-page py-12 relative -mt-10 z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/account/orders" className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-subtle)] group">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-primary)] transition-colors">
                            <Package size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Pesanan Saya</p>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5">Lacak Status</p>
                        </div>
                    </Link>
                    
                    <Link to="/account/wishlist" className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-subtle)] group">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-primary)] transition-colors relative">
                            <Heart size={18} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">{wishlistCount}</span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-sm">Wishlist</p>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5">Tersimpan</p>
                        </div>
                    </Link>

                    <Link to="/cart" className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-subtle)] group">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-primary)] transition-colors relative">
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">{cartCount}</span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-sm">Keranjang</p>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5">Belanja</p>
                        </div>
                    </Link>

                    <Link to="/explore" className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent-brass)] border border-transparent rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 shadow-md group">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                            <Zap size={18} fill="currentColor" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white">Gratis Ongkir</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/80 mt-0.5">Kode: GRATISONGKIR</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* C. CATEGORY SHORTCUTS */}
            <section className="container-page py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display font-bold text-2xl">Kategori Pilihan</h2>
                    <Link to="/explore" className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                        Semua Kategori <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                    ) : (
                        categories?.slice(0, 6).map((cat) => (
                            <Link
                                to={`/explore?category=${cat.slug}`}
                                key={cat.id}
                                className="group flex items-center gap-4 p-4 bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl hover:border-[var(--primary)] hover:bg-[var(--surface-secondary)] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-soft)] flex items-center justify-center p-2 text-[var(--primary)] group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    {cat.icon_url ? (
                                        <img
                                            src={cat.icon_url}
                                            alt={cat.name}
                                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                                            onError={(e) => { e.target.src = FALLBACK_CATEGORY }}
                                        />
                                    ) : (
                                        <CategoryIcon name={cat.name} className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="font-bold text-xs truncate group-hover:text-[var(--primary)] transition-colors">{cat.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* D. FEATURED PRODUCTS */}
            <section className="container-page py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="font-display font-bold text-2xl mb-1">Koleksi Terbaru</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Karya mahakarya terkini di atelier kami.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                    </div>
                ) : newArrivals?.length === 0 ? (
                    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] p-16 text-center shadow-sm">
                        <p className="text-[var(--text-secondary)] font-medium">Koleksi sedang dipersiapkan di studio.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {newArrivals?.slice(0, 8).map((product) => (
                            <ProductCard key={`na-${product.id}`} product={product} />
                        ))}
                    </div>
                )}
                
                <div className="mt-12 flex justify-center">
                    <Link to="/explore" className="btn-atelier-secondary px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                        Lihat Semua Koleksi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
