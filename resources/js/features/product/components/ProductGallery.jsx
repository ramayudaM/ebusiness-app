import React, { useState } from 'react';
import { ImageFallback } from '@/shared/components/ImageFallback';
import { FALLBACK_HERO } from '@/shared/utils/placeholders';

export const ProductGallery = ({ images, mainImageUrl }) => {
    // Generate thumbnail array.
    // Use images array if it has valid elements. 
    // If not, use mainImageUrl or just a single fallback array.
    let galleryList = [];
    if (images && images.length > 0) {
        galleryList = images.map(img => img.url);
    } else if (mainImageUrl) {
        galleryList = [mainImageUrl];
    } else {
        galleryList = [null]; // This triggers ImageFallback's default behavior
    }

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Main Image */}
            <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
                <ImageFallback
                    src={galleryList[activeIndex]}
                    alt="Main Product"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackType="guitar,instrument"
                />
            </div>

            {/* Thumbnails */}
            {galleryList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {galleryList.map((url, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === index ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <ImageFallback
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                fallbackType="guitar,instrument"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
