import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/features/auth/authStore';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { Search, ArrowRight, Sparkles, Shield, Truck, Headphones, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const CategorySkeleton = () => (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl p-5 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-[var(--surface-secondary)] mb-3"></div>
        <div className="h-3 w-20 bg-[var(--surface-secondary)] rounded"></div>
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

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const CustomerHome = ({ categories, newArrivals, isLoading }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const FALLBACK_CATEGORY = 'https://images.unsplash.com/photo-1550985543-f47f38aeea53?q=80&w=100&auto=format&fit=crop';
    const customerName = user?.name?.split(' ')[0] || 'Kolektor';

    // Split products for varied display
    const featuredProduct = newArrivals?.[0];
    const restProducts = newArrivals?.slice(1, 9) || [];

    return (
        <div className="w-full flex-1 pb-16">
            {/* A. COMPACT WELCOME HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[var(--surface-primary)] to-[var(--bg-primary)]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[var(--accent-brass)]/5 rounded-full blur-[80px] pointer-events-none"></div>
                {/* Subtle waveform motif */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent"></div>

                <div className="container-page relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                        <div className="w-full lg:w-3/5">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)] mb-4 flex items-center gap-2"
                            >
                                <Sparkles size={12} /> Selamat Datang Kembali
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-5 tracking-tight"
                            >
                                Halo, <span className="italic text-[var(--primary)]">{customerName}</span>.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-[var(--text-secondary)] font-medium text-lg max-w-lg mb-8"
                            >
                                Temukan instrumen berikutnya untuk perjalanan musikmu. Koleksi terkurasi menanti.
                            </motion.p>

                            {/* Search inline */}
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onSubmit={handleSearch}
                                className="max-w-lg"
                            >
                                <div className="relative flex items-center bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-full focus-within:border-[var(--primary)] focus-within:shadow-[0_0_20px_var(--glow-warm)] transition-all duration-300 overflow-hidden shadow-[var(--shadow-subtle)]">
                                    <Search size={16} className="absolute left-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Cari instrumen, brand, atau kategori..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-28 py-4 bg-transparent border-none text-sm focus:ring-0 placeholder-[var(--text-muted)] text-[var(--text-primary)] font-medium outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary)] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-hover)] hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/20"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </motion.form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-5 flex items-center gap-3"
                            >
                                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Populer:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {['Gitar', 'Piano', 'Drum', 'Bass'].map(tag => (
                                        <Link key={tag} to={`/explore?search=${tag.toLowerCase()}`} className="text-[11px] bg-[var(--surface-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-full hover:text-[var(--primary)] hover:border-[var(--primary)]/30 border border-[var(--border-soft)] transition-colors font-medium">
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:flex flex-col items-end gap-4"
                        >
                            <Link to="/explore" className="btn-atelier-primary px-8 py-4 text-xs tracking-widest uppercase flex items-center gap-2 group">
                                Belanja Sekarang <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/help" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--primary)] transition-colors">
                                Butuh Bantuan?
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* B. FEATURED PRODUCT BANNER */}
            {featuredProduct && (
                <motion.section {...fadeInUp} className="container-page py-12">
                    <Link
                        to={`/product/${featuredProduct.id}`}
                        className="block bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] overflow-hidden shadow-[var(--shadow-elevated)] hover:shadow-2xl transition-all duration-500 group relative"
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-[var(--bg-primary)]">
                                <img
                                    src={featuredProduct.primary_image_url}
                                    alt={featuredProduct.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-brass)] text-white text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg uppercase">
                                    Pilihan Editor
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[80px] pointer-events-none"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mb-3 relative z-10">{featuredProduct.category?.name || 'Instrumen'}</p>
                                <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight group-hover:text-[var(--primary)] transition-colors relative z-10 line-clamp-2">
                                    {featuredProduct.name}
                                </h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 line-clamp-2 relative z-10">
                                    {featuredProduct.description || 'Instrumen pilihan dengan kualitas premium untuk perjalanan musik Anda.'}
                                </p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <span className="text-2xl font-black text-[var(--primary)] tracking-tight">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(featuredProduct.promo_price_sen || featuredProduct.price_sen)}
                                    </span>
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 group-hover:text-[var(--primary)] transition-colors">
                                        Lihat Detail <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.section>
            )}

            {/* C. PROMO BANNER */}
            <motion.section {...fadeInUp} className="container-page pb-8">
                <div className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent-brass)] to-[var(--primary)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-[var(--primary)]/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                            <Truck size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">Gratis Ongkir Seluruh Indonesia</p>
                            <p className="text-white/80 text-sm font-medium">Gunakan kode <span className="font-black text-white bg-white/20 px-2 py-0.5 rounded-md">GRATISONGKIR</span> saat checkout</p>
                        </div>
                    </div>
                    <Link to="/explore" className="bg-white text-[var(--primary)] px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-md relative z-10 shrink-0">
                        Belanja Sekarang
                    </Link>
                </div>
            </motion.section>

            {/* D. CATEGORY DISCOVERY */}
            <motion.section {...fadeInUp} className="container-page py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-display font-bold text-2xl tracking-tight">Kategori Pilihan</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Jelajahi berdasarkan jenis instrumen</p>
                    </div>
                    <Link to="/explore" className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                        Semua <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                    ) : (
                        categories?.slice(0, 6).map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <Link
                                    to={`/explore?category=${cat.slug}`}
                                    className="group flex flex-col items-center text-center p-5 bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-2xl hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] hover:-translate-y-1 transition-all duration-300 shadow-[var(--shadow-subtle)]"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-soft)] flex items-center justify-center p-3 text-[var(--primary)] group-hover:scale-110 group-hover:bg-[var(--primary)]/10 transition-all duration-300 mb-3">
                                        {cat.icon_url ? (
                                            <img
                                                src={cat.icon_url}
                                                alt={cat.name}
                                                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                                                onError={(e) => { e.target.src = FALLBACK_CATEGORY }}
                                            />
                                        ) : (
                                            <CategoryIcon name={cat.name} className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors truncate w-full">{cat.name}</span>
                                    {cat.products_count !== undefined && (
                                        <span className="text-[10px] text-[var(--text-muted)] mt-1">{cat.products_count} produk</span>
                                    )}
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.section>

            {/* E. PRODUCTS GRID */}
            <motion.section {...fadeInUp} className="container-page py-12">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="font-display font-bold text-2xl tracking-tight mb-1">Koleksi Terbaru</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Instrumen terkurasi terbaru di atelier kami.</p>
                    </div>
                    <Link to="/explore" className="btn-atelier-secondary px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
                        Lihat Semua <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                    </div>
                ) : restProducts?.length === 0 && !featuredProduct ? (
                    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] p-16 text-center shadow-sm">
                        <Music size={40} className="mx-auto text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-secondary)] font-medium">Koleksi sedang dipersiapkan di studio.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {restProducts?.map((product, index) => (
                            <motion.div
                                key={`na-${product.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>

            {/* F. SERVICE ASSURANCE */}
            <motion.section {...fadeInUp} className="container-page py-12">
                <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] p-8 md:p-12 shadow-[var(--shadow-subtle)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <h3 className="font-display font-bold text-xl text-center mb-8 relative z-10">Mengapa Berbelanja di NadaKita?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {[
                            { icon: Shield, title: 'Transaksi Aman', desc: 'Pembayaran terenkripsi dan terlindungi.' },
                            { icon: Truck, title: 'Pengiriman Terpercaya', desc: 'Pengiriman cepat ke seluruh Indonesia.' },
                            { icon: Headphones, title: 'Dukungan Pelanggan', desc: 'Tim kami siap membantu kapan saja.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-soft)] hover:border-[var(--primary)]/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                                    <item.icon size={20} className="text-[var(--primary)]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1">{item.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* G. CLOSING CTA */}
            <motion.section {...fadeInUp} className="container-page py-12">
                <div className="text-center bg-gradient-to-b from-[var(--surface-primary)] to-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-premium)] p-12 md:p-16 shadow-[var(--shadow-subtle)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[var(--primary)]/3 rounded-full w-96 h-96 blur-[150px] mx-auto pointer-events-none"></div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight relative z-10">
                        Siap Menemukan Suara Anda?
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto relative z-10">
                        Eksplorasi ribuan instrumen dari brand ternama dunia.
                    </p>
                    <Link to="/explore" className="btn-atelier-primary px-10 py-4 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 group relative z-10">
                        Mulai Eksplorasi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};
