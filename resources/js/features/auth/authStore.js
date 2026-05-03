import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth Store menggunakan Zustand dengan persist middleware.
 * Data disimpan di localStorage agar tetap ada setelah page refresh.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token)
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Getters
      isAdmin: () => get().user?.role === 'admin',
      isCustomer: () => get().user?.role === 'customer',
    }),
    {
      name: 'auth-storage', // nama key di localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export { useAuthStore }
export default useAuthStore
