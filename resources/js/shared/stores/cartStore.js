import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/shared/utils/api'

/**
 * Cart Store untuk mengelola keranjang belanja.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      // Fetch items from backend
      fetchItems: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          const formattedItems = response.data.map(item => ({
            id: item.product_id,
            cartItemId: item.id,
            name: item.product.name,
            price: item.variation ? (item.variation.price_sen || item.product.price_sen) : item.product.price_sen,
            image: item.product.primary_image_url,
            variation: item.variation,
            quantity: item.quantity,
            isSelected: !!item.is_selected,
            slug: item.product.slug
          }));
          set({ items: [...formattedItems], isLoading: false });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false });
        }
      },

      addItem: async (product, variation, quantity = 1) => {
        try {
          const response = await api.post('/cart', {
            product_id: product.id,
            product_variation_id: variation?.id || null,
            quantity: quantity
          });
          await get().fetchItems();
          return response.data;
        } catch (error) {
          console.error('Failed to add item:', error);
          throw error;
        }
      },

      removeItem: async (cartItemId) => {
        try {
          await api.delete(`/cart/${cartItemId}`);
          set({ items: get().items.filter(item => item.cartItemId !== cartItemId) });
        } catch (error) {
          console.error('Failed to remove item:', error);
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
          await api.put(`/cart/${cartItemId}`, { quantity });
          set({ 
            items: get().items.map(item => 
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ) 
          });
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      },

      toggleSelection: async (cartItemId, isSelected) => {
        try {
          await api.put(`/cart/${cartItemId}`, { is_selected: isSelected });
          set({ 
            items: get().items.map(item => 
              item.cartItemId === cartItemId ? { ...item, isSelected } : item
            ) 
          });
        } catch (error) {
          console.error('Failed to toggle selection:', error);
        }
      },

      toggleAllSelection: async (isSelected) => {
        try {
          await api.post('/cart/toggle-all', { is_selected: isSelected });
          set({ 
            items: get().items.map(item => ({ ...item, isSelected })) 
          });
        } catch (error) {
          console.error('Failed to toggle all selection:', error);
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart');
          set({ items: [] });
        } catch (error) {
          console.error('Failed to clear cart:', error);
        }
      },

      // Getters
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      // Hitung total hanya untuk yang dipilih (isSelected)
      getSelectedTotalItems: () => get().items
        .filter(item => item.isSelected)
        .reduce((sum, item) => sum + item.quantity, 0),

      getSelectedTotalPrice: () => get().items
        .filter(item => item.isSelected)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
