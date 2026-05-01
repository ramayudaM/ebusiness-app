import { create } from 'zustand';
import { exploreService } from './exploreService';

const useExploreStore = create((set, get) => ({
    // Data State
    products: [],
    categories: [],
    meta: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    },
    
    // Status State
    isLoadingProducts: false,
    isLoadingCategories: false,
    error: null,

    // Filter State
    filters: {
        search: '',
        category: '',
        min_price: '',
        max_price: '',
        in_stock: false,
        sort_by: 'created_at', // 'created_at', 'price_sen', 'name', 'average_rating'
        sort_order: 'desc', // 'desc' or 'asc'
        page: 1
    },

    // Actions
    setFilter: (key, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
                // Reset page to 1 when filters change (except when changing page itself)
                ...(key !== 'page' ? { page: 1 } : {})
            }
        }));
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters, page: 1 }
        }));
    },

    resetFilters: () => {
        set({
            filters: {
                search: '',
                category: '',
                min_price: '',
                max_price: '',
                in_stock: false,
                sort_by: 'created_at',
                sort_order: 'desc',
                page: 1
            }
        });
    },

    fetchCategories: async () => {
        set({ isLoadingCategories: true, error: null });
        try {
            const data = await exploreService.getCategories();
            if (data.status === 'success') {
                set({ categories: data.data, isLoadingCategories: false });
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Gagal memuat kategori', 
                isLoadingCategories: false 
            });
        }
    },

    fetchProducts: async () => {
        set({ isLoadingProducts: true, error: null });
        try {
            const { filters } = get();
            
            // Clean empty filters before sending
            const params = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== false)
            );

            const data = await exploreService.getProducts(params);
            
            if (data.status === 'success') {
                set({ 
                    products: data.data, 
                    meta: data.meta,
                    isLoadingProducts: false 
                });
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Gagal memuat produk', 
                isLoadingProducts: false 
            });
        }
    }
}));

export default useExploreStore;
