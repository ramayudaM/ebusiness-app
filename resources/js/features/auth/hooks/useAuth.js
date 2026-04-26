import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../lib/api'
import useAuthStore from '../authStore'

/**
 * Custom hook untuk semua operasi authentication.
 * Menggabungkan API call + state management + navigasi.
 */
const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

      // Simpan ke store
      setAuth(user, token)

      // Redirect ke homepage setelah register
      navigate('/')

      return { success: true }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {}
      const message = error.response?.data?.message || 'Terjadi kesalahan. Coba lagi.'

      setErrors(responseErrors)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login dengan email dan password.
   * @param {Object} formData - { email, password, remember }
   * @param {string} redirectTo - URL tujuan setelah login (default: '/')
   */
  const login = async (formData, redirectTo = '/') => {
    setLoading(true)
    setErrors({})

    try {
      const response = await api.post('/auth/login', formData)
      const { user, token } = response.data.data

      // Simpan ke store
      setAuth(user, token)

      // Redirect sesuai role
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate(redirectTo)
      }

      return { success: true }
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {}
      const message = error.response?.data?.message || 'Email atau password salah.'

      setErrors(responseErrors)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout user.
   */
  const logout = async () => {
    setLoading(true)

    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Tetap lanjut logout meskipun API gagal
      console.error('Logout API error:', error)
    } finally {
      clearAuth()
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
