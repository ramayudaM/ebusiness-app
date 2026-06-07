import React from 'react';

export const ProductVariationSelector = ({ variations, selectedVariationId, onChange }) => {
    if (!variations || variations.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Pilihan Variasi</h3>
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
                                px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-300
                                ${isSelected
                                    ? 'border-orange-500 bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.15)]'
                                    : 'border-zinc-800 bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:text-white'
                                }
                                ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-zinc-950/20 text-zinc-650 border-zinc-900' : ''}
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
