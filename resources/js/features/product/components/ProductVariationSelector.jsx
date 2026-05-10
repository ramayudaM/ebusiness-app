import React from 'react';

export const ProductVariationSelector = ({ variations, selectedVariationId, onChange }) => {
    if (!variations || variations.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Pilihan Variasi</h3>
            <div className="flex flex-wrap gap-2">
                {variations.map((v) => {
                    const isSelected = selectedVariationId === v.id;
                    const isOutOfStock = v.stock_qty <= 0;

                    return (
                        <button
                            key={v.id}
                            onClick={() => !isOutOfStock && onChange(v.id)}
                            disabled={isOutOfStock}
                            className={`
                                px-4 py-2 border rounded-md text-sm font-medium transition-all
                                ${isSelected
                                    ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }
                                ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                            `}
                        >
                            {v.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
