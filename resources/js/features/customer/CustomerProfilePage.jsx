import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../auth/authStore'
import api from '../../lib/api'

export default function CustomerProfilePage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [promoNotif, setPromoNotif] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({ phone: '', address: '' })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile')
      setProfile(response.data.data)
      setEditData({
        phone: response.data.data.phone || '',
        address: response.data.data.address || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      clearAuth()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      navigate('/login')
    }
  }

  const handleUpdateContact = async () => {
    try {
      await api.put('/user/profile', editData)
      await fetchProfile()
      setShowEditModal(false)
      alert('Kontak berhasil diperbarui!')
    } catch (error) {
      console.error('Update error:', error)
      alert('Gagal memperbarui kontak')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  const getInitials = (name) => {
    if (!name) return 'N'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
              <Link to="/customer/wishlist" className="hover:text-orange-500 transition">
                Wishlist
              </Link>
              <Link to="/customer/profile" className="text-orange-500 font-semibold">
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
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials(profile?.name || user?.name)}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {getInitials(profile?.name || 'Naomi')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:bg-orange-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile?.name || 'Naomi'}</h1>
          <p className="text-gray-500">{profile?.email || 'naomi@email.com'}</p>
        </div>

        {/* Data Diri */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Data Diri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nama Lengkap</p>
              <p className="text-gray-900 font-medium">{profile?.name || 'Naomi'}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Alamat Email</p>
              <p className="text-gray-900 font-medium">{profile?.email || 'naomi@email.com'}</p>
            </div>
          </div>
        </div>

        {/* Kontak & Alamat */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Kontak & Alamat</h2>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-orange-500 text-sm font-semibold hover:text-orange-600"
            >
              Ubah
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nomor Handphone</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium">{profile?.phone || '081234567890'}</p>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">TERVERIFIKASI</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Alamat Utama</p>
              <p className="text-gray-900 font-medium">{profile?.address || 'Jl. Melodi Indah No. 42, Jakarta Selatan, 12345'}</p>
            </div>
          </div>
        </div>

        {/* Keamanan */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Keamanan</h2>
          </div>
          <button
            onClick={() => navigate('/customer/change-password')}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-900 font-medium">Ubah Password</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Notifikasi */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Notifikasi</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Email Notifikasi</p>
                <p className="text-sm text-gray-500">Update pesanan dan akun via email</p>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                className={`relative w-12 h-6 rounded-full transition ${emailNotif ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${emailNotif ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Promo & Penawaran</p>
                <p className="text-sm text-gray-500">Info diskon khusus untuk musik!</p>
              </div>
              <button
                onClick={() => setPromoNotif(!promoNotif)}
                className={`relative w-12 h-6 rounded-full transition ${promoNotif ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${promoNotif ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center gap-2 text-red-600 font-semibold hover:bg-red-50 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar Akun
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">NadaKita v2.0.6-PRO</p>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ubah Kontak & Alamat</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Handphone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="081234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows="3"
                  placeholder="Jl. Melodi Indah No. 42, Jakarta Selatan, 12345"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateContact}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
