import { create } from 'zustand'
import api from '@/shared/utils/api'

/**
 * Notification Store untuk mengelola notifikasi user.
 */
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  isLoading: false,
  
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notifications');
      const formatted = response.data.map(n => ({
        id: n.id,
        title: n.data.title,
        message: n.data.message,
        type: n.data.type,
        read: n.read_at !== null,
        time: n.created_at,
      }));
      set({ notifications: [...formatted], isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      const currentNotifications = get().notifications;
      const updated = currentNotifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      set({ notifications: updated });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/read-all');
      const updated = get().notifications.map(n => ({ ...n, read: true }));
      set({ notifications: updated });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  deleteNotification: async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      // Pastikan filter menghasilkan array baru untuk men-trigger re-render
      const filtered = get().notifications.filter(n => n.id !== id);
      set({ notifications: [...filtered] });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },

  clearAllNotifications: async () => {
    try {
      await api.delete('/notifications/clear-all');
      set({ notifications: [] });
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  },

  resetNotifications: () => set({ notifications: [] }),

  // Getters
  getUnreadCount: () => get().notifications.filter(n => !n.read).length,
}));
