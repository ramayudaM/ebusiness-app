import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingCart, Heart } from 'lucide-react';
import { FALLBACK_PRODUCT } from '@/shared/utils/placeholders';
import { ImageFallback } from '@/shared/components/ImageFallback';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

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

    const hasPromo = product.promo_price_sen !== null && product.promo_price_sen !== undefined;

    const handleAddToCart = () => {
        toast.success(`${product.name} ditambahkan ke keranjang`);
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

    return (
        <div 
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-[#0A0A0A]/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(234,88,12,0.15)] transition-all duration-500 group flex flex-col h-full cursor-pointer relative"
        >
            <div className="relative aspect-[4/3] bg-[#050505] overflow-hidden">
                <ImageFallback 
                    src={product.primary_image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallbackType="instrument,guitar"
                />
                
                {/* Wishlist Button Overlay */}
                <button 
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all duration-300 transform hover:scale-110 z-10 ${
                        isInWishlist 
                            ? 'bg-red-500 text-white' 
                            : 'bg-zinc-900/80 backdrop-blur-sm text-zinc-500 border border-zinc-800 hover:text-red-500 hover:border-red-500/50'
                    }`}
                >
                    <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                </button>
                
                {hasPromo && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        PROMO
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1 relative z-10">
                <h3 className="font-medium text-white text-sm line-clamp-2 h-10 mb-2 group-hover:text-orange-500 transition-colors">
                    {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-sm leading-none">★</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{product.average_rating ? Number(product.average_rating).toFixed(1) : '0.0'}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({product.review_count || 0})</span>
                </div>

                <div className="mt-auto">
                    {hasPromo ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-zinc-500 line-through leading-none">
                                {formatRupiah(product.price_sen)}
                            </span>
                            <span className="text-base font-bold text-orange-500 leading-none">
                                {formatRupiah(product.promo_price_sen)}
                            </span>
                        </div>
                    ) : (
                        <div className="text-base font-bold text-orange-500">
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
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900/50 border border-zinc-700 text-zinc-300 py-2 px-3 rounded-xl hover:text-white hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors font-medium text-xs disabled:opacity-50"
                    disabled={!product.is_active}
                >
                    <ShoppingCart size={14} />
                    {product.variations_count > 0 ? "Pilih Variasi" : "+ Keranjang"}
                </button>
            </div>
        </div>
    );
};
