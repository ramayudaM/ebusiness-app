import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminDashboardService } from './adminDashboardService'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Activity, 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  RefreshCw, 
  BarChart2, 
  ChevronRight 
} from 'lucide-react'

function formatCurrency(value) {
  const amount = Number(value || 0)

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
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }

  if (['processing', 'processed', 'diproses'].includes(value)) {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }

  if (['shipping', 'shipped', 'dikirim'].includes(value)) {
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  }

  if (['completed', 'delivered', 'selesai'].includes(value)) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  }

  if (['cancelled', 'canceled', 'dibatalkan'].includes(value)) {
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  return 'bg-zinc-800 text-zinc-400 border-zinc-700'
}

// LOCAL DARK PREMIUM COMPONENTS
function DashboardSectionHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-400 font-semibold">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function DashboardStatCard({ title, value, change, note, icon, color }) {
  const getIcon = () => {
    switch (icon) {
      case 'product': return <Package size={22} />
      case 'order': return <ShoppingBag size={22} />
      case 'customer': return <Users size={22} />
      case 'revenue': return <DollarSign size={22} />
      default: return <Activity size={22} />
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group rounded-[2rem] p-[1px] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900/10 hover:from-orange-500/30 hover:to-orange-500/5 transition-all duration-500 shadow-xl"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-600/5 blur-[35px] group-hover:bg-orange-500/15 transition-all duration-500 pointer-events-none"></div>
      <div className="relative h-full bg-[#0A0A0A]/90 backdrop-blur-md rounded-[calc(2rem-1px)] p-6 flex flex-col justify-between z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-400">{title}</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-white">{value}</h3>
          </div>

          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110"
            style={{
              color: color || '#FF4D1C',
              backgroundColor: `${color || '#FF4D1C'}15`,
              borderColor: `${color || '#FF4D1C'}30`,
            }}
          >
            {getIcon()}
          </div>
        </div>

        {(change || note) && (
          <div className="mt-5 flex items-center gap-2">
            {change && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold border"
                style={{
                  color: color || '#FF4D1C',
                  backgroundColor: `${color || '#FF4D1C'}15`,
                  borderColor: `${color || '#FF4D1C'}30`,
                }}
              >
                {change}
              </span>
            )}
            {note && <span className="text-xs font-semibold text-zinc-500">{note}</span>}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DashboardProgress({ label, value, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-zinc-300 font-semibold">{label}</span>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800/40">
        <div
          className="h-full rounded-full bg-gradient-to-r transition-all duration-500"
          style={{ 
            width: `${value}%`, 
            backgroundImage: `linear-gradient(90deg, ${color || '#FF4D1C'}, #FFA384)` 
          }}
        />
      </div>
    </div>
  )
}

function DashboardEmptyBox({ icon = 'box', title, description }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center backdrop-blur-sm">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500"
      >
        <Activity size={24} />
      </div>

      <h4 className="text-lg font-black text-white">{title}</h4>
      <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-zinc-400">
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
      color: '#3B82F6', // Blue
    },
    {
      title: 'Pesanan Masuk',
      value: summary.total_orders || 0,
      change: `${summary.weekly_orders || 0}`,
      note: 'order minggu ini',
      icon: 'order',
      color: '#10B981', // Success Emerald
    },
    {
      title: 'Customer',
      value: summary.total_customers || 0,
      change: `${summary.total_reviews || 0}`,
      note: 'ulasan customer',
      icon: 'customer',
      color: '#FF4D1C', // Primary Orange
    },
    {
      title: 'Revenue Bulan Ini',
      value: formatCurrency(summary.monthly_revenue_sen || 0),
      change: `${summary.completed_orders || 0}`,
      note: 'order selesai',
      icon: 'revenue',
      color: '#F59E0B', // Warning Amber
    },
  ]

  return (
    <AdminLayout
      activeMenu="dashboard"
      breadcrumb="Admin / Dashboard"
      title="Dashboard Overview"
      searchPlaceholder="Cari produk, pesanan, customer..."
    >
      <div className="relative z-10 space-y-8 p-1">
        {/* Global Ambient Glow inside Page */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-orange-600/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] bg-orange-700/5 blur-[150px] rounded-full"></div>
        </div>

        {/* TOP SECTION: BANNER & QUICK OVERVIEW */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          {/* Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A] p-7 md:p-8 text-white shadow-2xl"
          >
            {/* Ambient glows inside card */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-zinc-800/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-500">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                Sistem Database Terhubung
              </div>

              <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400">
                Kelola operasional NadaKita dari satu dashboard yang terhubung database.
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-[15px]">
                Pantau produk, customer, pesanan, revenue, stok rendah, dan performa
                penjualan terbaru secara langsung dari data sistem.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Menunggu</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {summary.pending_orders || 0}
                  </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Diproses</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {summary.processing_orders || 0}
                  </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Dikirim</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {summary.shipping_orders || 0}
                  </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Selesai</p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {summary.completed_orders || 0}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A] shadow-2xl flex flex-col"
          >
            <div
              className="flex h-56 items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0A0A0A, #121212)',
              }}
            >
              {/* Glow behind icon */}
              <div className="absolute w-44 h-44 rounded-full bg-orange-600/10 blur-2xl" />
              <div
                className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-orange-500/20 bg-orange-500/10 text-orange-500 relative z-10"
              >
                <BarChart2 size={40} />
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em]">
                Highlight Operasional
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {summary.weekly_orders || 0} pesanan minggu ini
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-400">
                Dashboard ini akan semakin informatif setelah transaksi customer
                bertambah melalui proses checkout.
              </p>
            </div>
          </motion.div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm font-bold text-rose-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-[2rem] border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-600" />
              <p className="mt-4 text-sm font-bold text-zinc-500">
                Memuat dashboard...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* STATS SECTION */}
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <DashboardStatCard key={item.title} {...item} />
              ))}
            </section>

            {/* MAIN DATA SECTION */}
            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                {/* Sales Chart Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Penjualan Mingguan"
                    description="Revenue pesanan terbayar selama 7 hari terakhir."
                    action={
                      <button
                        type="button"
                        onClick={fetchDashboard}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 transition-all duration-300 hover:text-white flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                      </button>
                    }
                  />

                  {weeklySales.length === 0 ? (
                    <DashboardEmptyBox
                      title="Belum ada data penjualan"
                      description="Grafik akan tampil setelah terdapat pesanan terbayar pada minggu ini."
                    />
                  ) : (
                    <div className="grid h-72 grid-cols-7 items-end gap-3 md:gap-5 mt-8 px-2">
                      {weeklySales.map((item) => {
                        const height = Math.max(
                          8,
                          Math.round((Number(item.revenue_sen || 0) / maxWeeklyRevenue) * 100)
                        )

                        return (
                          <div key={item.date} className="flex h-full flex-col justify-end group/bar">
                            <div className="flex h-full items-end justify-center relative">
                              <div className="absolute bottom-[calc(height%+10px)] bg-[#050505] border border-zinc-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl z-25 pointer-events-none">
                                {formatCurrency(item.revenue_sen || 0)}
                              </div>
                              
                              <div
                                className="w-full max-w-[32px] origin-bottom rounded-t-xl transition-all duration-300 hover:scale-x-110 shadow-[0_0_15px_rgba(234,88,12,0.1)] hover:shadow-[0_0_25px_rgba(234,88,12,0.3)] cursor-pointer"
                                style={{
                                  height: `${height}%`,
                                  background: 'linear-gradient(180deg, #FF4D1C, #C7350D)',
                                }}
                              />
                            </div>

                            <p className="mt-4 text-center text-xs font-bold text-zinc-400">
                              {item.day}
                            </p>
                            <p className="mt-1 text-center text-[10px] font-semibold text-zinc-500">
                              {item.orders_count || 0} order
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Latest Orders Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Pesanan Terbaru"
                    description="Transaksi terbaru yang masuk ke sistem."
                    action={
                      <a
                        href="/admin/orders"
                        className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 hover:underline"
                      >
                        Lihat Semua <ChevronRight size={14} />
                      </a>
                    }
                  />

                  {latestOrders.length === 0 ? (
                    <DashboardEmptyBox
                      title="Belum ada pesanan"
                      description="Pesanan terbaru akan muncul setelah customer melakukan checkout."
                    />
                  ) : (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full min-w-[820px]">
                        <thead>
                          <tr className="border-b border-zinc-800/80 text-left">
                            <th className="py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Order
                            </th>
                            <th className="py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Customer
                            </th>
                            <th className="py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Produk
                            </th>
                            <th className="py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Total
                            </th>
                            <th className="py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-900/60">
                          {latestOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="transition-colors hover:bg-zinc-900/20"
                            >
                              <td className="py-4 text-sm font-black text-white">
                                {getOrderNumber(order)}
                              </td>

                              <td className="py-4">
                                <p className="text-sm font-bold text-zinc-200">
                                  {getCustomerName(order)}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-zinc-500">
                                  {formatDate(order.created_at)}
                                </p>
                              </td>

                              <td className="py-4 text-sm text-zinc-400 font-medium">
                                {getMainProduct(order)}
                              </td>

                              <td className="py-4 text-sm font-bold text-white">
                                {formatCurrency(order.total_sen || 0)}
                              </td>

                              <td className="py-4">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(order.status)}`}
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

                {/* Top Products Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Produk Terlaris"
                    description="Produk dengan penjualan tertinggi berdasarkan order item."
                    action={
                      <a
                        href="/admin/products"
                        className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 hover:underline"
                      >
                        Kelola Produk <ChevronRight size={14} />
                      </a>
                    }
                  />

                  {topProducts.length === 0 ? (
                    <DashboardEmptyBox
                      title="Belum ada produk terjual"
                      description="Produk terlaris akan muncul setelah ada data order item."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-6">
                      {topProducts.map((product, index) => (
                        <motion.div
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          key={`${product.product_id}-${index}`}
                          className="group overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30"
                        >
                          <div
                            className="flex h-40 items-center justify-center relative overflow-hidden"
                            style={{
                              background: 'linear-gradient(135deg, #0A0A0A, #121212)',
                            }}
                          >
                            <div className="absolute w-28 h-28 rounded-full bg-orange-600/5 blur-xl group-hover:bg-orange-500/15 transition-all duration-500" />
                            <Package size={42} className="text-orange-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate font-black text-white">
                                  {product.name || 'Produk'}
                                </h3>
                                <p className="mt-1 text-xs font-semibold text-zinc-500">
                                  SKU: {product.sku || '-'}
                                </p>
                              </div>

                              <span className="h-fit rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-500">
                                #{index + 1}
                              </span>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900/60 p-3">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Terjual</p>
                                <h4 className="mt-1 font-black text-white text-lg">
                                  {product.sold || 0}
                                </h4>
                              </div>

                              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900/60 p-3">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Revenue</p>
                                <h4 className="mt-1 text-xs font-black text-white">
                                  {formatCurrency(product.revenue_sen || 0)}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SIDEBAR COLUMNS */}
              <div className="space-y-6">
                {/* Order Status Progress Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Status Pesanan"
                    description="Ringkasan status order saat ini."
                  />

                  <div className="space-y-5 mt-6">
                    <DashboardProgress
                      label={`Menunggu (${summary.pending_orders || 0})`}
                      value={
                        summary.total_orders
                          ? Math.round(((summary.pending_orders || 0) / summary.total_orders) * 100)
                          : 0
                      }
                      color="#F59E0B"
                    />

                    <DashboardProgress
                      label={`Diproses (${summary.processing_orders || 0})`}
                      value={
                        summary.total_orders
                          ? Math.round(((summary.processing_orders || 0) / summary.total_orders) * 100)
                          : 0
                      }
                      color="#3B82F6"
                    />

                    <DashboardProgress
                      label={`Dikirim (${summary.shipping_orders || 0})`}
                      value={
                        summary.total_orders
                          ? Math.round(((summary.shipping_orders || 0) / summary.total_orders) * 100)
                          : 0
                      }
                      color="#FF4D1C"
                    />

                    <DashboardProgress
                      label={`Selesai (${summary.completed_orders || 0})`}
                      value={
                        summary.total_orders
                          ? Math.round(((summary.completed_orders || 0) / summary.total_orders) * 100)
                          : 0
                      }
                      color="#10B981"
                    />
                  </div>
                </div>

                {/* Category Performance Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Performa Kategori"
                    description="Kategori dengan jumlah produk terbanyak."
                  />

                  {categoryPerformance.length === 0 ? (
                    <DashboardEmptyBox
                      title="Belum ada kategori"
                      description="Data kategori akan tampil setelah produk memiliki kategori."
                    />
                  ) : (
                    <div className="space-y-5 mt-6">
                      {categoryPerformance.map((category) => (
                        <DashboardProgress
                          key={category.id}
                          label={`${category.name} (${category.total_products || 0})`}
                          value={Math.round(
                            (Number(category.total_products || 0) / maxCategoryTotal) * 100
                          )}
                          color="#FF4D1C"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Low Stock Products Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader
                    title="Stok Rendah"
                    description="Produk yang perlu segera dicek."
                  />

                  {lowStockProducts.length === 0 ? (
                    <p className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 text-sm font-semibold text-zinc-500">
                      Belum ada data stok rendah.
                    </p>
                  ) : (
                    <div className="space-y-3 mt-6">
                      {lowStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-2xl border border-zinc-900/60 bg-zinc-900/20 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-zinc-200">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-zinc-500">
                                SKU: {product.sku || '-'}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
                                Number(product.stock_qty || 0) <= 5
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              Stok: {product.stock_qty || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activities Card */}
                <div className="rounded-[2rem] border border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md p-6 shadow-2xl">
                  <DashboardSectionHeader title="Aktivitas Terbaru" />

                  {recentActivities.length === 0 ? (
                    <p className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 text-sm font-semibold text-zinc-500">
                      Belum ada aktivitas terbaru.
                    </p>
                  ) : (
                    <div className="space-y-5 mt-6">
                      {recentActivities.map((activity, index) => (
                        <div key={`${activity.title}-${index}`} className="flex gap-4">
                          <div
                            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border shadow-[0_0_8px_currentColor]"
                            style={{ 
                              backgroundColor: '#FF4D1C',
                              color: '#FF4D1C'
                            }}
                          />

                          <div>
                            <p className="text-sm font-bold text-zinc-200">
                              {activity.title}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-zinc-400 leading-relaxed">
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
      </div>
    </AdminLayout>
  )
}
