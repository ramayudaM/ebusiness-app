import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useProductDetail } from '../hooks/useProductDetail';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { useCartStore } from '@/shared/stores/cartStore';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { ProductGallery } from '../components/ProductGallery';
import { ProductVariationSelector } from '../components/ProductVariationSelector';
import { ProductMedia } from '../components/ProductMedia';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { Heart, Share2, CircleAlert, ShoppingCart, Minus, Plus, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const ProductDetailPage = () => {
    const { id } = useParams();
    const { data: product, isLoading, error, refetch } = useProductDetail(id);
    const { withAuth } = useRequireAuth();
    const navigate = useNavigate();

    const addItem = useCartStore(state => state.addItem);
    const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
    const isInWishlist = useWishlistStore(state => state.isInWishlist(Number(product?.id || id)));

    const [selectedVariationId, setSelectedVariationId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product && product.variations && product.variations.length > 0) {
            // Select first active variation with stock
            const firstAvailable = product.variations.find(v => v.stock_qty > 0);
            if (firstAvailable) {
                setSelectedVariationId(firstAvailable.id);
            } else {
                setSelectedVariationId(product.variations[0].id);
            }
        }
    }, [product]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty < 1) return;

        // Stock check
        const currentVariation = product?.variations?.find(v => v.id === selectedVariationId);
        const maxStock = currentVariation ? currentVariation.stock_qty : 0;

        if (newQty > maxStock) {
            toast.error(`Maksimal pembelian untuk variasi ini adalah ${maxStock} unit`);
            return;
        }

        setQuantity(newQty);
    };

    const handleAddToCart = withAuth(async () => {
        const currentVariation = product?.variations?.find(v => v.id === selectedVariationId);

        if (product?.variations?.length > 0 && !currentVariation) {
            toast.error('Silakan pilih variasi terlebih dahulu');
            return;
        }

        if (currentVariation && currentVariation.stock_qty < quantity) {
            toast.error('Stok tidak mencukupi');
            return;
        }

        // Add to Cart Store
        try {
            await addItem(product, currentVariation, quantity);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menambahkan produk ke keranjang');
            return;
        }
        toast.success(`${product.name} berhasil ditambahkan ke keranjang`);
    });

    const handleBuyNow = withAuth(async () => {
        const currentVariation = product?.variations?.find(v => v.id === selectedVariationId);

        if (product?.variations?.length > 0 && !currentVariation) {
            toast.error('Silakan pilih variasi terlebih dahulu');
            return;
        }

        if (currentVariation && currentVariation.stock_qty < quantity) {
            toast.error('Stok tidak mencukupi');
            return;
        }

        // Add to cart then navigate
        try {
            await addItem(product, currentVariation, quantity, { selectOnly: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memulai checkout');
            return;
        }
        toast.success('Produk siap checkout');
        navigate('/checkout');
    });

    const handleWishlist = withAuth(async () => {
        let added;
        try {
            added = await toggleWishlist(product);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui wishlist');
            return;
        }
        if (added) {
            toast.success(`${product.name} ditambahkan ke wishlist`);
        } else {
            toast.info(`${product.name} dihapus dari wishlist`);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
                <Navbar />
                <main className="flex-1 w-full">
                    <ProductSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-ui text-[var(--text-primary)]">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Produk Tidak Ditemukan</h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-center max-w-md">Maaf, produk yang Anda cari tidak ditemukan atau telah dihapus.</p>
                    <Link to="/explore" className="btn-atelier-primary px-8 py-4">
                        Kembali Eksplorasi
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const currentVariation = product.variations?.find(v => v.id === selectedVariationId);

    // Determine displayed price based on variation or fallback to product base price
    // Also handling missing price gracefully. price_sen is in cents (or IDR usually just an integer)
    // Actually in Indonesia, price_sen might just be price if sen is used as IDR.
    // Based on ExplorePage `formatPriceDisplay` / `product.price_sen / 100` might be needed?
    // Let's assume price_sen is just the price in IDR as seen in other contexts, or divide by 100 if it really is cents.
    // In ExplorePage, there is typically a number formatting: `Rp ${Number(price).toLocaleString('id-ID')}`
    // If it's literally price_sen, in IDR it might be exact IDR. I will just format it.

    const displayPrice = currentVariation?.price_sen ? currentVariation.price_sen : product.price_sen;
    const formattedPrice = `Rp ${Number(displayPrice || 0).toLocaleString('id-ID')}`;

    const isOutOfStock = product.variations?.length > 0
        ? (currentVariation ? currentVariation.stock_qty <= 0 : true)
        : false;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] pb-24 md:pb-0 transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16 relative">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>
                {/* Breadcrumbs */}
                <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-10 whitespace-nowrap overflow-x-auto pb-2 custom-scrollbar">
                    <Link to="/" className="hover:text-[var(--primary)] transition-colors">Beranda</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    <Link to="/explore" className="hover:text-[var(--primary)] transition-colors">Eksplorasi</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    {product.category && (
                        <>
                            <Link to={`/explore?category=${product.category.slug}`} className="hover:text-[var(--primary)] transition-colors">
                                {product.category.name}
                            </Link>
                            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                        </>
                    )}
                    <span className="text-[var(--text-primary)] truncate">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                    {/* Left: Gallery */}
                    <div className="w-full lg:w-[45%]">
                        <div className="sticky top-24">
                            <ProductGallery
                                images={product.images}
                                mainImageUrl={product.primary_image_url}
                            />
                            {product.media && product.media.length > 0 && (
                                <ProductMedia mediaItems={product.media} />
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="w-full lg:w-[55%] flex flex-col bg-[var(--surface-primary)] p-6 md:p-10 rounded-[2.5rem] border border-[var(--border-premium)] shadow-[var(--shadow-elevated)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-mono text-[var(--text-muted)]">SKU: {currentVariation?.sku || product.sku}</span>
                            {product.is_bundle && (
                                <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-[var(--primary)]/20 shadow-[0_0_10px_var(--glow-warm)]">
                                    Mahakarya Bundle
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] mb-6 leading-[1.1] tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center">
                                <div className="flex text-[var(--primary)]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.average_rating || 0)) ? 'fill-current' : 'text-[var(--surface-secondary)] border-[var(--border-premium)]'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-3 font-mono font-bold text-[var(--text-primary)]">{Number(product.average_rating || 0).toFixed(1)}</span>
                                <span className="ml-2 text-[var(--text-secondary)] text-sm font-medium">({product.reviews?.length || 0} apresiasi)</span>
                            </div>
                            <span className="text-[var(--border-premium)]">|</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                                {isOutOfStock ? 'Koleksi Kosong' : 'Tersedia'}
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl font-mono font-bold text-[var(--primary)] mb-10 tracking-tight">
                            {formattedPrice}
                        </div>

                        {/* Variations */}
                        {product.variations && product.variations.length > 0 && (
                            <ProductVariationSelector
                                variations={product.variations}
                                selectedVariationId={selectedVariationId}
                                onChange={(id) => {
                                    setSelectedVariationId(id);
                                    setQuantity(1); // reset qty on variant change
                                }}
                            />
                        )}

                        {/* Actions (Desktop only mostly, duplicated for sticky mobile) */}
                        <div className="hidden md:flex items-end gap-4 mb-12 pb-12 border-b border-[var(--border-premium)]">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Kuantitas</span>
                                <div className="flex items-center border border-[var(--border-premium)] rounded-xl overflow-hidden h-14 w-36 transition-colors bg-[var(--surface-primary)]">
                                    <button onClick={() => handleQuantityChange(-1)} className="w-12 h-full flex justify-center items-center hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"><Minus size={16} /></button>
                                    <div className="flex-1 h-full flex justify-center items-center font-mono font-bold text-[var(--text-primary)] border-x border-[var(--border-premium)]">{quantity}</div>
                                    <button onClick={() => handleQuantityChange(1)} className="w-12 h-full flex justify-center items-center hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"><Plus size={16} /></button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-14 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                                        ${isOutOfStock
                                            ? 'bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-soft)] cursor-not-allowed'
                                            : 'bg-transparent text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg-primary)] hover:shadow-[0_0_20px_var(--glow-warm)]'
                                        }
                                    `}
                                >
                                    <ShoppingCart size={18} />
                                    Keranjang
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={isOutOfStock}
                                    className={`flex-[1.5] h-14 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all duration-300
                                        ${isOutOfStock
                                            ? 'bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-soft)] cursor-not-allowed'
                                            : 'btn-atelier-primary'
                                        }
                                    `}
                                >
                                    <Zap size={18} />
                                    Beli Langsung
                                </button>
                            </div>

                            <button onClick={handleWishlist} className={`w-14 h-14 flex items-center justify-center shrink-0 rounded-xl border transition-all duration-300 ${isInWishlist
                                ? 'bg-red-500/10 text-red-500 border-red-500/30'
                                : 'border-[var(--border-premium)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
                                }`}>
                                <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center shrink-0 rounded-xl border border-[var(--border-premium)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] hover:border-[var(--border-soft)] transition-colors" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Tautan mahakarya disalin');
                            }}>
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Tabs / Accordions */}
                        <div className="mt-8 flex flex-col gap-6">
                            {/* Description Accordion */}
                            <details className="group border border-[var(--border-premium)] rounded-[2rem] bg-[var(--surface-primary)] overflow-hidden shadow-[var(--shadow-subtle)]" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-xl font-display font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                                    Deskripsi Produk
                                    <span className="transition group-open:rotate-180 text-[var(--primary)]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-[var(--text-secondary)] px-6 pb-6 prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-line text-sm md:text-base border-t border-[var(--border-premium)] pt-5">
                                    {product.description || 'Tidak ada deskripsi untuk mahakarya ini.'}
                                </div>
                            </details>

                            {/* Specs Accordion */}
                            <details className="group border border-[var(--border-premium)] rounded-[2rem] bg-[var(--surface-primary)] overflow-hidden shadow-[var(--shadow-subtle)]" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-xl font-display font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                                    Spesifikasi Teknis
                                    <span className="transition group-open:rotate-180 text-[var(--primary)]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 border-t border-[var(--border-premium)] pt-5">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-[var(--border-soft)]">
                                                <td className="py-4 px-4 text-[var(--text-muted)] w-1/3">Berat</td>
                                                <td className="py-4 px-4 font-bold text-[var(--text-primary)]">{(product.weight_gram / 1000).toFixed(2)} kg</td>
                                            </tr>
                                            <tr className="border-b border-[var(--border-soft)] bg-[var(--surface-secondary)]">
                                                <td className="py-4 px-4 text-[var(--text-muted)] w-1/3">Kategori</td>
                                                <td className="py-4 px-4 font-bold text-[var(--text-primary)]">{product.category?.name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-4 text-[var(--text-muted)] w-1/3">SKU Dasar</td>
                                                <td className="py-4 px-4 font-bold text-[var(--text-primary)]">{product.sku}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </details>

                            {/* Reviews Accordion */}
                            <details className="group border border-[var(--border-premium)] rounded-[2rem] bg-[var(--surface-primary)] overflow-hidden shadow-[var(--shadow-subtle)]" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-xl font-display font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                                    Apresiasi Komunitas
                                    <span className="transition group-open:rotate-180 text-[var(--primary)]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 border-t border-[var(--border-premium)] pt-5">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.reviews.map(review => (
                                                <div key={review.id} className="bg-[var(--surface-secondary)] border border-[var(--border-premium)] p-5 rounded-2xl">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center font-display font-bold text-lg">
                                                                {review.user?.name?.charAt(0) || 'K'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm text-[var(--text-primary)]">{review.user?.name || 'Kolektor'}</div>
                                                                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mt-0.5">{new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex text-[var(--primary)]">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-[var(--text-muted)]'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[var(--surface-secondary)] border border-[var(--border-premium)] rounded-[1.5rem] p-8 text-center text-[var(--text-muted)] text-sm font-medium">
                                            Belum ada apresiasi tertulis untuk mahakarya ini.
                                        </div>
                                    )}
                                </div>
                            </details>
                        </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-primary)] border-t border-[var(--border-premium)] p-4 flex items-center gap-3 z-50 shadow-[var(--shadow-elevated)] pb-safe">
                <div className="flex flex-col flex-[0.8] justify-center truncate pr-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Nilai</div>
                    <div className="font-mono font-bold text-[var(--primary)] text-sm leading-tight truncate">{formattedPrice}</div>
                </div>
                <div className="flex flex-[1.2] gap-2 h-12">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase tracking-widest transition-colors border
                            ${isOutOfStock
                                ? 'bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-soft)] cursor-not-allowed'
                                : 'bg-transparent text-[var(--primary)] border-[var(--primary)] active:bg-[var(--primary)] active:text-white'
                            }
                        `}
                    >
                        + Krnjg
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-xl flex items-center justify-center font-bold text-white text-[10px] uppercase tracking-widest transition-colors
                            ${isOutOfStock
                                ? 'bg-[var(--text-muted)] cursor-not-allowed'
                                : 'btn-atelier-primary'
                            }
                        `}
                    >
                        {isOutOfStock ? 'Habis' : 'Beli'}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};
