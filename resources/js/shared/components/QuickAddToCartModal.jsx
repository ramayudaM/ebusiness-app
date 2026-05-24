import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { ImageFallback } from './ImageFallback';

export const QuickAddToCartModal = ({ 
  open, 
  product, 
  onClose, 
  onAddToCart 
}) => {
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Get active variations with stock
  const activeVariations = product?.variations?.filter(
    v => v.is_active && v.stock_qty > 0
  ) || [];

  // Get current selected variation
  const selectedVariation = product?.variations?.find(
    v => v.id === selectedVariationId
  );

  // Get display price
  const displayPrice = selectedVariation?.price_sen ?? product?.price_sen ?? 0;

  // Format price to Rupiah
  const formatRupiah = (price) => {
    if (price === null || price === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Initialize selected variation when modal opens
  useEffect(() => {
    if (open && product) {
      // Auto-select first active variation with stock
      if (activeVariations.length > 0) {
        setSelectedVariationId(activeVariations[0].id);
      } else if (product?.variations?.length > 0) {
        // Fallback: select first variation even if no stock (disabled for submit)
        setSelectedVariationId(product.variations[0].id);
      } else {
        setSelectedVariationId(null);
      }
      setQuantity(1);
    }
  }, [open, product]);

  // Handle quantity change
  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    const maxStock = selectedVariation?.stock_qty || 0;

    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.error(`Maksimal stok untuk variasi ini: ${maxStock} unit`);
      return;
    }

    setQuantity(newQty);
  };

  // Handle add to cart
  const handleSubmit = async () => {
    // Validation
    if (product?.variations?.length > 0 && !selectedVariation) {
      toast.error('Silakan pilih variasi terlebih dahulu');
      return;
    }

    if (selectedVariation && selectedVariation.stock_qty < quantity) {
      toast.error('Stok tidak mencukupi');
      return;
    }

    setIsLoading(true);
    try {
      await onAddToCart(
        product,
        selectedVariation || null,
        quantity
      );
      // Close modal after successful add
      onClose();
    } catch (error) {
      // Error toast already shown by parent
      console.error('Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open || !product) return null;

  const isOutOfStock = activeVariations.length === 0 && 
    (product?.variations?.length > 0);
  const canSubmit = !isLoading && 
    !isOutOfStock && 
    (!product?.variations?.length || selectedVariation) &&
    selectedVariation?.stock_qty > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Pilih Variasi
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <ImageFallback
                src={product.primary_image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                fallbackType="instrument,guitar"
              />
            </div>

            {/* Product Info */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
                {product.name}
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {formatRupiah(displayPrice)}
              </p>
            </div>

            {/* Variations */}
            {product?.variations && product.variations.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-widest">
                  Pilih Variasi
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variation) => {
                    const isActive = variation.is_active && variation.stock_qty > 0;
                    const isSelected = selectedVariationId === variation.id;

                    return (
                      <button
                        key={variation.id}
                        onClick={() => isActive && setSelectedVariationId(variation.id)}
                        disabled={!isActive}
                        className={`
                          px-4 py-2 border rounded-lg text-sm font-medium transition-all
                          ${isSelected
                            ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 ring-1 ring-orange-600'
                            : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                          }
                          ${!isActive ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}
                        `}
                      >
                        {variation.name}
                        {variation.stock_qty === 0 && (
                          <span className="text-xs ml-1">(Stok Habis)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Info */}
            {selectedVariation && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
                Stok tersedia: <span className="font-bold">{selectedVariation.stock_qty}</span> unit
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Kuantitas
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-12 bg-white dark:bg-gray-800">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isLoading || quantity === 1}
                  className="w-10 h-full flex justify-center items-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 h-full flex justify-center items-center font-bold text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-700">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={isLoading || (selectedVariation && quantity >= selectedVariation.stock_qty)}
                  className="w-10 h-full flex justify-center items-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
                ${canSubmit
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart size={16} />
              {isLoading ? 'Menambahkan...' : 'Tambahkan ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
