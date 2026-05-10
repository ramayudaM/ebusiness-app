import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProductDetail = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await axios.get(`/api/v1/products/${id}`);
            // Axios automatically throws for 404/500, so if we reach here it is 200 OK.
            // Laravel JsonResource wraps data in 'data' key
            if (response.data && response.data.data) {
                return response.data.data;
            }
            // Fallback if not wrapped
            return response.data;
        },
        enabled: !!id,
        retry: 1,
    });
};
