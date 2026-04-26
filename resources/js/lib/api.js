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
  const adminToken = localStorage.getItem('admin_token')
  const authToken = localStorage.getItem('auth_token')
  
  if (window.location.pathname.startsWith('/admin')) {
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`
  } else {
    if (authToken) config.headers.Authorization = `Bearer ${authToken}`
  }
  
  return config
})

// Response interceptor: tangani error 401 secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin-auth-storage')
        window.location.href = '/admin/login'
      } else {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
