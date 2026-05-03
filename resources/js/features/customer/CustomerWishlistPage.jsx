import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../auth/authStore'
import api from '../../lib/api'

export default function CustomerWishlistPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist')
      setWishlist(response.data.data || [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity: 1 })
      showToastMessage('Produk berhasil ditambahkan ke keranjang belanja.')
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToastMessage('Gagal menambahkan ke keranjang.')
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setWishlist(wishlist.filter(item => item.id !== productId))
      showToastMessage('Produk dihapus dari wishlist.')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#f97316"/>
                <path d="M15 12 L15 28 M20 10 L20 30 M25 14 L25 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="15" cy="12" r="2" fill="white"/>
                <circle cx="20" cy="10" r="2" fill="white"/>
                <circle cx="25" cy="14" r="2" fill="white"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">NadaKita</span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-orange-500 transition">
                Beranda
              </Link>
              <Link to="/customer/orders" className="hover:text-orange-500 transition">
                Pesanan
              </Link>
              <Link to="/customer/wishlist" className="text-orange-500 font-semibold">
                Wishlist
              </Link>
              <Link to="/customer/profile" className="hover:text-orange-500 transition">
                Profil
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-700 hover:text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
              {getInitials(user?.name)}
            </div>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-orange-500 p-4 flex items-center gap-3 max-w-md">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Pindah ke Keranjang</p>
              <p className="text-sm text-gray-600">{toastMessage}</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wishlist</h1>
          <p className="text-gray-600">Daftar instrumen dan perlengkapan musik impian Anda.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wishlist Kosong</h3>
            <p className="text-gray-600 mb-6">Belum ada produk di wishlist Anda</p>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-orange-600 transition"
            >
              Jelajahi Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="relative">
                  <span className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    TERSEDIA
                  </span>
                  <img
                    src={item.image || `https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80`}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">IDR</p>
                  <p className="text-xl font-bold text-gray-900 mb-4">{formatRupiah(item.price)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="flex-1 bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Tambah ke Keranjang
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
