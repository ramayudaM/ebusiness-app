import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingCart, Heart } from 'lucide-react';
import { FALLBACK_PRODUCT } from '@/shared/utils/placeholders';
import { ImageFallback } from '@/shared/components/ImageFallback';
import { QuickAddToCartModal } from '@/shared/components/QuickAddToCartModal';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { useCartStore } from '@/shared/stores/cartStore';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import {
    getCartActionType,
    getFirstActiveVariation,
    isProductOutOfStock
} from '@/shared/utils/productHelpers';
import api from '@/shared/utils/api';

export const formatRupiah = (price) => {
    if (price === null || price === undefined) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { withAuth } = useRequireAuth();
    const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
    const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));
    const addItem = useCartStore(state => state.addItem);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [productDetail, setProductDetail] = useState(null);

    const hasPromo = product.promo_price_sen !== null && product.promo_price_sen !== undefined;

    /**
     * Fetch product detail jika data list hanya punya variations_count
     */
    const fetchProductDetail = async () => {
        try {
            setIsLoadingDetail(true);
            const response = await api.get(`/products/${product.id}`);
            const detail = response.data.data;
            setProductDetail(detail);
            return detail;
        } catch (error) {
            console.error('Failed to fetch product detail:', error);
            toast.error('Gagal memuat detail produk');
            throw error;
        } finally {
            setIsLoadingDetail(false);
        }
    };

    /**
     * Handle add to cart dengan logika yang sesuai
     */
    const handleAddToCart = withAuth(async () => {
        // Determine product data yang akan digunakan
        let productForAction = product;

        // Jika product hanya punya variations_count (dari Home/list), fetch detail terlebih dahulu
        if (!product.variations && product.variations_count > 0) {
            try {
                productForAction = await fetchProductDetail();
            } catch (error) {
                return;
            }
        }

        // Determine action type
        const actionType = getCartActionType(productForAction);

        switch (actionType) {
            case 'disabled':
                toast.error('Stok produk habis');
                break;

            case 'direct-add':
                // Produk tanpa variasi: langsung add qty 1
                try {
                    await addItem(productForAction, null, 1);
                    toast.success(`${productForAction.name} berhasil ditambahkan ke keranjang`);
                } catch (error) {
                    toast.error(
                        error.response?.data?.message ||
                        'Gagal menambahkan produk ke keranjang'
                    );
                }
                break;

            case 'direct-add-one-variant':
                // Hanya 1 variasi aktif: langsung add dengan variasi itu
                try {
                    const variant = getFirstActiveVariation(productForAction);
                    await addItem(productForAction, variant, 1);
                    toast.success(`${productForAction.name} berhasil ditambahkan ke keranjang`);
                } catch (error) {
                    toast.error(
                        error.response?.data?.message ||
                        'Gagal menambahkan produk ke keranjang'
                    );
                }
                break;

            case 'open-modal':
                // Lebih dari 1 variasi: buka modal
                setProductDetail(productForAction);
                setIsModalOpen(true);
                break;

            default:
                break;
        }
    });

    /**
     * Handle add to cart dari modal
     */
    const handleAddToCartFromModal = async (produk, variation, qty) => {
        try {
            await addItem(produk, variation, qty);
            toast.success(`${produk.name} berhasil ditambahkan ke keranjang`);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Gagal menambahkan produk ke keranjang'
            );
            throw error; // Re-throw agar modal tetap buka
        }
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        e.preventDefault();
        withAuth(async () => {
            try {
                const added = await toggleWishlist(product);
                if (added) {
                    toast.success(`❤️ ${product.name} ditambahkan ke wishlist`);
                } else {
                    toast.info(`💔 ${product.name} dihapus dari wishlist`);
                }
            } catch (error) {
                toast.error('Gagal memperbarui wishlist');
            }
        })();
    };

    // Determine button state
    const actionType = getCartActionType(product);
    const isDisabled = isLoadingDetail || actionType === 'disabled';
    const buttonLabel = actionType === 'disabled'
        ? 'Stok Habis'
        : (product.variations_count > 0 && actionType !== 'direct-add' ? 'Pilih Variasi' : '+ Keranjang');

    return (
        <>
            <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[1.5rem] overflow-hidden shadow-[var(--shadow-subtle)] hover:shadow-2xl hover:border-[var(--primary)]/50 transition-all duration-500 group flex flex-col h-full cursor-pointer relative"
            >
                <div className="relative aspect-[4/3] bg-[var(--bg-primary)] overflow-hidden">
                    <ImageFallback
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fallbackType="instrument,guitar"
                    />

                    {/* Wishlist Button Overlay */}
                    <button
                        onClick={handleWishlist}
                        className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-10 backdrop-blur-md border ${isInWishlist
                            ? 'bg-red-500/90 border-red-400 text-white shadow-red-500/20'
                            : 'bg-[var(--surface-primary)]/80 border-[var(--border-soft)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/30'
                            }`}
                    >
                        <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                    </button>

                    {hasPromo && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[var(--primary)] to-orange-500 text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30">
                            PENAWARAN
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1 relative">
                    <h3 className="font-display font-bold text-[var(--text-primary)] text-sm md:text-base line-clamp-2 h-12 mb-3 group-hover:text-[var(--primary)] transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="text-[var(--primary)] text-sm leading-none drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]">★</span>
                        <span className="text-xs text-[var(--text-primary)] font-bold">{product.average_rating ? Number(product.average_rating).toFixed(1) : '0.0'}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">({product.review_count || 0} ulasan)</span>
                    </div>

                    <div className="mt-auto">
                        {hasPromo ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[var(--text-muted)] font-bold line-through tracking-wider">
                                    {formatRupiah(product.price_sen)}
                                </span>
                                <span className="text-lg font-black text-[var(--primary)] tracking-tight">
                                    {formatRupiah(product.promo_price_sen)}
                                </span>
                            </div>
                        ) : (
                            <div className="text-lg font-black text-[var(--text-primary)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                {formatRupiah(product.price_sen)}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToCart();
                        }}
                        className={`mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${isDisabled
                            ? 'bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-soft)] cursor-not-allowed'
                            : 'bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg-primary)] hover:shadow-lg hover:shadow-[var(--primary)]/20'
                            }`}
                        disabled={isDisabled}
                    >
                        <ShoppingCart size={14} />
                        {isLoadingDetail ? 'Memuat...' : buttonLabel}
                    </button>
                </div>
            </div>

            {/* Quick Add Modal */}
            <QuickAddToCartModal
                open={isModalOpen}
                product={productDetail}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCartFromModal}
            />
        </>
    );
};
