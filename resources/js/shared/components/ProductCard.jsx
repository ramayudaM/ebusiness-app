import React from 'react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { FALLBACK_PRODUCT } from '@/shared/utils/placeholders';

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
    const hasPromo = product.promo_price_sen !== null;

    const handleAddToCart = () => {
        toast.success(`${product.name} ditambahkan ke keranjang`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full cursor-pointer relative">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img 
                    src={product.primary_image_url || FALLBACK_PRODUCT} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = FALLBACK_PRODUCT }}
                />
                
                {hasPromo && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        PROMO
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 h-10 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-sm leading-none">★</span>
                    <span className="text-xs text-gray-600 font-medium">{product.average_rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-xs text-gray-400">({product.review_count || 0})</span>
                </div>

                <div className="mt-auto">
                    {hasPromo ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-400 line-through leading-none">
                                {formatRupiah(product.price_sen)}
                            </span>
                            <span className="text-base font-bold text-orange-600 leading-none">
                                {formatRupiah(product.promo_price_sen)}
                            </span>
                        </div>
                    ) : (
                        <div className="text-base font-bold text-orange-600">
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
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-orange-600 text-orange-600 py-1.5 px-3 rounded hover:bg-orange-50 transition-colors font-medium text-xs disabled:opacity-50"
                    disabled={!product.is_active}
                >
                    <ShoppingCart size={14} />
                    {product.variations_count > 0 ? "Pilih Variasi" : "+ Keranjang"}
                </button>
            </div>
        </div>
    );
};
