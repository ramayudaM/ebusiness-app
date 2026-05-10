import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import Progress from '../components/Progress'
import SectionHeader from '../components/SectionHeader'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminDashboardService } from './adminDashboardService'

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

function getMainProduct(order) {
  return order?.items?.[0]?.product_name_snapshot || order?.items?.[0]?.product?.name || 'Produk'
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
    completed: 'Selesai',
    delivered: 'Selesai',
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
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  if (['processing', 'processed', 'diproses'].includes(value)) {
    return 'bg-blue-50 text-blue-700 border-blue-100'
  }

  if (['shipping', 'shipped', 'dikirim'].includes(value)) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-100'
  }

  if (['completed', 'delivered', 'selesai'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }

  if (['cancelled', 'canceled', 'dibatalkan'].includes(value)) {
    return 'bg-rose-50 text-rose-700 border-rose-100'
  }

  return 'bg-slate-50 text-slate-600 border-slate-100'
}

function EmptyBox({ icon = 'box', title, description }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: theme.primarySoft,
          color: theme.primary,
        }}
      >
        <AdminIcon name={icon} size={24} />
      </div>

      <h4 className="text-lg font-black text-slate-950">{title}</h4>
      <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminDashboardService.getOverview()
      setDashboard(response.data.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Data dashboard belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const summary = dashboard?.summary || {}
  const weeklySales = dashboard?.weekly_sales || []
  const latestOrders = dashboard?.latest_orders || []
  const topProducts = dashboard?.top_products || []
  const lowStockProducts = dashboard?.low_stock_products || []
  const categoryPerformance = dashboard?.category_performance || []
  const recentActivities = dashboard?.recent_activities || []

  const maxWeeklyRevenue = useMemo(() => {
    return Math.max(...weeklySales.map((item) => Number(item.revenue_sen || 0)), 1)
  }, [weeklySales])

  const maxCategoryTotal = useMemo(() => {
    return Math.max(
      ...categoryPerformance.map((item) => Number(item.total_products || 0)),
      1
    )
  }, [categoryPerformance])

  const stats = [
    {
      title: 'Total Produk',
      value: summary.total_products || 0,
      change: `${summary.today_orders || 0}`,
      note: 'order hari ini',
      icon: 'product',
      color: theme.blue,
    },
    {
      title: 'Pesanan Masuk',
      value: summary.total_orders || 0,
      change: `${summary.weekly_orders || 0}`,
      note: 'order minggu ini',
      icon: 'order',
      color: theme.success,
    },
    {
      title: 'Customer',
      value: summary.total_customers || 0,
      change: `${summary.total_reviews || 0}`,
      note: 'ulasan customer',
      icon: 'customer',
      color: theme.primary,
    },
    {
      title: 'Revenue Bulan Ini',
      value: formatCurrency(summary.monthly_revenue_sen || 0),
      change: `${summary.completed_orders || 0}`,
      note: 'order selesai',
      icon: 'revenue',
      color: theme.warning,
    },
  ]

  return (
    <AdminLayout
      activeMenu="dashboard"
      breadcrumb="Admin / Dashboard"
      title="Dashboard Overview"
      searchPlaceholder="Cari produk, pesanan, customer..."
    >
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div
          className="relative overflow-hidden rounded-[34px] p-7 text-white shadow-sm md:p-8"
          style={{
            background: `linear-gradient(135deg, ${theme.navyDark || theme.navy}, ${theme.navy} 55%, ${theme.primaryDark})`,
          }}
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/75">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Database admin aktif
            </div>

            <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Kelola operasional NadaKita dari satu dashboard yang terhubung database.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/65 md:text-[15px]">
              Pantau produk, customer, pesanan, revenue, stok rendah, dan performa
              penjualan terbaru secara langsung dari data sistem.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Menunggu</p>
                <h3 className="mt-1 text-xl font-black">
                  {summary.pending_orders || 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Diproses</p>
                <h3 className="mt-1 text-xl font-black">
                  {summary.processing_orders || 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Dikirim</p>
                <h3 className="mt-1 text-xl font-black">
                  {summary.shipping_orders || 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Selesai</p>
                <h3 className="mt-1 text-xl font-black">
                  {summary.completed_orders || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-sm">
          <div
            className="flex h-56 items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.primarySoft}, #FFFFFF)`,
            }}
          >
            <div
              className="flex h-24 w-24 items-center justify-center rounded-[30px]"
              style={{
                backgroundColor: theme.primary,
                color: '#FFFFFF',
              }}
            >
              <AdminIcon name="chart" size={40} />
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm font-semibold text-slate-500">
              Highlight operasional
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {summary.weekly_orders || 0} pesanan minggu ini
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
              Dashboard ini akan semakin informatif setelah transaksi customer
              bertambah melalui proses checkout.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[500px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat dashboard...
            </p>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Penjualan Mingguan"
                  description="Revenue pesanan terbayar selama 7 hari terakhir."
                  action={
                    <button
                      type="button"
                      onClick={fetchDashboard}
                      className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      Refresh
                    </button>
                  }
                />

                {weeklySales.length === 0 ? (
                  <EmptyBox
                    icon="chart"
                    title="Belum ada data penjualan"
                    description="Grafik akan tampil setelah terdapat pesanan terbayar pada minggu ini."
                  />
                ) : (
                  <div className="grid h-72 grid-cols-7 items-end gap-3 md:gap-5">
                    {weeklySales.map((item) => {
                      const height = Math.max(
                        8,
                        Math.round((Number(item.revenue_sen || 0) / maxWeeklyRevenue) * 100)
                      )

                      return (
                        <div key={item.date} className="flex h-full flex-col justify-end">
                          <div className="flex h-full items-end">
                            <div
                              className="w-full origin-bottom rounded-t-[18px] transition hover:scale-y-105"
                              style={{
                                height: `${height}%`,
                                background: `linear-gradient(180deg, ${theme.primary}, ${theme.primaryDark})`,
                              }}
                              title={formatCurrency(item.revenue_sen || 0)}
                            />
                          </div>

                          <p className="mt-3 text-center text-xs font-black text-slate-600">
                            {item.day}
                          </p>
                          <p className="mt-1 text-center text-[10px] font-medium text-slate-400">
                            {item.orders_count || 0} order
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Pesanan Terbaru"
                  description="Transaksi terbaru yang masuk ke sistem."
                  action={
                    <a
                      href="/admin/orders"
                      className="text-sm font-black text-orange-600 hover:underline"
                    >
                      Lihat Semua
                    </a>
                  }
                />

                {latestOrders.length === 0 ? (
                  <EmptyBox
                    icon="order"
                    title="Belum ada pesanan"
                    description="Pesanan terbaru akan muncul setelah customer melakukan checkout."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          <th className="py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                            Order
                          </th>
                          <th className="py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                            Customer
                          </th>
                          <th className="py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                            Produk
                          </th>
                          <th className="py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                            Total
                          </th>
                          <th className="py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="py-4 text-sm font-black text-slate-950">
                              {getOrderNumber(order)}
                            </td>

                            <td className="py-4">
                              <p className="text-sm font-bold text-slate-800">
                                {getCustomerName(order)}
                              </p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {formatDate(order.created_at)}
                              </p>
                            </td>

                            <td className="py-4 text-sm text-slate-700">
                              {getMainProduct(order)}
                            </td>

                            <td className="py-4 text-sm font-black text-slate-950">
                              {formatCurrency(order.total_sen || 0)}
                            </td>

                            <td className="py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusClass(order.status)}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Produk Terlaris"
                  description="Produk dengan penjualan tertinggi berdasarkan order item."
                  action={
                    <a
                      href="/admin/products"
                      className="text-sm font-black text-orange-600 hover:underline"
                    >
                      Kelola Produk
                    </a>
                  }
                />

                {topProducts.length === 0 ? (
                  <EmptyBox
                    icon="product"
                    title="Belum ada produk terjual"
                    description="Produk terlaris akan muncul setelah ada data order item."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {topProducts.map((product, index) => (
                      <div
                        key={`${product.product_id}-${index}`}
                        className="group overflow-hidden rounded-[24px] border border-slate-200 transition hover:shadow-lg"
                      >
                        <div
                          className="flex h-44 items-center justify-center bg-slate-100"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primarySoft}, #FFFFFF)`,
                          }}
                        >
                          <AdminIcon name="product" size={42} className="text-orange-600" />
                        </div>

                        <div className="p-5">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-black text-slate-950">
                                {product.name || 'Produk'}
                              </h3>
                              <p className="mt-1 text-sm font-medium text-slate-500">
                                SKU: {product.sku || '-'}
                              </p>
                            </div>

                            <span className="h-fit rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">Terjual</p>
                              <h4 className="mt-1 font-black text-slate-950">
                                {product.sold || 0}
                              </h4>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">Revenue</p>
                              <h4 className="mt-1 text-sm font-black text-slate-950">
                                {formatCurrency(product.revenue_sen || 0)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Status Pesanan"
                  description="Ringkasan status order saat ini."
                />

                <div className="space-y-5">
                  <Progress
                    label={`Menunggu (${summary.pending_orders || 0})`}
                    value={
                      summary.total_orders
                        ? Math.round(((summary.pending_orders || 0) / summary.total_orders) * 100)
                        : 0
                    }
                    color={theme.warning}
                  />

                  <Progress
                    label={`Diproses (${summary.processing_orders || 0})`}
                    value={
                      summary.total_orders
                        ? Math.round(((summary.processing_orders || 0) / summary.total_orders) * 100)
                        : 0
                    }
                    color={theme.blue}
                  />

                  <Progress
                    label={`Dikirim (${summary.shipping_orders || 0})`}
                    value={
                      summary.total_orders
                        ? Math.round(((summary.shipping_orders || 0) / summary.total_orders) * 100)
                        : 0
                    }
                    color={theme.primary}
                  />

                  <Progress
                    label={`Selesai (${summary.completed_orders || 0})`}
                    value={
                      summary.total_orders
                        ? Math.round(((summary.completed_orders || 0) / summary.total_orders) * 100)
                        : 0
                    }
                    color={theme.success}
                  />
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Performa Kategori"
                  description="Kategori dengan jumlah produk terbanyak."
                />

                {categoryPerformance.length === 0 ? (
                  <EmptyBox
                    icon="category"
                    title="Belum ada kategori"
                    description="Data kategori akan tampil setelah produk memiliki kategori."
                  />
                ) : (
                  <div className="space-y-5">
                    {categoryPerformance.map((category) => (
                      <Progress
                        key={category.id}
                        label={`${category.name} (${category.total_products || 0})`}
                        value={Math.round(
                          (Number(category.total_products || 0) / maxCategoryTotal) * 100
                        )}
                        color={theme.primary}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                  title="Stok Rendah"
                  description="Produk yang perlu segera dicek."
                />

                {lowStockProducts.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    Belum ada data stok rendah.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
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
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Aktivitas Terbaru" />

                {recentActivities.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    Belum ada aktivitas terbaru.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {recentActivities.map((activity, index) => (
                      <div key={`${activity.title}-${index}`} className="flex gap-3">
                        <div
                          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />

                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {activity.title}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  )
}