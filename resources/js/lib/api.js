import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // PENTING: untuk Sanctum cookie-based auth
})

// Request interceptor: otomatis tambahkan Bearer token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: tangani error 401 secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token tidak valid atau expired, hapus data auth
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth-storage')
      // Redirect ke halaman login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
