import React, { useState } from 'react';
import { FALLBACK_PRODUCT } from '../utils/placeholders';

/**
 * ImageFallback Component
 * 
 * Renders an image. If the original src fails to load, it falls back to 
 * a placeholder image from Unsplash related to musical instruments.
 */
export const ImageFallback = ({ src, alt, className, fallbackType = 'instrument' }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            // Prevent infinite loop if fallback also fails
            setHasError(true);
            setImgSrc(FALLBACK_PRODUCT);
        }
    };

    return (
        <img
            src={imgSrc || FALLBACK_PRODUCT}
            alt={alt || 'Product Image'}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
};

export default ImageFallback;
