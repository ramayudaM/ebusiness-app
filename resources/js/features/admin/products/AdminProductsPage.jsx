import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminProductService } from './adminProductService'

function formatCurrency(value) {
  const number = Number(value || 0)

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(number)
    .replace('Rp', 'Rp ')
}

function getPrimaryImage(product) {
  const image =
    product.images?.find((item) => item.is_primary) || product.images?.[0]

  if (!image?.url && !image?.image_url) {
    return null
  }

  if (image.image_url) return image.image_url
  if (image.url?.startsWith('http')) return image.url

  return `/storage/${image.url}`
}

function getProductStock(product) {
  if (product.total_stock !== null && product.total_stock !== undefined) {
    return Number(product.total_stock)
  }

  return (
    product.variations?.reduce(
      (total, variation) => total + Number(variation.stock_qty || 0),
      0
    ) || 0
  )
}

function getProductStatus(product) {
  if (!product.is_active) return 'Arsip'

  const stock = getProductStock(product)

  if (stock <= 0) return 'Habis'
  if (stock <= 10) return 'Restock'

  return 'Aktif'
}

function StatusBadge({ status }) {
  const styles = {
    Aktif: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Arsip: 'bg-slate-100 text-slate-600 ring-slate-200',
    Restock: 'bg-amber-50 text-amber-700 ring-amber-100',
    Habis: 'bg-rose-50 text-rose-700 ring-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        styles[status] || styles.Arsip
      }`}
    >
      {status}
    </span>
  )
}

function MiniMetric({ label, value, tone }) {
  const colors = {
    blue: theme.blue,
    green: theme.success,
    amber: theme.warning,
    red: theme.danger,
  }

  return (
    <div className="min-w-[150px]">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: colors[tone] || theme.primary }}
        />
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}

function ProductInitial({ name }) {
  const words = String(name || 'NK')
    .split(' ')
    .filter(Boolean)

  const initial =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`
      : String(name || 'NK').slice(0, 2)

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-black uppercase text-slate-400">
      {initial}
    </div>
  )
}

