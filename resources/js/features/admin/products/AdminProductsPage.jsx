import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import SectionHeader from '../components/SectionHeader'
import AdminIcon from '../components/AdminIcon'
import { adminProductService } from './adminProductService'
import { adminTheme as theme } from '../styles/adminTheme'

function formatCurrency(value) {
  const number = Number(value || 0)

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number)
}

function getPrimaryImage(product) {
  const image = product.images?.find((item) => item.is_primary) || product.images?.[0]

  if (!image?.url) {
    return 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=NadaKita'
  }

  if (image.url.startsWith('http')) {
    return image.url
  }

  return `/storage/${image.url}`
}

function getProductStock(product) {
  if (product.total_stock !== null && product.total_stock !== undefined) {
    return Number(product.total_stock)
  }

  return product.variations?.reduce((total, item) => total + Number(item.stock_qty || 0), 0) || 0
}

function getProductStatus(product) {
  if (!product.is_active) return 'Nonaktif'

  const stock = getProductStock(product)

  if (stock <= 0) return 'Habis'
  if (stock <= 10) return 'Stok Rendah'

  return 'Aktif'
}

function StatusBadge({ status }) {
  const style = {
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Nonaktif: 'bg-slate-50 text-slate-600 border-slate-200',
    'Stok Rendah': 'bg-amber-50 text-amber-700 border-amber-100',
    Habis: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Nonaktif
      }`}
    >
      {status}
    </span>
  )
}

function ProductModal({
  open,
  mode,
  product,
  categories,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    sku: '',
    description: '',
    price_sen: '',
    weight_gram: '',
    stock_qty: '',
    is_active: true,
    image: null,
  })

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && product) {
      setForm({
        category_id: product.category_id || '',
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price_sen: product.price_sen || '',
        weight_gram: product.weight_gram || '',
        stock_qty: getProductStock(product),
        is_active: Boolean(product.is_active),
        image: null,
      })
    } else {
      setForm({
        category_id: categories[0]?.id || '',
        name: '',
        sku: '',
        description: '',
        price_sen: '',
        weight_gram: '',
        stock_qty: '',
        is_active: true,
        image: null,
      })
    }
  }, [open, mode, product, categories])

  if (!open) return null

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target

    if (type === 'file') {
      setForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('category_id', form.category_id)
    formData.append('name', form.name)
    formData.append('sku', form.sku)
    formData.append('description', form.description || '')
    formData.append('price_sen', form.price_sen)
    formData.append('weight_gram', form.weight_gram)
    formData.append('stock_qty', form.stock_qty)
    formData.append('is_active', form.is_active ? '1' : '0')

    if (form.image) {
      formData.append('image', form.image)
    }

    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div
          className="flex items-center justify-between px-6 py-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${theme.navy}, ${theme.dark} 55%, ${theme.primaryDark})`,
          }}
        >
          <div>
            <h2 className="text-xl font-bold">
              {mode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Lengkapi data produk agar tampil di katalog customer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/15"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Nama Produk
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Yamaha Acoustic Guitar"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                SKU Produk
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                placeholder="Contoh: NK-GTR-001"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Kategori
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Harga
              </label>
              <input
                name="price_sen"
                type="number"
                value={form.price_sen}
                onChange={handleChange}
                required
                min="0"
                placeholder="Contoh: 2500000"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Berat Gram
              </label>
              <input
                name="weight_gram"
                type="number"
                value={form.weight_gram}
                onChange={handleChange}
                required
                min="1"
                placeholder="Contoh: 1200"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Stok
              </label>
              <input
                name="stock_qty"
                type="number"
                value={form.stock_qty}
                onChange={handleChange}
                required
                min="0"
                placeholder="Contoh: 20"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Gambar Produk
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-orange-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Deskripsi Produk
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan deskripsi produk..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <label className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Status Produk Aktif</p>
                <p className="mt-1 text-xs text-slate-500">
                  Jika aktif, produk akan tampil di katalog customer.
                </p>
              </div>

              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
                className="h-5 w-5 accent-orange-600"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: theme.primary }}
            >
              {submitting
                ? 'Menyimpan...'
                : mode === 'edit'
                  ? 'Simpan Perubahan'
                  : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState(null)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminProductService.getProducts({
        search,
        category_id: categoryId,
        status,
        per_page: 10,
      })

      setProducts(response.data.data || [])
      setMeta(response.data.meta || null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal mengambil data produk. Pastikan admin sudah login.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await adminProductService.getCategories()
      setCategories(response.data.data || [])
    } catch (err) {
      console.error('Gagal mengambil kategori:', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts()
    }, 350)

    return () => clearTimeout(delay)
  }, [search, categoryId, status])

  const stats = useMemo(() => {
    const total = meta?.total || products.length
    const active = products.filter((item) => item.is_active).length
    const lowStock = products.filter((item) => {
      const stock = getProductStock(item)
      return stock > 0 && stock <= 10
    }).length
    const emptyStock = products.filter((item) => getProductStock(item) <= 0).length

    return { total, active, lowStock, emptyStock }
  }, [products, meta])

  const priorityProducts = useMemo(() => {
    return products.filter((product) => {
      const status = getProductStatus(product)
      return status === 'Stok Rendah' || status === 'Habis' || status === 'Nonaktif'
    })
  }, [products])

  const categorySummary = useMemo(() => {
    return categories.map((category) => {
      const count = products.filter((product) => product.category_id === category.id).length

      return {
        ...category,
        count,
      }
    })
  }, [categories, products])

  const openCreateModal = () => {
    setSelectedProduct(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setModalMode('edit')
    setModalOpen(true)
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)

    try {
      if (modalMode === 'edit' && selectedProduct) {
        await adminProductService.updateProduct(selectedProduct.id, formData)
      } else {
        await adminProductService.createProduct(formData)
      }

      setModalOpen(false)
      setSelectedProduct(null)
      await fetchProducts()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Gagal menyimpan produk. Periksa kembali data yang diisi.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus produk "${product.name}"?`
    )

    if (!confirmed) return

    try {
      await adminProductService.deleteProduct(product.id)
      await fetchProducts()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Gagal menghapus produk. Produk mungkin masih terhubung dengan data pesanan.'
      )
    }
  }

  return (
    <AdminLayout
      activeMenu="products"
      breadcrumb="Admin Panel / Products"
      title="Manajemen Produk"
      searchPlaceholder="Cari produk, kategori, stok..."
    >
      <ProductModal
        open={modalOpen}
        mode={modalMode}
        product={selectedProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-sm md:p-7"
        style={{
          background: `linear-gradient(135deg, ${theme.navy}, ${theme.dark} 55%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/75">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Produk terhubung database
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Kelola produk asli yang tampil di halaman customer.
            </h2>

            <p className="mt-3 max-w-2xl leading-relaxed text-white/65">
              Tambah, edit, hapus, dan pantau stok produk langsung dari database
              agar katalog customer selalu sinkron.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:bg-orange-50"
            style={{ color: theme.primary }}
          >
            <AdminIcon name="plus" />
            Tambah Produk
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Produk"
          value={stats.total}
          note="Data dari database"
          icon="box"
          color={theme.blue}
        />

        <StatCard
          title="Produk Aktif"
          value={stats.active}
          note="Tampil di katalog"
          icon="product"
          color={theme.success}
        />

        <StatCard
          title="Stok Rendah"
          value={stats.lowStock}
          note="Perlu restock"
          icon="alert"
          color={theme.warning}
        />

        <StatCard
          title="Produk Habis"
          value={stats.emptyStock}
          note="Tidak tersedia"
          icon="alert"
          color={theme.danger}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.55fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Daftar Produk"
            description="Data produk ini diambil langsung dari database."
            action={
              <button
                onClick={openCreateModal}
                className="hidden items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition md:inline-flex"
                style={{ backgroundColor: theme.primary }}
              >
                <AdminIcon name="plus" size={18} />
                Tambah Produk
              </button>
            }
          />

          <div className="mb-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_180px_160px]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-slate-400">
                <AdminIcon name="search" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama produk atau SKU..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-10 text-center text-sm font-medium text-slate-500">
              Memuat data produk...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-10 text-center">
              <p className="text-sm font-semibold text-slate-800">
                Belum ada produk yang ditemukan.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Tambahkan produk baru agar tampil di katalog customer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Produk
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Kategori
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Harga
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stok
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const status = getProductStatus(product)

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                              <img
                                src={getPrimaryImage(product)}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-950">
                                {product.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-sm text-slate-700">
                          {product.category?.name || '-'}
                        </td>

                        <td className="py-4 text-sm font-semibold text-slate-950">
                          {formatCurrency(product.price_sen)}
                        </td>

                        <td className="py-4 text-sm text-slate-700">
                          {getProductStock(product)} unit
                        </td>

                        <td className="py-4">
                          <StatusBadge status={status} />
                        </td>

                        <td className="py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                              title="Edit produk"
                            >
                              <AdminIcon name="edit" size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(product)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                              title="Hapus produk"
                            >
                              <AdminIcon name="trash" size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Produk Prioritas"
              description="Produk yang perlu segera dicek."
            />

            <div className="space-y-4">
              {priorityProducts.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Tidak ada produk prioritas saat ini.
                </p>
              ) : (
                priorityProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white">
                        <img
                          src={getPrimaryImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Stok {getProductStock(product)} unit
                        </p>
                        <div className="mt-3">
                          <StatusBadge status={getProductStatus(product)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Kategori Produk"
              description="Ringkasan kategori dari database."
            />

            <div className="space-y-4">
              {categorySummary.slice(0, 5).map((category) => (
                <div key={category.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{category.name}</span>
                    <span className="font-semibold text-slate-950">
                      {category.count} produk
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(category.count * 20, 100)}%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Catatan Admin"
              description="Checklist pengelolaan produk."
            />

            <div className="space-y-3">
              {[
                'Cek produk dengan stok rendah',
                'Pastikan gambar produk sudah sesuai',
                'Update produk yang tidak aktif',
              ].map((task) => (
                <label
                  key={task}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <input type="checkbox" className="mt-1 accent-orange-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {task}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}