import { create } from 'zustand'
import api from '@/shared/utils/api'

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  
  // ======================
  // FETCH CART
  // ======================
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/cart');

      // 🔥 FIX 1: HARUS AMBIL items
      const data = response.data.items || [];

      const formattedItems = data.map(item => ({
        id: item.product_id,
        cartItemId: item.id,
        name: item.product?.name,
        price: item.variation 
          ? (item.variation.price_sen || item.product?.price_sen) 
          : item.product?.price_sen,
        image: item.product?.primary_image_url,
        variation: item.variation,

        // 🔥 FIX 2: backend = qty, bukan quantity
        quantity: item.qty,

        isSelected: item.is_selected ?? true,
        slug: item.product?.slug
      }));

      set({ items: formattedItems, isLoading: false });

    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
    }
  },

  // ======================
  // ADD ITEM
  // ======================
  addItem: async (product, variation, quantity = 1, options = {}) => {
    try {
      const response = await api.post('/cart', {

        // 🔥 FIX 3: sesuai backend
        product_id: product.id,
        variation_id: variation?.id || null,
        qty: quantity,
        select_only: options.selectOnly || false

      });

      await get().fetchItems();
      return response.data;

    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  },

  // ======================
  // REMOVE ITEM
  // ======================
  removeItem: async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      set({ items: get().items.filter(item => item.cartItemId !== cartItemId) });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },

  // ======================
  // UPDATE QTY
  // ======================
  updateQuantity: async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {

      // 🔥 FIX 4: kirim qty, bukan quantity
      await api.put(`/cart/${cartItemId}`, { qty: quantity });

      set({ 
        items: get().items.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        ) 
      });

    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  },

  // ======================
  // TOGGLE ITEM
  // ======================
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

  // ======================
  // TOGGLE ALL
  // ======================
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

  // ======================
  // CLEAR CART
  // ======================
  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  },

  resetCart: () => set({ items: [] }),

  // ======================
  // TOTAL ITEMS
  // ======================
  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  // ======================
  // SELECTED ITEMS
  // ======================
  getSelectedTotalItems: () => get().items
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + item.quantity, 0),

  getSelectedTotalPrice: () => get().items
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0),
}));
