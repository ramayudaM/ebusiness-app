import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminReportService } from './adminReportService'

function formatCurrency(value) {
  const amount = Number(value || 0) / 100

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
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
  return order?.order_number || `ORD-${order?.id || '-'}`
}

function getCustomerName(order) {
  return order?.user?.name || order?.guest_name || 'Customer'
}

function getCustomerEmail(order) {
  return order?.user?.email || order?.guest_email || '-'
}

function getStatusLabel(status) {
  const value = String(status || '').toLowerCase()

  const map = {
    pending: 'Menunggu',
    menunggu: 'Menunggu',
    processing: 'Diproses',
    processed: 'Diproses',
    diproses: 'Diproses',
    shipping: 'Dikirim',
    shipped: 'Dikirim',
    dikirim: 'Dikirim',
    delivered: 'Selesai',
    completed: 'Selesai',
    selesai: 'Selesai',
    cancelled: 'Dibatalkan',
    canceled: 'Dibatalkan',
    dibatalkan: 'Dibatalkan',
  }

  return map[value] || status || '-'
}

function getStatusClass(status) {
  const value = String(status || '').toLowerCase()

  if (['pending', 'menunggu'].includes(value)) {
    return 'bg-amber-50 text-amber-700 ring-amber-100'
  }

  if (['processing', 'processed', 'diproses'].includes(value)) {
    return 'bg-blue-50 text-blue-700 ring-blue-100'
  }

  if (['shipping', 'shipped', 'dikirim'].includes(value)) {
    return 'bg-indigo-50 text-indigo-700 ring-indigo-100'
  }

  if (['completed', 'delivered', 'selesai'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  if (['cancelled', 'canceled', 'dibatalkan'].includes(value)) {
    return 'bg-rose-50 text-rose-700 ring-rose-100'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClass(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}

function SummaryCard({ title, value, subtitle, icon, iconColor, iconBg }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>
          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {value}
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: iconBg,
            color: iconColor,
          }}
        >
          <AdminIcon name={icon} size={24} />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ title, description, icon = 'chart' }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px]"
        style={{
          backgroundColor: theme.primarySoft,
          color: theme.primary,
        }}
      >
        <AdminIcon name={icon} size={28} />
      </div>
      <h4 className="text-lg font-black text-slate-900">{title}</h4>
      <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  )
}

