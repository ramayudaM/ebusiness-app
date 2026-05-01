import { useState, useEffect } from 'react';
import { exploreService } from '../exploreService';

export const useProductDetail = (slug) => {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await exploreService.getProductDetails(slug);
                if (data.status === 'success') {
                    setProduct(data.data);
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat detail produk.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    return { product, isLoading, error };
};
