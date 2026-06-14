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
    const isInWishlist = useWishlistStore(state => state.isInWishlist(Number(id)));

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

    // Force scroll to top on component load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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

    const handleAddToCart = withAuth(() => {
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
        addItem(product, currentVariation, quantity);
        toast.success(`✅ ${product.name} berhasil ditambahkan ke keranjang!`);
    });

    const handleBuyNow = withAuth(() => {
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
        addItem(product, currentVariation, quantity);
        toast.success(`✅ Mengarahkan ke pembayaran...`);
        navigate('/cart');
    });

    const handleWishlist = withAuth(async () => {
        try {
            const added = await toggleWishlist(product);

            if (added) {
                toast.success(`❤️ ${product.name} ditambahkan ke Wishlist!`);
            } else {
                toast.info(`💔 ${product.name} dihapus dari Wishlist`);
            }
        } catch (error) {
            toast.error('Gagal memperbarui wishlist');
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col text-white relative z-0">
                <Navbar />
                <main className="flex-1 w-full py-10">
                    <ProductSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col text-white relative z-0">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-white">Produk Tidak Ditemukan</h2>
                    <p className="text-zinc-400 mb-6 text-center max-w-md">Maaf, produk yang Anda cari tidak ditemukan atau telah dihapus.</p>
                    <Link to="/explore" className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                        Kembali Eksplorasi
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const currentVariation = product.variations?.find(v => v.id === selectedVariationId);
    const displayPrice = currentVariation?.price_sen ? currentVariation.price_sen : product.price_sen;
    const formattedPrice = `Rp ${Number(displayPrice || 0).toLocaleString('id-ID')}`;
    const selectedStock = currentVariation ? Number(currentVariation.stock_qty || 0) : 0;
    const totalStock = product.variations?.reduce((total, variation) => total + Number(variation.stock_qty || 0), 0) || 0;

    const isOutOfStock = product.variations?.length > 0
        ? (currentVariation ? currentVariation.stock_qty <= 0 : true)
        : false;

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col text-white transition-colors duration-300 relative z-0 overflow-x-hidden selection:bg-orange-500/30 pb-24 md:pb-0">
            
            {/* Global Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[15%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-orange-600/5 blur-[150px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-orange-700/5 blur-[150px] mix-blend-screen"></div>
            </div>

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 md:py-12 z-10 relative">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-zinc-500 mb-8 whitespace-nowrap overflow-x-auto pb-2 scrollbar-hide">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Beranda</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    <Link to="/explore" className="hover:text-orange-500 transition-colors">Eksplorasi</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    {product.category && (
                        <>
                            <Link to={`/explore?category=${product.category.slug}`} className="hover:text-orange-500 transition-colors">
                                {product.category.name}
                            </Link>
                            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                        </>
                    )}
                    <span className="text-white font-medium truncate">{product.name}</span>
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
                    <div className="w-full lg:w-[55%] flex flex-col">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500">SKU: {currentVariation?.sku || product.sku}</span>
                            {product.is_bundle && (
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Bundle Pack
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4.5xl font-black text-white mb-4 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.average_rating || 0)) ? 'fill-current' : 'text-zinc-800'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 font-bold text-white">{Number(product.average_rating || 0).toFixed(1)}</span>
                                <span className="ml-1 text-zinc-550 text-sm">({product.reviews?.length || 0} ulasan)</span>
                            </div>
                            <span className="text-zinc-850">|</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isOutOfStock 
                                ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                                : 'text-green-500 bg-green-500/10 border-green-500/20'}`}>
                                {isOutOfStock ? 'Stok Habis' : 'Tersedia'}
                            </span>
                        </div>

                        <div className="text-3xl md:text-4.5xl font-black text-orange-500 mb-8 tracking-tight">
                            {formattedPrice}
                        </div>

                        {/* Variations */}
                        {product.variations && product.variations.length > 0 && (
                            <div className="mb-6">
                                <ProductVariationSelector
                                    variations={product.variations}
                                    selectedVariationId={selectedVariationId}
                                    onChange={(id) => {
                                        setSelectedVariationId(id);
                                        setQuantity(1); // reset qty on variant change
                                    }}
                                />

                                {currentVariation && (
                                    <div className={`mt-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
                                        selectedStock > 0
                                            ? 'border-green-500/20 bg-green-500/10 text-green-400'
                                            : 'border-red-500/20 bg-red-500/10 text-red-400'
                                    }`}>
                                        Stok variasi {currentVariation.name}: {selectedStock} unit
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions (Desktop only mostly, duplicated for sticky mobile) */}
                        <div className="hidden md:flex items-end gap-4 mb-10 pb-10 border-b border-zinc-900">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Kuantitas</span>
                                <div className="flex items-center border border-zinc-800 bg-[#0A0A0A] rounded-xl overflow-hidden h-12 w-32 transition-colors">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)} 
                                        className="w-10 h-full flex justify-center items-center bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <div className="flex-1 h-full flex justify-center items-center font-bold text-white border-x border-zinc-800 bg-[#0A0A0A] select-none">
                                        {quantity}
                                    </div>
                                    <button 
                                        onClick={() => handleQuantityChange(1)} 
                                        className="w-10 h-full flex justify-center items-center bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 border
                                        ${isOutOfStock
                                            ? 'bg-zinc-900/50 text-zinc-600 border-zinc-950 cursor-not-allowed'
                                            : 'bg-[#0A0A0A] text-orange-500 border-zinc-800 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-400'
                                        }
                                    `}
                                >
                                    <ShoppingCart size={18} />
                                    + Keranjang
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02]
                                        ${isOutOfStock
                                            ? 'bg-zinc-800/80 cursor-not-allowed shadow-none'
                                            : 'bg-orange-600 hover:bg-orange-500'
                                        }
                                    `}
                                >
                                    <Zap size={18} />
                                    Beli Langsung
                                </button>
                            </div>

                            <button 
                                onClick={handleWishlist} 
                                className={`w-12 h-12 flex items-center justify-center shrink-0 rounded-xl border transition-all duration-300 ${
                                    isInWishlist 
                                        ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                                        : 'border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500'
                                }`}
                            >
                                <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                            </button>
                            
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link produk berhasil disalin');
                                }}
                                className="w-12 h-12 flex items-center justify-center shrink-0 rounded-xl border border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>

                        {/* Tabs / Accordions */}
                        <div className="mt-4 flex flex-col gap-4">
                            {/* Description Accordion */}
                            <details className="group border border-zinc-800/80 rounded-2xl bg-[#0A0A0A]/30 overflow-hidden transition-all hover:border-zinc-700/80" open>
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-base text-white hover:bg-zinc-900/30 transition-colors">
                                    Deskripsi Produk
                                    <span className="transition group-open:rotate-180 text-zinc-500 group-hover:text-white">
                                        <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-zinc-400 px-5 pb-5 prose prose-orange max-w-none leading-relaxed whitespace-pre-line text-sm md:text-base border-t border-zinc-900/80 pt-4">
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </div>
                            </details>

                            {/* Specs Accordion */}
                            <details className="group border border-zinc-800/80 rounded-2xl bg-[#0A0A0A]/30 overflow-hidden transition-all hover:border-zinc-700/80" open>
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-base text-white hover:bg-zinc-900/30 transition-colors">
                                    Spesifikasi Teknis
                                    <span className="transition group-open:rotate-180 text-zinc-500 group-hover:text-white">
                                        <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 border-t border-zinc-900/80 pt-4">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-zinc-900">
                                                <td className="py-3 px-4 text-zinc-500 w-1/3">Berat</td>
                                                <td className="py-3 px-4 font-semibold text-white">{(product.weight_gram / 1000).toFixed(2)} kg</td>
                                            </tr>
                                            <tr className="border-b border-zinc-900 bg-zinc-950/20">
                                                <td className="py-3 px-4 text-zinc-500 w-1/3">Kategori</td>
                                                <td className="py-3 px-4 font-semibold text-white">{product.category?.name || '-'}</td>
                                            </tr>
                                            {product.variations && product.variations.length > 0 && (
                                                <tr className="border-b border-zinc-900">
                                                    <td className="py-3 px-4 text-zinc-500 w-1/3">Stok Variasi</td>
                                                    <td className="py-3 px-4 font-semibold text-white">
                                                        {currentVariation ? `${currentVariation.name}: ${selectedStock} unit` : `${totalStock} unit`}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="py-3 px-4 text-zinc-500 w-1/3">SKU Dasar</td>
                                                <td className="py-3 px-4 font-semibold text-white">{product.sku}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </details>

                            {/* Reviews Accordion */}
                            <details className="group border border-zinc-800/80 rounded-2xl bg-[#0A0A0A]/30 overflow-hidden transition-all hover:border-zinc-700/80" open>
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-base text-white hover:bg-zinc-900/30 transition-colors">
                                    Ulasan Komunitas
                                    <span className="transition group-open:rotate-180 text-zinc-500 group-hover:text-white">
                                        <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 border-t border-zinc-900/80 pt-4">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.reviews.map(review => (
                                                <div key={review.id} className="bg-[#0A0A0A] border border-zinc-900 p-5 rounded-2xl">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center font-bold">
                                                                {review.user?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm text-white">{review.user?.name || 'User'}</div>
                                                                <div className="text-xs text-zinc-500">{new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-zinc-800'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[#0A0A0A]/35 border border-zinc-900/80 rounded-2xl p-6 text-center text-zinc-550 text-sm">
                                            Belum ada ulasan untuk produk ini.
                                        </div>
                                    )}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Sticky Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/95 border-t border-zinc-900 p-4 flex items-center gap-3 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-safe backdrop-blur-md">
                <div className="flex flex-col flex-[0.8] justify-center truncate pr-2">
                    <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Harga</div>
                    <div className="font-black text-orange-500 text-base leading-tight truncate">{formattedPrice}</div>
                </div>
                <div className="flex flex-[1.2] gap-2 h-11">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-xl flex items-center justify-center font-bold text-xs transition-colors border
                            ${isOutOfStock
                                ? 'bg-zinc-900/50 text-zinc-650 border-zinc-950 cursor-not-allowed'
                                : 'bg-[#0A0A0A] text-orange-500 border-zinc-800 active:bg-zinc-900'
                            }
                        `}
                    >
                        + Keranjang
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-xl flex items-center justify-center font-bold text-white text-xs transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)]
                            ${isOutOfStock
                                ? 'bg-zinc-850 cursor-not-allowed shadow-none text-zinc-600'
                                : 'bg-orange-600 active:bg-orange-700'
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
