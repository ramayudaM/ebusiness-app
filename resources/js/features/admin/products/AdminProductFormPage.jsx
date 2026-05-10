import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminProductService } from './adminProductService'

const initialForm = {
  category_id: '',
  name: '',
  sku: '',
  description: '',
  price_sen: '',
  weight_gram: '',
  stock_qty: '',
  is_active: true,
  image: null,
}

const maxImageSizeMB = 2
const maxImageSize = maxImageSizeMB * 1024 * 1024

function formatCurrencyPreview(value) {
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
    product?.images?.find((item) => item.is_primary) || product?.images?.[0]

  if (!image?.url) return null
  if (image.url.startsWith('http')) return image.url

  return `/storage/${image.url}`
}

function getProductStock(product) {
  if (!product) return 0

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

function Toast({ toast, onClose }) {
  if (!toast) return null

  const styles = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    error: 'border-rose-100 bg-rose-50 text-rose-700',
    info: 'border-slate-200 bg-white text-slate-700',
  }

  const iconName =
    toast.type === 'success' ? 'check' : toast.type === 'error' ? 'alert' : 'bell'

  return (
    <div className="fixed right-6 top-24 z-[80] w-[340px]">
      <div
        className={`rounded-[24px] border p-4 shadow-xl backdrop-blur-xl ${
          styles[toast.type] || styles.info
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/70">
            <AdminIcon name={iconName} size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{toast.title}</p>
            <p className="mt-1 text-xs font-semibold opacity-75">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-current opacity-50 transition hover:opacity-100"
          >
            <AdminIcon name="x" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductFormPage({ mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = mode === 'edit'

  const [form, setForm] = useState(initialForm)
  const [categories, setCategories] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)

  const [imagePreview, setImagePreview] = useState(null)
  const [imageInputKey, setImageInputKey] = useState(Date.now())
  const [imageFit, setImageFit] = useState('cover')
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 })
  const [imageZoom, setImageZoom] = useState(1)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragStartPosition, setDragStartPosition] = useState({ x: 50, y: 50 })

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => String(category.id) === String(form.category_id)
    )
  }, [categories, form.category_id])

  const pageTitle = isEdit ? 'Edit Produk' : 'Tambah Produk'

  const pageDescription = isEdit
    ? 'Perbarui informasi produk yang sudah tersimpan di database.'
    : 'Tambahkan produk baru agar bisa tampil pada katalog customer.'

  const fetchCategories = async () => {
    try {
      const response = await adminProductService.getCategories()
      const data = response.data.data || []

      setCategories(data)

      if (!isEdit && data.length > 0) {
        setForm((prev) => ({
          ...prev,
          category_id: prev.category_id || data[0].id,
        }))
      }
    } catch (error) {
      setMessage('Kategori belum dapat dimuat.')
      setToast({
        type: 'error',
        title: 'Kategori gagal dimuat',
        message: 'Periksa koneksi atau sesi admin kamu.',
      })
    }
  }

  const fetchProduct = async () => {
    if (!isEdit || !id) return

    setLoading(true)

    try {
      const response = await adminProductService.getProduct(id)
      const product = response.data.data

      setCurrentProduct(product)

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

      setImagePreview(getPrimaryImage(product))
      setImageFit('cover')
      setImagePosition({ x: 50, y: 50 })
      setImageZoom(1)
    } catch (error) {
      setMessage('Produk tidak ditemukan atau gagal dimuat.')
      setToast({
        type: 'error',
        title: 'Produk gagal dimuat',
        message: 'Data produk tidak ditemukan atau sesi admin sudah berakhir.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target

    if (type === 'file') {
      const file = files?.[0] || null

      if (!file) return

      const isImage = file.type.startsWith('image/')

      if (!isImage) {
        setToast({
          type: 'error',
          title: 'Format tidak didukung',
          message: 'Gunakan file gambar seperti JPG, PNG, atau WebP.',
        })
        setImageInputKey(Date.now())
        return
      }

      if (file.size > maxImageSize) {
        setToast({
          type: 'error',
          title: 'Gambar terlalu besar',
          message: `Ukuran gambar maksimal ${maxImageSizeMB} MB. Kompres gambar dulu atau pilih file yang lebih kecil.`,
        })
        setImageInputKey(Date.now())
        return
      }

      setForm((prev) => ({
        ...prev,
        image: file,
      }))

      setImagePreview(URL.createObjectURL(file))
      setImageFit('cover')
      setImagePosition({ x: 50, y: 50 })
      setImageZoom(1)

      setToast({
        type: 'success',
        title: 'Gambar berhasil dipilih',
        message: 'Klik dan geser gambar untuk mengatur posisi preview.',
      })

      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
    }))

    setImagePreview(isEdit ? getPrimaryImage(currentProduct) : null)
    setImageInputKey(Date.now())
    setImageFit('cover')
    setImagePosition({ x: 50, y: 50 })
    setImageZoom(1)

    setToast({
      type: 'info',
      title: 'Preview direset',
      message: isEdit
        ? 'Preview kembali menggunakan gambar produk sebelumnya.'
        : 'Gambar produk berhasil dihapus dari preview.',
    })
  }

  const handleClearImageCompletely = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
    }))

    setImagePreview(null)
    setImageInputKey(Date.now())
    setImageFit('cover')
    setImagePosition({ x: 50, y: 50 })
    setImageZoom(1)

    setToast({
      type: 'info',
      title: 'Gambar dihapus',
      message: 'Silakan pilih gambar baru untuk produk ini.',
    })
  }

  const makeFormData = () => {
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

    return formData
  }

  const clamp = (value, min = 0, max = 100) => {
    return Math.min(Math.max(value, min), max)
  }

  const startImageDrag = (event) => {
    if (!imagePreview || imageFit !== 'cover') return

    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const clientY = event.touches ? event.touches[0].clientY : event.clientY

    setIsDraggingImage(true)
    setDragStart({ x: clientX, y: clientY })
    setDragStartPosition(imagePosition)
  }

  const moveImageDrag = (event) => {
    if (!isDraggingImage || !imagePreview || imageFit !== 'cover') return

    if (event.cancelable) {
      event.preventDefault()
    }

    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const clientY = event.touches ? event.touches[0].clientY : event.clientY

    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y

    setImagePosition({
      x: clamp(dragStartPosition.x - deltaX * 0.25),
      y: clamp(dragStartPosition.y - deltaY * 0.25),
    })
  }

  const stopImageDrag = () => {
    setIsDraggingImage(false)
  }

  const resetImagePosition = () => {
    setImagePosition({ x: 50, y: 50 })
    setImageZoom(1)

    setToast({
      type: 'info',
      title: 'Posisi gambar direset',
      message: 'Preview gambar dikembalikan ke posisi tengah.',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)
    setErrors({})
    setMessage('')

    try {
      const payload = makeFormData()

      if (isEdit) {
        await adminProductService.updateProduct(id, payload)
      } else {
        await adminProductService.createProduct(payload)
      }

      navigate('/admin/products')
    } catch (error) {
      const responseErrors = error.response?.data?.errors || {}
      const responseMessage =
        error.response?.data?.message ||
        'Produk belum dapat disimpan. Periksa kembali data yang diisi.'

      setErrors(responseErrors)
      setMessage(responseMessage)

      setToast({
        type: 'error',
        title: 'Produk belum tersimpan',
        message: responseMessage,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !currentProduct) return

    const confirmed = window.confirm(
      `Hapus produk "${currentProduct.name}" dari database?`
    )

    if (!confirmed) return

    try {
      await adminProductService.deleteProduct(currentProduct.id)
      navigate('/admin/products')
    } catch (error) {
      const responseMessage =
        error.response?.data?.message ||
        'Produk belum dapat dihapus karena masih terhubung dengan data lain.'

      setMessage(responseMessage)

      setToast({
        type: 'error',
        title: 'Produk gagal dihapus',
        message: responseMessage,
      })
    }
  }

  const fieldError = (name) => {
    return errors?.[name]?.[0]
  }

  if (loading) {
    return (
      <AdminLayout
        activeMenu="products"
        breadcrumb="Admin / Produk"
        title={pageTitle}
        searchPlaceholder="Cari produk, SKU, kategori..."
      >
        <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat data produk...
            </p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      activeMenu="products"
      breadcrumb={`Admin / Produk / ${isEdit ? 'Edit' : 'Tambah'}`}
      title={pageTitle}
      searchPlaceholder="Cari produk, SKU, kategori..."
    >
      <Toast toast={toast} onClose={() => setToast(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                Product Management
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                {pageTitle}
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                {pageDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: theme.primary }}
              >
                <AdminIcon name="plus" size={18} />
                {submitting
                  ? 'Menyimpan...'
                  : isEdit
                    ? 'Simpan Perubahan'
                    : 'Publikasikan Produk'}
              </button>
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: theme.primarySoft,
                    color: theme.primary,
                  }}
                >
                  <AdminIcon name="product" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Informasi Produk
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Data utama yang akan ditampilkan pada katalog customer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Nama Produk
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Yamaha Acoustic Guitar"
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('name') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('name')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    SKU Produk
                  </label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: NK-GTR-001"
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('sku') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('sku')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Kategori
                  </label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {fieldError('category_id') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('category_id')}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Deskripsi Produk
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tuliskan deskripsi produk, kondisi, fitur, atau informasi penting lainnya..."
                    className="mt-2 w-full resize-none rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-semibold leading-relaxed text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('description') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('description')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: theme.blueSoft,
                    color: theme.blue,
                  }}
                >
                  <AdminIcon name="box" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Harga, Stok, dan Pengiriman
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Informasi operasional untuk transaksi customer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Harga Jual
                  </label>

                  <input
                    name="price_sen"
                    type="number"
                    min="0"
                    value={form.price_sen}
                    onChange={handleChange}
                    required
                    placeholder="2500000"
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('price_sen') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('price_sen')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Stok
                  </label>

                  <input
                    name="stock_qty"
                    type="number"
                    min="0"
                    value={form.stock_qty}
                    onChange={handleChange}
                    required
                    placeholder="20"
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('stock_qty') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('stock_qty')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Berat Gram
                  </label>

                  <input
                    name="weight_gram"
                    type="number"
                    min="1"
                    value={form.weight_gram}
                    onChange={handleChange}
                    required
                    placeholder="1200"
                    className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
                  />

                  {fieldError('weight_gram') && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      {fieldError('weight_gram')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Media Produk
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Atur foto utama produk untuk tampilan katalog customer.
                  </p>
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleClearImageCompletely}
                    className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="mt-5 overflow-hidden rounded-[28px] bg-slate-100">
                {imagePreview ? (
                  <div className="relative h-72 w-full overflow-hidden bg-slate-950">
                    <div
                      onMouseDown={startImageDrag}
                      onMouseMove={moveImageDrag}
                      onMouseUp={stopImageDrag}
                      onMouseLeave={stopImageDrag}
                      onTouchStart={startImageDrag}
                      onTouchMove={moveImageDrag}
                      onTouchEnd={stopImageDrag}
                      className={`relative h-full w-full select-none overflow-hidden ${
                        imageFit === 'cover'
                          ? 'cursor-grab active:cursor-grabbing'
                          : ''
                      }`}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview produk"
                        draggable={false}
                        className="h-full w-full transition duration-200"
                        style={{
                          objectFit: imageFit,
                          objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                          transform: `scale(${imageZoom})`,
                        }}
                      />

                      {imageFit === 'cover' && (
                        <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          Klik dan geser gambar
                        </div>
                      )}
                    </div>

                    <div className="absolute left-4 top-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      Preview
                    </div>
                  </div>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center text-slate-400">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-sm">
                      <AdminIcon name="product" size={30} />
                    </div>
                    <p className="mt-4 text-sm font-black">Belum ada gambar</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Pilih gambar utama produk.
                    </p>
                  </div>
                )}
              </div>

              {imagePreview && (
                <div className="mt-5 space-y-4 rounded-[24px] bg-slate-50 p-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Mode Tampilan
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setImageFit('cover')}
                        className={`rounded-2xl px-3 py-2 text-xs font-black transition ${
                          imageFit === 'cover'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-600'
                        }`}
                      >
                        Crop & Geser
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageFit('contain')}
                        className={`rounded-2xl px-3 py-2 text-xs font-black transition ${
                          imageFit === 'contain'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-600'
                        }`}
                      >
                        Tampilkan Utuh
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={resetImagePosition}
                      className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-100"
                    >
                      Reset Posisi
                    </button>

                    <div className="rounded-2xl bg-white px-3 py-2 text-center text-xs font-black text-slate-500">
                      X {Math.round(imagePosition.x)}% · Y{' '}
                      {Math.round(imagePosition.y)}%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Zoom Preview
                      </label>
                      <span className="text-xs font-black text-slate-500">
                        {imageZoom.toFixed(1)}x
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="1.8"
                      step="0.1"
                      value={imageZoom}
                      onChange={(event) =>
                        setImageZoom(Number(event.target.value))
                      }
                      className="mt-3 w-full accent-orange-600"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-4 text-sm font-black text-orange-700 transition hover:bg-orange-100">
                  <AdminIcon name="plus" size={18} />
                  {imagePreview ? 'Ganti Gambar Produk' : 'Pilih Gambar Produk'}
                  <input
                    key={imageInputKey}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-700">
                  Maksimal upload gambar {maxImageSizeMB} MB. Jika gambar terlalu
                  besar, kompres terlebih dahulu sebelum dipublikasikan.
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    Reset Preview
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-400">
                Gunakan gambar JPG, PNG, atau WebP dengan rasio 1:1 agar tampil
                rapi di katalog. Ukuran file maksimal{' '}
                <span className="font-black text-slate-500">
                  {maxImageSizeMB} MB
                </span>
                .
              </p>

              {fieldError('image') && (
                <p className="mt-2 text-xs font-bold text-rose-600">
                  {fieldError('image')}
                </p>
              )}
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">
                Status Publikasi
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Produk aktif akan tampil pada halaman customer.
              </p>

              <label className="mt-5 flex items-center justify-between rounded-2xl bg-slate-100 p-4">
                <div>
                  <p className="text-sm font-black text-slate-900">
                    Tampilkan di katalog
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {form.is_active
                      ? 'Produk aktif'
                      : 'Produk disimpan sebagai arsip'}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-5 w-5 accent-orange-600"
                />
              </label>
            </div>

            <div
              className="rounded-[32px] p-6 text-white shadow-sm"
              style={{
                background: `linear-gradient(145deg, ${theme.navyDark}, ${theme.navy})`,
              }}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Preview Ringkas
              </p>

              <h3 className="mt-4 text-xl font-black">
                {form.name || 'Nama produk belum diisi'}
              </h3>

              <p className="mt-2 text-sm font-medium text-white/50">
                {selectedCategory?.name || 'Kategori belum dipilih'}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/35">
                    Harga
                  </p>
                  <p className="mt-2 text-sm font-black">
                    {formatCurrencyPreview(form.price_sen)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/35">
                    Stok
                  </p>
                  <p className="mt-2 text-sm font-black">
                    {form.stock_qty || 0} unit
                  </p>
                </div>
              </div>
            </div>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-black text-rose-600 transition hover:bg-rose-100"
              >
                <AdminIcon name="trash" size={18} />
                Hapus Produk
              </button>
            )}
          </aside>
        </section>

        <section className="sticky bottom-4 z-20 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-slate-900">
                {isEdit ? 'Simpan perubahan produk?' : 'Produk siap dipublikasikan?'}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Data akan tersimpan ke database dan digunakan pada halaman customer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: theme.primary }}
              >
                {submitting
                  ? 'Menyimpan...'
                  : isEdit
                    ? 'Simpan Perubahan'
                    : 'Publikasikan Produk'}
              </button>
            </div>
          </div>
        </section>
      </form>
    </AdminLayout>
  )
}