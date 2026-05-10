import axios from 'axios';

export const exploreService = {
    getCategories: async () => {
        const response = await axios.get('/api/v1/categories');
        return response.data;
    },

    getProducts: async (params) => {
        const response = await axios.get('/api/v1/products', { params });
        return response.data;
    },

    getProductDetails: async (slug) => {
        const response = await axios.get(`/api/v1/products/${slug}`);
        return response.data;
    }
};
