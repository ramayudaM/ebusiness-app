import React, { useState, useEffect } from 'react';
import { FALLBACK_PRODUCT } from '../utils/placeholders';

/**
 * ImageFallback Component
 * 
 * Renders an image. If the original src fails to load, it falls back to 
 * a placeholder image from Unsplash related to musical instruments.
 */
export const ImageFallback = ({ src, alt, className, fallbackType = 'instrument' }) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state when the source URL changes
    useEffect(() => {
        setHasError(false);
    }, [src]);

    const handleError = () => {
        setHasError(true);
    };

    return (
        <img
            src={(!src || hasError) ? FALLBACK_PRODUCT : src}
            alt={alt || 'Product Image'}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
};

export default ImageFallback;
