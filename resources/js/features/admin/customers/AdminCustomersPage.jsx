import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminCustomerService } from './adminCustomerService'

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

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getProfile(customer) {
  return customer.customer_profile || customer.customerProfile || {}
}

function getCustomerCity(customer) {
  const profile = getProfile(customer)

  return (
    profile.city ||
    profile.address_city ||
    profile.kota ||
    customer.shipping_city ||
    'Kota belum diisi'
  )
}

function getCustomerPhone(customer) {
  const profile = getProfile(customer)

  return (
    profile.phone ||
    profile.phone_number ||
    profile.no_hp ||
    '-'
  )
}

function CustomerStatusBadge({ customer }) {
  const inactive = Boolean(customer.deleted_at)

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        inactive
          ? 'bg-rose-50 text-rose-700 ring-rose-100'
          : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      }`}
    >
      {inactive ? 'Nonaktif' : 'Aktif'}
    </span>
  )
}

function MiniMetric({ label, value, tone }) {
  const colors = {
    orange: theme.primary,
    green: theme.success,
    blue: theme.blue,
    red: theme.danger,
  }

  return (
    <div>
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

function CustomerRow({
  customer,
  onView,
  onDeactivate,
  onRestore,
  updatingId,
}) {
  const inactive = Boolean(customer.deleted_at)
  const ordersCount = Number(customer.orders_count || 0)
  const totalSpent = Number(customer.total_spent_sen || 0)

  return (
    <tr className="group border-b border-slate-100 transition hover:bg-slate-50">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="max-w-[260px] truncate text-sm font-black text-slate-950">
              {customer.name || 'Customer'}
            </p>
            <p className="mt-1 max-w-[280px] truncate text-xs font-medium text-slate-500">
              {customer.email || '-'}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-800">
          {getCustomerPhone(customer)}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {getCustomerCity(customer)}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-black text-slate-950">
          {ordersCount}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          pesanan
        </p>
      </td>

      <td className="whitespace-nowrap px-6 py-5 text-sm font-black text-slate-950">
        {formatCurrency(totalSpent)}
      </td>

      <td className="px-6 py-5">
        <CustomerStatusBadge customer={customer} />
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-semibold text-slate-700">
          {formatDate(customer.created_at)}
        </p>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(customer)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            title="Lihat detail customer"
          >
            <AdminIcon name="eye" size={17} />
          </button>

          {inactive ? (
            <button
              type="button"
              disabled={updatingId === customer.id}
              onClick={() => onRestore(customer)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Aktifkan customer"
            >
              <AdminIcon name="refresh" size={17} />
            </button>
          ) : (
            <button
              type="button"
              disabled={updatingId === customer.id}
              onClick={() => onDeactivate(customer)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Nonaktifkan customer"
            >
              <AdminIcon name="trash" size={17} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [meta, setMeta] = useState(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchCustomers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminCustomerService.getCustomers({
        search,
        status,
        page,
        per_page: 10,
      })

      setCustomers(response.data.data || [])
      setMeta(response.data.meta || null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Data customer belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers()
    }, 350)

    return () => clearTimeout(delay)
  }, [search, status, page])

  useEffect(() => {
    setPage(1)
  }, [search, status])

  const stats = useMemo(() => {
    const total = meta?.total || customers.length
    const active = customers.filter((customer) => !customer.deleted_at).length
    const inactive = customers.filter((customer) => customer.deleted_at).length
    const withOrders = customers.filter(
      (customer) => Number(customer.orders_count || 0) > 0
    ).length

    return {
      total,
      active,
      inactive,
      withOrders,
    }
  }, [customers, meta])

  const handleView = (customer) => {
    window.location.href = `/admin/customers/${customer.id}`
  }

  const handleDeactivate = async (customer) => {
    const confirmed = window.confirm(
      `Nonaktifkan customer "${customer.name}"? Akun tidak dihapus permanen.`
    )

    if (!confirmed) return

    setUpdatingId(customer.id)

    try {
      await adminCustomerService.deactivateCustomer(customer.id)
      await fetchCustomers()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Customer belum dapat dinonaktifkan.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRestore = async (customer) => {
    setUpdatingId(customer.id)

    try {
      await adminCustomerService.restoreCustomer(customer.id)
      await fetchCustomers()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Customer belum dapat diaktifkan kembali.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const canGoPrev = Number(meta?.current_page || 1) > 1
  const canGoNext =
    Number(meta?.current_page || 1) < Number(meta?.last_page || 1)

  return (
    <AdminLayout
      activeMenu="customers"
      breadcrumb="Admin / Customer"
      title="Manajemen Customer"
      searchPlaceholder="Cari customer..."
    >
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Customer Management
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Customer
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Kelola data customer, status akun, dan riwayat transaksi yang
              terhubung dengan halaman customer.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <AdminIcon name="refresh" size={18} />
            Refresh
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-5 border-t border-slate-100 pt-6 lg:grid-cols-4">
          <MiniMetric label="Total Customer" value={stats.total} tone="blue" />
          <MiniMetric label="Aktif" value={stats.active} tone="green" />
          <MiniMetric
            label="Pernah Order"
            value={stats.withOrders}
            tone="orange"
          />
          <MiniMetric label="Nonaktif" value={stats.inactive} tone="red" />
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px]">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <AdminIcon name="search" className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email customer..."
              className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Daftar Customer
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Data customer yang terdaftar pada sistem NadaKita.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {meta?.total || customers.length} customer
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
                Memuat data customer...
              </p>
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
              style={{
                backgroundColor: theme.primarySoft,
                color: theme.primary,
              }}
            >
              <AdminIcon name="customer" size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-950">
              Customer belum ditemukan
            </h3>

            <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
              Data customer akan muncul setelah pengguna melakukan registrasi.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Order
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Total Belanja
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Bergabung
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <CustomerRow
                      key={customer.id}
                      customer={customer}
                      onView={handleView}
                      onDeactivate={handleDeactivate}
                      onRestore={handleRestore}
                      updatingId={updatingId}
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