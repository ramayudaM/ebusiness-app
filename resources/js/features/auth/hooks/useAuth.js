import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../lib/api'
import useAuthStore from '../authStore'

/**
 * Custom hook untuk seluruh proses authentication customer.
 * Catatan:
 * - Register hanya untuk customer.
 * - Login bisa digunakan oleh customer dan admin.
 * - Jika role admin, user diarahkan ke /admin/dashboard.
 * - Jika role customer, user diarahkan ke halaman customer.
 */
const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const clearCustomerSession = () => {
    clearAuth()
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth-storage')
  }

  const clearAdminSession = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin-auth-storage')
  }

  /**
   * Register customer baru.
   * @param {Object} formData - { name, email, password, password_confirmation }
   */
  const register = async (formData) => {
    setLoading(true)
    setErrors({})

    try {
      const response = await api.post('/auth/register', formData)
      const { user, token } = response.data.data

      // Register hanya untuk customer, jadi bersihkan token admin bila ada.
      clearAdminSession()

      // Simpan auth customer ke Zustand/localStorage.
      setAuth(user, token)

      navigate('/')

      return { success: true }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {}
      const message =
        error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.'

      setErrors(responseErrors)

      return {
        success: false,
        message,
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login customer/admin.
   * @param {Object} formData - { email, password, remember }
   * @param {string} redirectTo - URL tujuan setelah login customer
   */
  const login = async (formData, redirectTo = '/') => {
    setLoading(true)
    setErrors({})

    try {
      const response = await api.post('/auth/login', formData)
      const { user, token } = response.data.data

      if (user.role === 'admin') {
        // Jika admin login lewat /login, bersihkan session customer.
        clearCustomerSession()

        // Simpan token admin.
        localStorage.setItem('admin_token', token)

        // Arahkan ke dashboard admin.
        navigate('/admin/dashboard')

        return { success: true }
      }

      // Jika customer login, bersihkan session admin agar tidak bentrok.
      clearAdminSession()

      // Simpan auth customer.
      setAuth(user, token)

      navigate(redirectTo)

      return { success: true }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {}
      const message =
        error.response?.data?.message || 'Email atau password salah.'

      setErrors(responseErrors)

      return {
        success: false,
        message,
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout customer.
   * Untuk logout admin sebaiknya dibuat terpisah di fitur admin auth.
   */
  const logout = async () => {
    setLoading(true)

    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Tetap logout dari frontend walaupun API gagal.
      console.error('Logout API error:', error)
    } finally {
      clearCustomerSession()
      setLoading(false)
      navigate('/login')
    }
  }

  return {
    register,
    login,
    logout,
    loading,
    errors,
    setErrors,
  }
}

export default useAuth