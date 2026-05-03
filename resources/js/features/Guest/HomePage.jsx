import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../auth/authStore'

const categories = [
  { name: 'Gitar', icon: '🎸', slug: 'gitar' },
  { name: 'Keyboard', icon: '🎹', slug: 'keyboard' },
  { name: 'Drum', icon: '🥁', slug: 'drum' },
  { name: 'Bass', icon: '🎸', slug: 'bass' },
  { name: 'Mic', icon: '🎤', slug: 'mic' },
  { name: 'Audio', icon: '🎧', slug: 'audio' },
]

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID')
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search)}`)
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (email.trim()) {
      alert('Terima kasih! Anda akan menerima update terbaru dari NadaKita.')
      setEmail('')
    }
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
              <span className="text-2xl font-bold text-orange-500">NadaKita</span>
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-orange-500 transition">
                Beranda
              </Link>
              <Link to="/admin/products" className="hover:text-orange-500 transition">
                Produk
              </Link>
              <button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition">
                Tentang
              </button>
              <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition">
                Kontak
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center border border-gray-200 rounded-full px-4 py-1.5 gap-2 bg-gray-50"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari instrumen..."
              className="bg-transparent text-sm outline-none w-48"
              disabled
            />
            <button type="submit" className="text-gray-400 hover:text-orange-500" disabled>
              🔍
            </button>
          </form>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/account/orders" className="text-sm text-gray-700 hover:text-orange-500">
                  Pesanan
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-orange-500">
                  🛒
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="text-sm text-gray-700 hover:text-orange-500">
                  Daftar
                </Link>
                <Link
                  to="/login"
                  className="bg-orange-500 text-white text-sm px-5 py-2 rounded-full hover:bg-orange-600 transition"
                >
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Wujudkan Musik Impianmu
              </h1>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Temukan instrumen musik berkualitas tinggi dari brand ternama dunia. Mulai perjalanan musikmu bersama NadaKita.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/admin/products')}
                  className="bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-orange-50 transition shadow-lg"
                >
                  Jelajahi Produk
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-orange-600 transition"
                >
                  Daftar Sekarang
                </button>
              </div>
              <div className="mt-12 flex gap-8 text-sm">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-orange-100">Produk</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-orange-100">Brand</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-orange-100">Pelanggan</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80" 
                    alt="Musical Instruments" 
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-xl font-bold">Instrumen Berkualitas</p>
                    <p className="text-white/80 text-sm mt-1">Dari Brand Ternama Dunia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Kategori Populer</h2>
          <p className="text-gray-600">Temukan instrumen favorit Anda</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate('/admin/products')}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-500 hover:shadow-lg transition-all group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-500">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Brand Partners */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8 font-semibold">BRAND PARTNER KAMI</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Fender</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Gibson</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Yamaha</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Roland</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Ibanez</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">Marshall</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Kenapa Pilih NadaKita?</h2>
            <p className="text-gray-600">Pengalaman belanja musik terbaik untuk Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Produk Original</h3>
              <p className="text-gray-600">Semua produk dijamin 100% original dari distributor resmi</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gratis Ongkir</h3>
              <p className="text-gray-600">Pengiriman gratis ke seluruh Indonesia untuk pembelian tertentu</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pembayaran Aman</h3>
              <p className="text-gray-600">Berbagai metode pembayaran yang aman dan terpercaya</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Produk Populer</h2>
            <p className="text-gray-600">Instrumen pilihan yang paling banyak dibeli</p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-2"
          >
            Lihat Semua <span>→</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Fender Stratocaster', price: 48500000, category: 'Gitar Elektrik', rating: 4.9, image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500&q=80' },
            { name: 'Roland JUNO-DS88', price: 12900000, category: 'Keyboard', rating: 4.8, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80' },
            { name: 'Yamaha P-125', price: 8500000, category: 'Piano Digital', rating: 4.7, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&q=80' },
            { name: 'Shure SM58', price: 1500000, category: 'Microphone', rating: 4.9, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80' },
          ].map((product, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/admin/products')}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100"
            >
              <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-orange-600 font-bold">{formatRupiah(product.price)}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>⭐</span>
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Apa Kata Mereka?</h2>
          <p className="text-gray-600">Testimoni dari pelanggan setia NadaKita</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "Pelayanan sangat memuaskan! Gitar yang saya beli original dan kualitasnya luar biasa. Pengiriman juga cepat."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ahmad Rizki</p>
                <p className="text-sm text-gray-500">Gitaris</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "Harga kompetitif dan banyak pilihan. Customer service responsif bantu saya pilih keyboard yang tepat."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                S
              </div>
              <div>
                <p className="font-semibold text-gray-900">Siti Nurhaliza</p>
                <p className="text-sm text-gray-500">Pianis</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "Sudah langganan di NadaKita sejak 2 tahun lalu. Selalu puas dengan produk dan layanannya!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                B
              </div>
              <div>
                <p className="font-semibold text-gray-900">Budi Santoso</p>
                <p className="text-sm text-gray-500">Drummer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Siap Memulai Perjalanan Musik Anda?</h2>
          <p className="text-xl text-orange-100 mb-8">Daftar sekarang dan dapatkan diskon 10% untuk pembelian pertama!</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-full hover:bg-orange-50 transition shadow-lg text-lg"
          >
            Daftar Gratis
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Tentang NadaKita</h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                NadaKita adalah platform e-commerce terpercaya untuk instrumen musik di Indonesia. Kami menyediakan berbagai pilihan instrumen berkualitas dari brand ternama dunia.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Dengan pengalaman lebih dari 5 tahun, kami telah melayani ribuan musisi dan pecinta musik di seluruh Indonesia.
              </p>
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition"
              >
                Lihat Produk
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-6 rounded-2xl">
                <p className="text-4xl font-bold text-orange-600 mb-2">500+</p>
                <p className="text-gray-700">Produk Tersedia</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-2xl">
                <p className="text-4xl font-bold text-orange-600 mb-2">50+</p>
                <p className="text-gray-700">Brand Ternama</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-2xl">
                <p className="text-4xl font-bold text-orange-600 mb-2">10K+</p>
                <p className="text-gray-700">Pelanggan Puas</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-2xl">
                <p className="text-4xl font-bold text-orange-600 mb-2">4.9</p>
                <p className="text-gray-700">Rating Toko</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Pertanyaan Umum</h2>
          <p className="text-gray-600">Temukan jawaban untuk pertanyaan Anda</p>
        </div>
        <div className="space-y-4">
          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              Apakah semua produk original?
              <span className="text-orange-500">▼</span>
            </summary>
            <p className="text-gray-600 mt-4">
              Ya, semua produk di NadaKita 100% original dan berasal dari distributor resmi. Kami memberikan garansi resmi untuk setiap produk.
            </p>
          </details>
          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              Bagaimana cara pembayaran?
              <span className="text-orange-500">▼</span>
            </summary>
            <p className="text-gray-600 mt-4">
              Kami menerima berbagai metode pembayaran: Transfer Bank, Kartu Kredit/Debit, E-wallet (GoPay, OVO, Dana), dan QRIS.
            </p>
          </details>
          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              Berapa lama pengiriman?
              <span className="text-orange-500">▼</span>
            </summary>
            <p className="text-gray-600 mt-4">
              Pengiriman dalam kota 1-2 hari kerja, luar kota 3-5 hari kerja. Kami menggunakan jasa ekspedisi terpercaya dengan tracking number.
            </p>
          </details>
          <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              Apakah ada garansi?
              <span className="text-orange-500">▼</span>
            </summary>
            <p className="text-gray-600 mt-4">
              Semua produk dilengkapi dengan garansi resmi dari distributor. Masa garansi bervariasi tergantung brand dan jenis produk.
            </p>
          </details>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-gray-600 mb-8">Berlangganan newsletter kami untuk mendapatkan info promo dan produk terbaru</p>
          <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Anda"
              required
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition"
            >
              Kirim
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#f97316"/>
                  <path d="M15 12 L15 28 M20 10 L20 30 M25 14 L25 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="15" cy="12" r="2" fill="white"/>
                  <circle cx="20" cy="10" r="2" fill="white"/>
                  <circle cx="25" cy="14" r="2" fill="white"/>
                </svg>
                <p className="text-xl font-bold text-white">NadaKita</p>
              </div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Pusat instrumen musik terpercaya di Indonesia. Wujudkan impian musikmu bersama kami.
              </p>
              <div className="flex gap-3">
                <a href="https://instagram.com/nadakita" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full hover:bg-orange-500 transition flex items-center justify-center group">
                  <svg className="w-5 h-5 fill-gray-300 group-hover:fill-white transition" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@nadakita" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full hover:bg-orange-500 transition flex items-center justify-center group">
                  <svg className="w-5 h-5 fill-gray-300 group-hover:fill-white transition" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-4">Belanja</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => navigate('/admin/products')} className="hover:text-orange-500 transition">
                    Gitar & Bass
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/admin/products')} className="hover:text-orange-500 transition">
                    Piano & Keyboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/admin/products')} className="hover:text-orange-500 transition">
                    Drum & Perkusi
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/admin/products')} className="hover:text-orange-500 transition">
                    Semua Produk
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-4">Layanan</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition">
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/account/orders')} className="hover:text-orange-500 transition">
                    Lacak Pesanan
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition">
                    Hubungi Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')} className="hover:text-orange-500 transition">
                    Daftar Akun
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-4">Kontak</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>Jl. Musik Raya No. 123<br/>Jakarta Selatan, 12345</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>info@nadakita.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-2">Metode Pembayaran</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-bold text-blue-400">
                    VISA
                  </span>
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-bold text-red-400">
                    Mastercard
                  </span>
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-bold text-green-400">
                    QRIS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 NadaKita. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">
                Syarat & Ketentuan
              </button>
              <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">
                Kebijakan Privasi
              </button>
              <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">
                Kebijakan Pengembalian
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
