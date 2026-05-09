import { create } from 'zustand'
import api from '@/shared/utils/api'

/**
 * Wishlist Store untuk mengelola produk favorit.
 */
export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/wishlist');
      const formattedItems = response.data.map(item => ({
        id: item.product.id,
        wishlistId: item.id,
        name: item.product.name,
        price: item.product.price_sen,
        image: item.product.primary_image_url,
        slug: item.product.slug
      }));
      set({ items: formattedItems, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({ isLoading: false });
    }
  },
  
  toggleWishlist: async (product) => {
    try {
      const response = await api.post('/wishlist/toggle', {
        product_id: product.id
      });
      
      if (response.data.status === 'added') {
        set({ 
          items: [
            ...get().items, 
            { 
              id: product.id,
              wishlistId: response.data.item.id,
              name: product.name,
              price: product.price_sen,
              image: product.primary_image_url,
              slug: product.slug
            }
          ] 
        });
        return true; // added
      } else {
        set({ items: get().items.filter(item => item.id !== product.id) });
        return false; // removed
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      throw error;
    }
  },

  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
