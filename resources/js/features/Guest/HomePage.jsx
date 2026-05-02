import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const categories = [
  { name: 'Gitar', icon: '🎸' },
  { name: 'Keyboard', icon: '🎹' },
  { name: 'Drum', icon: '🥁' },
  { name: 'Biola', icon: '🎻' },
  { name: 'Tiup', icon: '🎺' },
  { name: 'Mic', icon: '🎤' },
  { name: 'Aksesoris', icon: '🎧' },
  { name: 'Suku Cadang', icon: '⚙️' },
]

const flashSaleProducts = [
  {
    id: 1,
    name: 'Gibson J-45 Standard',
    originalPrice: 35000000,
    salePrice: 28450000,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
  },
  {
    id: 2,
    name: 'Korg Minilogue XD',
    originalPrice: 12000000,
    salePrice: 9900000,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
  },
  {
    id: 3,
    name: 'Shure SM7B Vocal Mic',
    originalPrice: 8500000,
    salePrice: 6800000,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
  },
  {
    id: 4,
    name: 'Roland TD-17KVX',
    originalPrice: 22000000,
    salePrice: 18200000,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
  },
]

const newProducts = [
  {
    id: 5,
    name: 'Stradivarius Heritage C1',
    category: 'INSTRUMEN GESEK',
    price: 42000000,
    badge: "EDITOR'S CHOICE",
    image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&q=80',
  },
  {
    id: 6,
    name: 'Fender Reverb Deluxe',
    category: 'AMPLIFIER',
    price: 15600000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 7,
    name: 'Nord Stage 4 88-Key',
    category: 'KEYBOARD',
    price: 64000000,
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
  },
  {
    id: 8,
    name: 'Sennheiser HD 600',
    category: 'MONITORING',
    price: 5200000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
]

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID')
}

function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 2, m: 45, s: 12 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s--
        if (s < 0) {
          s = 59
          m--
        }
        if (m < 0) {
          m = 59
          h--
        }
        if (h < 0) return { h: 0, m: 0, s: 0 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1 text-lg font-bold">
      <span className="bg-gray-900 text-white px-2 py-1 rounded">{pad(time.h)}</span>
      <span>:</span>
      <span className="bg-gray-900 text-white px-2 py-1 rounded">{pad(time.m)}</span>
      <span>:</span>
      <span className="bg-gray-900 text-white px-2 py-1 rounded">{pad(time.s)}</span>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/catalog?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              NadaKita
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-orange-500">
                Beranda
              </Link>
              <Link to="/catalog" className="hover:text-orange-500">
                Eksplorasi
              </Link>
              <Link to="/catalog" className="hover:text-orange-500">
                Koleksi
              </Link>
              <Link to="/catalog" className="hover:text-orange-500">
                Bantuan
              </Link>
            </div>
          </div>
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center border border-gray-200 rounded-full px-4 py-1.5 gap-2 bg-gray-50"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari instrumen atau aksesoris..."
              className="bg-transparent text-sm outline-none w-56"
            />
            <button type="submit" className="text-gray-400">
              🔍
            </button>
          </form>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-700">
              🛒
            </Link>
            <Link
              to="/login"
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-96 md:h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1400&q=80"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Dengar. Beli.
            <br />
            Bermain.
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-8">
            Kurasi instrumen musik pilihan dari maestro untuk inspirasi tanpa batas dalam setiap
            nada yang Anda ciptakan.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full w-fit transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/catalog?category=${cat.name.toLowerCase()}`)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-50 transition-colors group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 group-hover:text-orange-500">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
              FLASH SALE
            </span>
            <FlashSaleTimer />
          </div>
          <Link to="/catalog" className="text-orange-500 text-sm font-medium hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSaleProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/catalog/${p.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 mb-1">{p.name}</p>
                <p className="text-xs text-gray-400 line-through">
                  {formatRupiah(p.originalPrice)}
                </p>
                <p className="text-sm font-bold text-orange-500">{formatRupiah(p.salePrice)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Baru</h2>
          <Link to="/catalog" className="text-orange-500 text-sm font-medium hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/catalog/${p.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-full h-52 object-cover" />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 font-medium mb-1">{p.category}</p>
                <p className="text-sm font-semibold text-gray-800 mb-2">{p.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">{formatRupiah(p.price)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/cart')
                    }}
                    className="bg-gray-100 hover:bg-orange-500 hover:text-white p-2 rounded-full transition-colors text-sm"
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="text-lg font-bold text-gray-900 mb-3">NadaKita</p>
              <p className="text-sm text-gray-500 mb-4">
                Pusat kurasi instrumen musik digital nomor satu di Indonesia. Kami mendukung setiap
                langkah perjalanan musikal Anda.
              </p>
              <div className="flex gap-3">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-orange-100 text-sm">
                  🌐
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-orange-100 text-sm">
                  ↗
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-orange-100 text-sm">
                  ⚙️
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Belanja</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/catalog" className="hover:text-orange-500">
                    Gitar & Bass
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-orange-500">
                    Piano & Keyboard
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-orange-500">
                    Recording & Audio
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-orange-500">
                    Promo Terbatas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Layanan</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Kebijakan Pengembalian
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Lacak Pesanan
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Hubungi Ahli
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Metode Pembayaran</p>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="border border-gray-200 rounded px-3 py-1 text-xs font-bold text-blue-700">
                  VISA
                </span>
                <span className="border border-gray-200 rounded px-3 py-1 text-xs font-bold text-red-600">
                  Mastercard
                </span>
                <span className="border border-gray-200 rounded px-3 py-1 text-xs font-bold text-blue-500">
                  QRIS
                </span>
              </div>
              <p className="text-xs text-gray-400">
                NadaKita telah terverifikasi oleh badan otoritas transaksi digital nasional.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-400">© 2026 NadaKita Tim.</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <Link to="/" className="hover:text-orange-500">
                Syarat & Ketentuan
              </Link>
              <Link to="/" className="hover:text-orange-500">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
