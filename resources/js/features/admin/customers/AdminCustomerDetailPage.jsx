import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getProfile(customer) {
  return customer?.customer_profile || customer?.customerProfile || {}
}

function getOrderNumber(order) {
  return order?.order_number || order?.invoice_number || `ORD-${order?.id}`
}

function getOrderTotal(order) {
  return order?.total_sen || order?.grand_total_sen || order?.total || 0
}

function StatusBadge({ status }) {
  const value = String(status || 'pending').toLowerCase()

  const styles = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    processing: 'bg-blue-50 text-blue-700 ring-blue-100',
    shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-100',
  }

  const labels = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        styles[value] || styles.pending
      }`}
    >
      {labels[value] || status || 'Menunggu'}
    </span>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-800">{value || '-'}</p>
    </div>
  )
}

function MiniMetric({ label, value, tone = 'orange' }) {
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

export default function AdminCustomerDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  const profile = useMemo(() => getProfile(customer), [customer])
  const orders = useMemo(() => customer?.orders || [], [customer])
  const inactive = Boolean(customer?.deleted_at)

  const fetchCustomer = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminCustomerService.getCustomer(id)
      setCustomer(response.data.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Detail customer belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const handleDeactivate = async () => {
    if (!customer) return

    const confirmed = window.confirm(
      `Nonaktifkan customer "${customer.name}"? Akun tidak dihapus permanen.`
    )

    if (!confirmed) return

    setUpdating(true)

    try {
      await adminCustomerService.deactivateCustomer(customer.id)
      await fetchCustomer()
    } catch (err) {
      alert(err.response?.data?.message || 'Customer belum dapat dinonaktifkan.')
    } finally {
      setUpdating(false)
    }
  }

  const handleRestore = async () => {
    if (!customer) return

    setUpdating(true)

    try {
      await adminCustomerService.restoreCustomer(customer.id)
      await fetchCustomer()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Customer belum dapat diaktifkan kembali.'
      )
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout
        activeMenu="customers"
        breadcrumb="Admin / Customer / Detail"
        title="Detail Customer"
        searchPlaceholder="Cari customer..."
      >
        <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat detail customer...
            </p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !customer) {
    return (
      <AdminLayout
        activeMenu="customers"
        breadcrumb="Admin / Customer / Detail"
        title="Detail Customer"
      >
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm font-bold text-rose-700">
          {error || 'Customer tidak ditemukan.'}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      activeMenu="customers"
      breadcrumb={`Admin / Customer / ${customer.name}`}
      title="Detail Customer"
      searchPlaceholder="Cari customer..."
    >
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[28px] bg-slate-100 ring-1 ring-slate-100">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-4xl font-black tracking-tight text-slate-950">
                  {customer.name}
                </h2>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                    inactive
                      ? 'bg-rose-50 text-rose-700 ring-rose-100'
                      : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                  }`}
                >
                  {inactive ? 'Nonaktif' : 'Aktif'}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {customer.email}
              </p>

              <p className="mt-3 text-sm font-semibold text-slate-500">
                Bergabung sejak {formatDate(customer.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/customers')}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Kembali
            </button>

            {inactive ? (
              <button
                type="button"
                disabled={updating}
                onClick={handleRestore}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                Aktifkan Customer
              </button>
            ) : (
              <button
                type="button"
                disabled={updating}
                onClick={handleDeactivate}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
              >
                Nonaktifkan Customer
              </button>
            )}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-5 border-t border-slate-100 pt-6 lg:grid-cols-4">
          <MiniMetric
            label="Total Order"
            value={customer.orders_count || 0}
            tone="blue"
          />

          <MiniMetric
            label="Total Belanja"
            value={formatCurrency(customer.total_spent_sen || 0)}
            tone="green"
          />

          <MiniMetric label="Kota" value={profile.city || '-'} tone="orange" />

          <MiniMetric
            label="Status"
            value={inactive ? 'Nonaktif' : 'Aktif'}
            tone={inactive ? 'red' : 'green'}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">
              Profil Customer
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Informasi akun dan kontak customer.
            </p>

            <div className="mt-5 space-y-3">
              <InfoItem label="Nama" value={customer.name} />
              <InfoItem label="Email" value={customer.email} />
              <InfoItem
                label="Telepon"
                value={profile.phone || profile.phone_number}
              />
              <InfoItem label="Kota" value={profile.city} />
              <InfoItem label="Provinsi" value={profile.province} />
              <InfoItem label="Kode Pos" value={profile.postal_code} />
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Alamat</h3>

            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
              {profile.address || 'Alamat customer belum diisi.'}
            </p>
          </section>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Riwayat Pesanan
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Pesanan terbaru yang dibuat oleh customer ini.
              </p>
            </div>

            <p className="text-sm font-bold text-slate-500">
              {orders.length} pesanan terbaru
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center p-8 text-center">
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
                style={{
                  backgroundColor: theme.primarySoft,
                  color: theme.primary,
                }}
              >
                <AdminIcon name="order" size={28} />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                Belum ada pesanan
              </h3>

              <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
                Riwayat pesanan akan muncul setelah customer melakukan checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Pesanan
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Total
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
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 text-sm font-black text-slate-950">
                        {getOrderNumber(order)}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-6 py-5 text-sm font-black text-slate-950">
                        {formatCurrency(getOrderTotal(order))}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              (window.location.href = `/admin/orders/${order.id}`)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            title="Lihat pesanan"
                          >
                            <AdminIcon name="eye" size={17} />
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
      </section>
    </AdminLayout>
  )
}