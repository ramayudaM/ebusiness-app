import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminOrderService } from './adminOrderService'

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

function getOrderNumber(order) {
  return order.order_number || order.invoice_number || `ORD-${order.id}`
}

function getOrderTotal(order) {
  return (
    order.total_sen ||
    order.grand_total_sen ||
    order.total_price_sen ||
    order.total_amount_sen ||
    order.total ||
    0
  )
}

function getCustomerName(order) {
  return order.user?.name || order.customer?.name || 'Customer'
}

function getCustomerEmail(order) {
  return order.user?.email || order.customer?.email || '-'
}

function getItemCount(order) {
  if (Array.isArray(order.items)) {
    return order.items.reduce((total, item) => total + Number(item.quantity || item.qty || 1), 0)
  }

  return order.items_count || 0
}

function normalizeStatus(status) {
  const value = String(status || 'pending').toLowerCase()

  const labels = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return labels[value] || status || 'Menunggu'
}

function normalizePaymentStatus(status) {
  const value = String(status || 'unpaid').toLowerCase()

  const labels = {
    unpaid: 'Belum Bayar',
    pending: 'Menunggu',
    paid: 'Lunas',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    refunded: 'Refund',
  }

  return labels[value] || status || 'Belum Bayar'
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

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        styles[value] || styles.pending
      }`}
    >
      {normalizeStatus(value)}
    </span>
  )
}

function PaymentBadge({ status }) {
  const value = String(status || 'unpaid').toLowerCase()

  const styles = {
    unpaid: 'bg-slate-100 text-slate-600 ring-slate-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    failed: 'bg-rose-50 text-rose-700 ring-rose-100',
    expired: 'bg-rose-50 text-rose-700 ring-rose-100',
    refunded: 'bg-purple-50 text-purple-700 ring-purple-100',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        styles[value] || styles.unpaid
      }`}
    >
      {normalizePaymentStatus(value)}
    </span>
  )
}

function MiniMetric({ label, value, tone }) {
  const colors = {
    orange: theme.primary,
    green: theme.success,
    blue: theme.blue,
    amber: theme.warning,
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

function OrderRow({ order, onView, onStatusChange, updatingId }) {
  const orderNumber = getOrderNumber(order)
  const customerName = getCustomerName(order)
  const customerEmail = getCustomerEmail(order)
  const total = getOrderTotal(order)
  const itemCount = getItemCount(order)

  return (
    <tr className="group border-b border-slate-100 transition hover:bg-slate-50">
      <td className="px-6 py-5">
        <div>
          <p className="text-sm font-black text-slate-950">{orderNumber}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {formatDate(order.created_at)}
          </p>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
            }}
          >
            {customerName.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="max-w-[220px] truncate text-sm font-black text-slate-950">
              {customerName}
            </p>
            <p className="mt-1 max-w-[240px] truncate text-xs font-medium text-slate-500">
              {customerEmail}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-800">{itemCount} item</p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Produk dipesan
        </p>
      </td>

      <td className="whitespace-nowrap px-6 py-5 text-sm font-black text-slate-950">
        {formatCurrency(total)}
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-6 py-5">
        <PaymentBadge status={order.payment_status} />
      </td>

      <td className="px-6 py-5">
        <select
          value={order.status || 'pending'}
          disabled={updatingId === order.id}
          onChange={(event) => onStatusChange(order, event.target.value)}
          className="min-w-[140px] rounded-2xl border-0 bg-slate-100 px-4 py-3 text-xs font-black text-slate-700 outline-none ring-0 transition focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="pending">Menunggu</option>
          <option value="processing">Diproses</option>
          <option value="shipped">Dikirim</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(order)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            title="Lihat detail pesanan"
          >
            <AdminIcon name="eye" size={17} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminOrderService.getOrders({
        search,
        status,
        payment_status: paymentStatus,
        page,
        per_page: 10,
      })

      setOrders(response.data.data || [])
      setMeta(response.data.meta || null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Data pesanan belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders()
    }, 350)

    return () => clearTimeout(delay)
  }, [search, status, paymentStatus, page])

  useEffect(() => {
    setPage(1)
  }, [search, status, paymentStatus])

  const stats = useMemo(() => {
    const total = meta?.total || orders.length
    const pending = orders.filter((order) => order.status === 'pending').length
    const processing = orders.filter((order) => order.status === 'processing').length
    const completed = orders.filter((order) => order.status === 'completed').length

    const revenue = orders
      .filter((order) => order.payment_status === 'paid')
      .reduce((totalAmount, order) => totalAmount + Number(getOrderTotal(order)), 0)

    return {
      total,
      pending,
      processing,
      completed,
      revenue,
    }
  }, [orders, meta])

  const handleViewOrder = (order) => {
    window.location.href = `/admin/orders/${order.id}`
  }

  const handleStatusChange = async (order, nextStatus) => {
    if (nextStatus === order.status) return

    setUpdatingId(order.id)

    try {
      await adminOrderService.updateStatus(order.id, nextStatus)

      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      )
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Status pesanan belum dapat diperbarui.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const canGoPrev = Number(meta?.current_page || 1) > 1
  const canGoNext = Number(meta?.current_page || 1) < Number(meta?.last_page || 1)

  return (
    <AdminLayout
      activeMenu="orders"
      breadcrumb="Admin / Pesanan"
      title="Manajemen Pesanan"
      searchPlaceholder="Cari nomor pesanan atau customer..."
    >
      {/* HEADER */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Order Management
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Pesanan
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Pantau pesanan customer, status pembayaran, dan proses pengiriman
              dari satu halaman admin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <AdminIcon name="refresh" size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-5 border-t border-slate-100 pt-6 lg:grid-cols-5">
          <MiniMetric label="Total Order" value={stats.total} tone="blue" />
          <MiniMetric label="Menunggu" value={stats.pending} tone="amber" />
          <MiniMetric label="Diproses" value={stats.processing} tone="orange" />
          <MiniMetric label="Selesai" value={stats.completed} tone="green" />
          <MiniMetric
            label="Paid Revenue"
            value={formatCurrency(stats.revenue)}
            tone="green"
          />
        </div>
      </section>

      {/* FILTER */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_220px_220px]">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
            <AdminIcon name="search" className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor pesanan, nama customer, atau email..."
              className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
          >
            <option value="">Semua Status Order</option>
            <option value="pending">Menunggu</option>
            <option value="processing">Diproses</option>
            <option value="shipped">Dikirim</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
          >
            <option value="">Semua Pembayaran</option>
            <option value="unpaid">Belum Bayar</option>
            <option value="pending">Menunggu</option>
            <option value="paid">Lunas</option>
            <option value="failed">Gagal</option>
            <option value="expired">Kedaluwarsa</option>
            <option value="refunded">Refund</option>
          </select>
        </div>
      </section>

      {/* TABLE */}
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              Daftar Pesanan
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kelola status pesanan berdasarkan transaksi customer.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {meta?.total || orders.length} pesanan
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
                Memuat data pesanan...
              </p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              <AdminIcon name="order" size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-950">
              Belum ada pesanan
            </h3>

            <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
              Pesanan customer akan tampil di sini setelah proses checkout
              berhasil dibuat.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px]">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Pesanan
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Item
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Total
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Order
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Pembayaran
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Update Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onView={handleViewOrder}
                      onStatusChange={handleStatusChange}
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