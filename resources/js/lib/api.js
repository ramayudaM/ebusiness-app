import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/v1',      // Relative URL — tidak perlu VITE_API_URL karena monolith
  withCredentials: true,   // Wajib untuk Sanctum cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Interceptor request: tambahkan CSRF token dari meta tag
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken
  }
  const token = localStorage.getItem('nadakita_token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// Interceptor response: handle 401 Unauthorized → redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('nadakita_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
