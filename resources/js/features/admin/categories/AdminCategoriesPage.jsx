import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminCategoryService } from './adminCategoryService'

const initialForm = {
  name: '',
  slug: '',
  parent_id: '',
  sort_order: 0,
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function CategoryModal({
  open,
  mode,
  form,
  setForm,
  categories,
  selectedCategory,
  errors,
  submitting,
  onClose,
  onSubmit,
}) {
  if (!open) return null

  const isEdit = mode === 'edit'

  const fieldError = (name) => errors?.[name]?.[0]

  const handleNameChange = (event) => {
    const name = event.target.value

    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug ? prev.slug : slugify(name),
    }))
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Category Management
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kategori akan digunakan pada form produk dan katalog customer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <AdminIcon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Nama Kategori
            </label>
            <input
              value={form.name}
              onChange={handleNameChange}
              required
              placeholder="Contoh: Gitar Elektrik"
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
              Slug
            </label>
            <input
              value={form.slug}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  slug: slugify(event.target.value),
                }))
              }
              placeholder="gitar-elektrik"
              className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100"
            />
            {fieldError('slug') && (
              <p className="mt-2 text-xs font-bold text-rose-600">
                {fieldError('slug')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Kategori Induk
              </label>
              <select
                value={form.parent_id}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    parent_id: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Tidak ada</option>
                {categories
                  .filter((category) => category.id !== selectedCategory?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Urutan
              </label>
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    sort_order: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border-0 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-800 outline-none ring-0 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold leading-relaxed text-amber-700">
            Hindari menghapus kategori yang sudah digunakan produk. Jika ingin
            merapikan katalog, lebih aman edit nama kategorinya.
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
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
                  : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [form, setForm] = useState(initialForm)

  const fetchCategories = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await adminCategoryService.getCategories({ search })
      setCategories(response.data.data || [])
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Kategori belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCategories()
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  const stats = useMemo(() => {
    const total = categories.length
    const used = categories.filter((category) => Number(category.products_count || 0) > 0).length
    const empty = total - used

    return { total, used, empty }
  }, [categories])

  const openCreateModal = () => {
    setModalMode('create')
    setSelectedCategory(null)
    setForm(initialForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (category) => {
    setModalMode('edit')
    setSelectedCategory(category)
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order || 0,
    })
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedCategory(null)
    setErrors({})
    setForm(initialForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)
    setErrors({})
    setMessage('')

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      parent_id: form.parent_id || null,
      sort_order: Number(form.sort_order || 0),
    }

    try {
      if (modalMode === 'edit' && selectedCategory) {
        await adminCategoryService.updateCategory(selectedCategory.id, payload)
      } else {
        await adminCategoryService.createCategory(payload)
      }

      closeModal()
      await fetchCategories()
    } catch (error) {
      setErrors(error.response?.data?.errors || {})
      setMessage(
        error.response?.data?.message ||
          'Kategori belum dapat disimpan. Periksa kembali data yang diisi.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Hapus kategori "${category.name}" dari database?`
    )

    if (!confirmed) return

    try {
      await adminCategoryService.deleteCategory(category.id)
      await fetchCategories()
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Kategori belum dapat dihapus karena masih digunakan.'
      )
    }
  }

  return (
    <AdminLayout
      activeMenu="categories"
      breadcrumb="Admin / Kategori"
      title="Manajemen Kategori"
      searchPlaceholder="Cari kategori..."
    >
      <CategoryModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        setForm={setForm}
        categories={categories}
        selectedCategory={selectedCategory}
        errors={errors}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Catalog Structure
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Kategori Produk
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Atur kategori yang digunakan untuk mengelompokkan produk pada
              halaman admin dan katalog customer.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
            style={{ backgroundColor: theme.primary }}
          >
            <AdminIcon name="plus" size={18} />
            Tambah Kategori
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Total Kategori
            </p>
            <h3 className="mt-2 text-3xl font-black text-slate-950">
              {stats.total}
            </h3>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Digunakan Produk
            </p>
            <h3 className="mt-2 text-3xl font-black text-slate-950">
              {stats.used}
            </h3>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Belum Dipakai
            </p>
            <h3 className="mt-2 text-3xl font-black text-slate-950">
              {stats.empty}
            </h3>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
          <AdminIcon name="search" className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama kategori atau slug..."
            className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Daftar Kategori
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kategori ini akan muncul pada form produk dan filter katalog.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {categories.length} kategori
          </p>
        </div>

        {message && (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
              <p className="mt-4 text-sm font-bold text-slate-500">
                Memuat kategori...
              </p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              <AdminIcon name="category" size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-950">
              Belum ada kategori
            </h3>

            <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
              Tambahkan kategori pertama untuk mulai mengelompokkan produk.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 rounded-2xl px-5 py-3 text-sm font-black text-white"
              style={{ backgroundColor: theme.primary }}
            >
              Tambah Kategori
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Produk
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Urutan
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black"
                          style={{
                            backgroundColor: theme.primarySoft,
                            color: theme.primary,
                          }}
                        >
                          {category.name?.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-950">
                            {category.name}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            ID: {category.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                        {category.slug}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-black text-slate-800">
                      {category.products_count || 0} produk
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                      {category.sort_order || 0}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          title="Edit kategori"
                        >
                          <AdminIcon name="edit" size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-500 transition hover:bg-rose-50"
                          title="Hapus kategori"
                        >
                          <AdminIcon name="trash" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}