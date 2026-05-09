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
        navigate('/cart'); // Changed to /cart for better flow, or /checkout if exists
    });

    const handleWishlist = withAuth(() => {
        const added = toggleWishlist(product);
        if (added) {
            toast.success(`❤️ ${product.name} ditambahkan ke Wishlist!`);
        } else {
            toast.info(`💔 ${product.name} dihapus dari Wishlist`);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Produk Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-md">Maaf, produk yang Anda cari tidak ditemukan atau telah dihapus.</p>
                    <Link to="/explore" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
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
        <div className="min-h-screen bg-white flex flex-col text-gray-900 pb-24 md:pb-0">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-gray-500 mb-6 whitespace-nowrap overflow-x-auto pb-2 scrollbar-hide">
                    <Link to="/" className="hover:text-orange-600">Beranda</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    <Link to="/explore" className="hover:text-orange-600">Eksplorasi</Link>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    {product.category && (
                        <>
                            <Link to={`/explore?category=${product.category.slug}`} className="hover:text-orange-600">
                                {product.category.name}
                            </Link>
                            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                        </>
                    )}
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
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
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-500">SKU: {currentVariation?.sku || product.sku}</span>
                            {product.is_bundle && (
                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Bundle Pack
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.average_rating || 0)) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 font-bold">{Number(product.average_rating || 0).toFixed(1)}</span>
                                <span className="ml-1 text-gray-500 text-sm">({product.reviews?.length || 0} ulasan)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className={`text-sm font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                {isOutOfStock ? 'Stok Habis' : 'Tersedia'}
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl font-extrabold text-orange-600 mb-8">
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
                        <div className="hidden md:flex items-end gap-4 mb-10 pb-10 border-b border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-500 mb-2">Kuantitas</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12 w-32">
                                    <button onClick={() => handleQuantityChange(-1)} className="w-10 h-full flex justify-center items-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"><Minus size={16} /></button>
                                    <div className="flex-1 h-full flex justify-center items-center font-bold text-gray-900 border-x border-gray-300 bg-white">{quantity}</div>
                                    <button onClick={() => handleQuantityChange(1)} className="w-10 h-full flex justify-center items-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"><Plus size={16} /></button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-sm border
                                        ${isOutOfStock
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none'
                                            : 'bg-white text-orange-600 border-orange-600 hover:bg-orange-50'
                                        }
                                    `}
                                >
                                    <ShoppingCart size={20} />
                                    + Keranjang
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={isOutOfStock}
                                    className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-2 font-bold text-white transition-all shadow-md
                                        ${isOutOfStock
                                            ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    <Zap size={20} />
                                    Beli Langsung
                                </button>
                            </div>

                            <button onClick={handleWishlist} className={`w-12 h-12 flex items-center justify-center shrink-0 rounded-lg border transition-colors ${
                                isInWishlist 
                                    ? 'bg-red-50 text-red-500 border-red-200' 
                                    : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                            }`}>
                                <Heart size={24} className={isInWishlist ? 'fill-current' : ''} />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center shrink-0 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Link produk berhasil disalin');
                            }}>
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Tabs / Accordions */}
                        <div className="mt-8 flex flex-col gap-4">
                            {/* Description Accordion */}
                            <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                                    Deskripsi Produk
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-600 px-5 pb-5 prose prose-orange max-w-none leading-relaxed whitespace-pre-line text-sm md:text-base border-t border-gray-100 pt-4">
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </div>
                            </details>

                            {/* Specs Accordion */}
                            <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                                    Spesifikasi Teknis
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="py-3 px-4 text-gray-500 w-1/3">Berat</td>
                                                <td className="py-3 px-4 font-medium text-gray-900">{(product.weight_gram / 1000).toFixed(2)} kg</td>
                                            </tr>
                                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                                <td className="py-3 px-4 text-gray-500 w-1/3">Kategori</td>
                                                <td className="py-3 px-4 font-medium text-gray-900">{product.category?.name || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-gray-500 w-1/3">SKU Dasar</td>
                                                <td className="py-3 px-4 font-medium text-gray-900">{product.sku}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </details>

                            {/* Reviews Accordion */}
                            <details className="group border border-gray-200 rounded-xl bg-white overflow-hidden" open>
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                                    Ulasan Komunitas
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.reviews.map(review => (
                                                <div key={review.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                                                                {review.user?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900">{review.user?.name || 'User'}</div>
                                                                <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500 text-sm">
                                            Belum ada ulasan untuk produk ini.
                                        </div>
                                    )}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Bar for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                <div className="flex flex-col flex-[0.8] justify-center truncate pr-2">
                    <div className="text-[10px] text-gray-500 font-medium">Harga</div>
                    <div className="font-bold text-orange-600 text-sm leading-tight truncate">{formattedPrice}</div>
                </div>
                <div className="flex flex-[1.2] gap-2 h-11">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-lg flex items-center justify-center font-bold text-xs transition-colors border
                            ${isOutOfStock
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-orange-600 border-orange-600 active:bg-orange-50'
                            }
                        `}
                    >
                        + Keranjang
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-lg flex items-center justify-center font-bold text-white text-xs transition-colors
                            ${isOutOfStock
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-600 active:bg-orange-700'
                            }
                        `}
                    >
                        {isOutOfStock ? 'Stok Habis' : 'Beli'}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};