function ImportResultBox({ result }) {
  if (!result) return null

  const summary = result.summary || {}
  const errors = result.errors || []
  const hasError = Number(summary.failed || 0) > 0 || result.success === false

  return (
    <section
      className={`rounded-[24px] border px-5 py-4 text-sm font-bold ${
        hasError
          ? 'border-amber-100 bg-amber-50 text-amber-800'
          : 'border-emerald-100 bg-emerald-50 text-emerald-700'
      }`}
    >
      <p className="font-black">
        {result.message || 'Import produk selesai.'}
      </p>

      <p className="mt-1 font-semibold">
        Dibuat: {summary.created || 0}, diperbarui: {summary.updated || 0}, gagal:{' '}
        {summary.failed || 0}.
      </p>

      {errors.length > 0 && (
        <div className="mt-3 space-y-1 text-xs font-semibold">
          {errors.slice(0, 5).map((error, index) => (
            <p key={`${error.row}-${index}`}>
              Baris {error.row}: {error.message}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

function ProductRow({ product, onEdit, onDelete }) {
  const stock = getProductStock(product)
  const status = getProductStatus(product)
  const image = getPrimaryImage(product)

  return (
    <tr className="group border-b border-slate-100 transition hover:bg-[#FAFBFC]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProductInitial name={product.name} />
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[420px] truncate text-sm font-black text-slate-950">
              {product.name}
            </p>

            <p className="mt-1 max-w-[460px] truncate text-xs font-medium text-slate-500">
              {product.description || 'Deskripsi produk belum ditambahkan.'}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-800">
          {product.category?.name || '-'}
        </p>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex max-w-[170px] truncate rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
          {product.sku || '-'}
        </span>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-sm font-black text-slate-950">
        {formatCurrency(product.price_sen)}
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor:
                stock <= 0
                  ? theme.danger
                  : stock <= 10
                    ? theme.warning
                    : theme.success,
            }}
          />
          <span className="text-sm font-black text-slate-800">{stock}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            title="Edit produk"
          >
            <AdminIcon name="edit" size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-500 transition hover:bg-rose-50"
            title="Hapus produk"
          >
            <AdminIcon name="trash" size={17} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState(null)

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [selectedImportFile, setSelectedImportFile] = useState(null)

  const fetchCategories = async () => {
    try {
      const response = await adminProductService.getCategories()
      setCategories(response.data.data || [])
    } catch (err) {
      console.error('Gagal mengambil kategori:', err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminProductService.getProducts({
        search,
        category_id: categoryId,
        status,
        page,
        per_page: 10,
      })

      setProducts(response.data.data || [])
      setMeta(response.data.meta || null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Data produk belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
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
  }, [search, categoryId, status, page])

  useEffect(() => {
    setPage(1)
  }, [search, categoryId, status])

  const stats = useMemo(() => {
    const total = meta?.total || products.length
    const active = products.filter((product) => product.is_active).length
    const lowStock = products.filter((product) => {
      const stock = getProductStock(product)
      return stock > 0 && stock <= 10
    }).length
    const emptyStock = products.filter(
      (product) => getProductStock(product) <= 0
    ).length

    return { total, active, lowStock, emptyStock }
  }, [products, meta])

  const handleCreate = () => {
    window.location.href = '/admin/products/create'
  }

  const handleEdit = (product) => {
    window.location.href = `/admin/products/${product.id}/edit`
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}" dari katalog?`
    )

    if (!confirmed) return

    try {
      await adminProductService.deleteProduct(product.id)
      await fetchProducts()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Produk belum dapat dihapus. Coba lagi nanti.'
      )
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await adminProductService.downloadImportTemplate()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', 'template-import-produk-nadakita.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Template import belum dapat diunduh.')
    }
  }

  const handleImportProducts = async () => {
    if (!selectedImportFile) {
      alert('Pilih file CSV atau Excel terlebih dahulu.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedImportFile)

    setImporting(true)
    setImportResult(null)

    try {
      const response = await adminProductService.importProducts(formData)
      setImportResult(response.data)
      setSelectedImportFile(null)
      await fetchProducts()
      alert('Import produk selesai.')
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Import produk gagal. Pastikan format file sesuai template.'

      setImportResult(err.response?.data || null)
      alert(message)
    } finally {
      setImporting(false)
    }
  }

  const canGoPrev = Number(meta?.current_page || 1) > 1
  const canGoNext =
    Number(meta?.current_page || 1) < Number(meta?.last_page || 1)

  return (
    <AdminLayout
      activeMenu="products"
      breadcrumb="Admin / Produk"
      title="Manajemen Produk"
      searchPlaceholder="Cari produk..."
    >
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <div
          className="absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-70 blur-3xl"
          style={{ backgroundColor: theme.primarySoft }}
        />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
              Admin Catalog Workspace
            </div>

            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Kelola produk musik dengan lebih cepat dan rapi.
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Tambahkan produk secara manual, import CSV/Excel, atau gunakan seeder untuk mengisi katalog awal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/explore"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <AdminIcon name="eye" size={18} />
              Preview Customer
            </a>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <AdminIcon name="download" size={18} />
              Template
            </button>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm font-black text-orange-700 shadow-sm transition hover:bg-orange-100">
              <AdminIcon name="upload" size={18} />
              Pilih File
              <input
                type="file"
                accept=".csv,.txt,.xlsx"
                className="hidden"
                onChange={(event) => setSelectedImportFile(event.target.files?.[0] || null)}
              />
            </label>

            <button
              type="button"
              disabled={!selectedImportFile || importing}
              onClick={handleImportProducts}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AdminIcon name="upload" size={18} />
              {importing ? 'Mengimport...' : 'Import Produk'}
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                boxShadow: `0 12px 24px ${theme.primary}30`,
              }}
            >
              <AdminIcon name="plus" size={18} />
              Tambah Produk
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 lg:grid-cols-4">
          <MiniMetric label="Total SKU" value={stats.total} tone="blue" />
          <MiniMetric label="Tayang" value={stats.active} tone="green" />
          <MiniMetric label="Stok Rendah" value={stats.lowStock} tone="amber" />
          <MiniMetric label="Stok Kosong" value={stats.emptyStock} tone="red" />
        </div>
      </section>

      {selectedImportFile && (
        <section className="rounded-[24px] border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-bold text-orange-700">
          File siap diimport: {selectedImportFile.name}
        </section>
      )}

      <ImportResultBox result={importResult} />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <AdminIcon name="search" className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari produk berdasarkan nama, SKU, atau deskripsi..."
              className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 xl:w-[420px]">
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
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
              className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Arsip</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Inventaris Produk
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Pantau stok, harga, dan status produk sebelum ditampilkan ke customer.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {meta?.total || products.length} produk
          </p>
        </div>

        {error && (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
              <p className="mt-4 text-sm font-bold text-slate-500">
                Memuat data produk...
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              <AdminIcon name="product" size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-950">
              Belum ada produk
            </h3>

            <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
              Tambahkan produk manual, import CSV/Excel, atau jalankan seeder produk otomatis.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 rounded-2xl px-5 py-3 text-sm font-black text-white"
              style={{ backgroundColor: theme.primary }}
            >
              Tambah Produk
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Stok
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Halaman {meta?.current_page || page} dari {meta?.last_page || 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!canGoPrev}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <AdminIcon name="chevronLeft" size={17} />
                </button>

                <button
                  className="flex h-10 min-w-10 items-center justify-center rounded-2xl px-4 text-sm font-black text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {meta?.current_page || page}
                </button>

                <button
                  disabled={!canGoNext}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <AdminIcon name="chevronRight" size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  )
}