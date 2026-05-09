import { create } from 'zustand'
import api from '@/shared/utils/api'

export const useAddressStore = create((set, get) => ({
    addresses: [],
    isLoading: false,
    provinces: [],
    cities: [],
    isLoadingCities: false,

    fetchAddresses: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/addresses');
            set({ addresses: response.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            set({ isLoading: false });
        }
    },

    fetchProvinces: async () => {
        try {
            const response = await api.get('/provinces');
            set({ provinces: response.data });
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
        }
    },

    fetchCities: async (provinceId) => {
        set({ isLoadingCities: true, cities: [] });
        try {
            const response = await api.get(`/cities/${provinceId}`);
            set({ cities: response.data, isLoadingCities: false });
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            set({ isLoadingCities: false });
        }
    },

    addAddress: async (addressData) => {
        try {
            const response = await api.post('/addresses', addressData);
            set({ addresses: [...get().addresses, response.data.address] });
            return response.data;
        } catch (error) {
            console.error('Failed to add address:', error);
            throw error;
        }
    },

    updateAddress: async (id, addressData) => {
        try {
            const response = await api.put(`/addresses/${id}`, addressData);
            set({
                addresses: get().addresses.map(a => a.id === id ? response.data.address : a)
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update address:', error);
            throw error;
        }
    },

    deleteAddress: async (id) => {
        try {
            await api.delete(`/addresses/${id}`);
            set({ addresses: get().addresses.filter(a => a.id !== id) });
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    }
}));