function SectionCard({ title, subtitle, rightText, children }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[22px] font-black tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        {rightText ? (
          <div className="text-sm font-bold text-slate-500">{rightText}</div>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ProgressItem({ label, count, percent, colorClass }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-600">{label}</span>
        <span className="text-sm font-black text-slate-950">{count}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default function AdminReportsPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await adminReportService.getOverview()
      setReport(response.data.data)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Data laporan gagal dimuat. Cek backend, login admin, atau sinkronisasi database.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const summary = report?.summary || {}
  const latestOrders = report?.latest_orders || []
  const lowStockProducts = report?.low_stock_products || []
  const topProducts = report?.top_products || []
  const rawStatus = report?.order_status_summary?.raw || {}
  const normalizedStatus = report?.order_status_summary?.normalized || {}

  const totalStatusCount = useMemo(() => {
    return Object.values(normalizedStatus).reduce(
      (acc, item) => acc + Number(item || 0),
      0
    )
  }, [normalizedStatus])

  const statusProgress = useMemo(() => {
    const calcPercent = (count) => {
      if (!totalStatusCount) return 0
      return Math.round((Number(count || 0) / totalStatusCount) * 100)
    }

    return [
      {
        label: 'Menunggu',
        count: normalizedStatus.pending || 0,
        percent: calcPercent(normalizedStatus.pending),
        colorClass: 'bg-amber-500',
      },
      {
        label: 'Diproses',
        count: normalizedStatus.processing || 0,
        percent: calcPercent(normalizedStatus.processing),
        colorClass: 'bg-blue-500',
      },
      {
        label: 'Dikirim',
        count: normalizedStatus.shipping || 0,
        percent: calcPercent(normalizedStatus.shipping),
        colorClass: 'bg-indigo-500',
      },
      {
        label: 'Selesai',
        count: normalizedStatus.completed || 0,
        percent: calcPercent(normalizedStatus.completed),
        colorClass: 'bg-emerald-500',
      },
      {
        label: 'Dibatalkan',
        count: normalizedStatus.cancelled || 0,
        percent: calcPercent(normalizedStatus.cancelled),
        colorClass: 'bg-rose-500',
      },
    ]
  }, [normalizedStatus, totalStatusCount])

  return (
    <AdminLayout
      activeMenu="reports"
      breadcrumb="Admin / Laporan"
      title="Laporan & Analitik"
      searchPlaceholder="Cari laporan, produk, pesanan..."
    >
      <section
        className="relative overflow-hidden rounded-[34px] p-7 text-white shadow-sm md:p-8"
        style={{
          background: `linear-gradient(135deg, ${theme.navyDark}, ${theme.navy} 52%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -left-16 -top-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Database-driven reports
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Pantau performa toko NadaKita berdasarkan data transaksi asli.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 md:text-[15px]">
              Semua ringkasan laporan, status pesanan, produk terlaris, dan
              produk stok rendah diambil langsung dari database agar admin bisa
              memantau kondisi toko dengan lebih akurat.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOverview}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            <AdminIcon name="refresh" size={18} />
            Refresh Data
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[500px] items-center justify-center rounded-[30px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat laporan...
            </p>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
            <SummaryCard
              title="Total Revenue"
              value={formatCurrency(summary.total_revenue_sen || 0)}
              subtitle="Akumulasi pendapatan pesanan yang sudah terbayar"
              icon="revenue"
              iconColor="#16A34A"
              iconBg="#ECFDF3"
            />

            <SummaryCard
              title="Total Order"
              value={summary.total_orders || 0}
              subtitle={`${summary.pending_orders || 0} pesanan menunggu proses`}
              icon="order"
              iconColor="#2563EB"
              iconBg="#EFF6FF"
            />

            <SummaryCard
              title="Total Produk"
              value={summary.total_products || 0}
              subtitle={`${summary.active_products || 0} produk aktif tersedia`}
              icon="product"
              iconColor="#F97316"
              iconBg="#FFF7ED"
            />

            <SummaryCard
              title="Total Customer"
              value={summary.total_customers || 0}
              subtitle="Jumlah customer terdaftar"
              icon="customer"
              iconColor="#D97706"
              iconBg="#FFFBEB"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.55fr_0.85fr]">
            <div className="space-y-6">
              <SectionCard
                title="Produk Terlaris"
                subtitle="Berdasarkan data order_items yang tersimpan."
                rightText={`${topProducts.length} produk`}
              >
                {topProducts.length === 0 ? (
                  <EmptyState
                    title="Belum ada data penjualan produk"
                    description="Produk terlaris akan tampil setelah ada order customer yang masuk dan berhasil tersimpan."
                    icon="product"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr className="bg-slate-50 text-left">
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Produk
                          </th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            SKU
                          </th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Terjual
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((item, index) => (
                          <tr
                            key={`${item.product_id}-${index}`}
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5">
                              <p className="text-sm font-black text-slate-950">
                                {item.product_name || 'Produk'}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                ID Produk: {item.product_id || '-'}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                                {item.product_sku || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm font-black text-slate-900">
                              {item.total_sold || 0}
                            </td>
                            <td className="px-6 py-5 text-right text-sm font-black text-slate-950">
                              {formatCurrency(item.total_revenue_sen || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Pesanan Terbaru"
                subtitle="Daftar order terbaru dari database."
                rightText={`${latestOrders.length} pesanan`}
              >
                {latestOrders.length === 0 ? (
                  <EmptyState
                    title="Belum ada pesanan"
                    description="Pesanan terbaru akan muncul jika customer sudah melakukan checkout."
                    icon="order"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px]">
                      <thead>
                        <tr className="bg-slate-50 text-left">
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            No. Pesanan
                          </th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Total
                          </th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Tanggal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5 text-sm font-black text-slate-950">
                              {getOrderNumber(order)}
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-black text-slate-950">
                                {getCustomerName(order)}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {getCustomerEmail(order)}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-sm font-black text-slate-950">
                              {formatCurrency(order.total_sen || 0)}
                            </td>
                            <td className="px-6 py-5">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-5 text-right text-sm font-semibold text-slate-600">
                              {formatDate(order.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-[22px] font-black tracking-tight text-slate-950">
                  Status Pesanan
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Distribusi status order yang sudah dinormalisasi dari database.
                </p>

                <div className="mt-6 space-y-5">
                  {statusProgress.map((item) => (
                    <ProgressItem
                      key={item.label}
                      label={item.label}
                      count={item.count}
                      percent={item.percent}
                      colorClass={item.colorClass}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-[22px] font-black tracking-tight text-slate-950">
                  Produk Stok Rendah
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Produk dengan stok paling sedikit.
                </p>

                <div className="mt-5 space-y-3">
                  {lowStockProducts.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                      Belum ada data stok yang bisa ditampilkan.
                    </p>
                  ) : (
                    lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-950">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              SKU: {product.sku || '-'}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                              Number(product.stock_qty || 0) <= 5
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {product.stock_qty || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-[22px] font-black tracking-tight text-slate-950">
                  Status Mentah Database
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Ini membantu mengecek apakah enum/status database sudah sinkron.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {Object.keys(rawStatus).length === 0 ? (
                    <p className="text-sm font-semibold text-slate-500">
                      Belum ada data status mentah.
                    </p>
                  ) : (
                    Object.entries(rawStatus).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                          {key}
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-950">
                          {value} order
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section
                className="rounded-[30px] p-6 text-white shadow-sm"
                style={{
                  background: `linear-gradient(145deg, ${theme.navyDark}, ${theme.navy})`,
                }}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
                  Insight
                </p>
                <h3 className="mt-4 text-3xl font-black leading-tight">
                  {summary.total_orders || 0} pesanan tercatat saat ini
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/65">
                  Semakin banyak transaksi customer yang masuk, maka laporan ini
                  akan semakin akurat untuk mendukung keputusan admin.
                </p>
              </section>
            </aside>
          </section>
        </>
      )}
    </AdminLayout>
  )
}