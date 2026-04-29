import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import SectionHeader from '../components/SectionHeader'
import AdminIcon from '../components/AdminIcon'

const theme = {
  primary: '#7F56D9',
  primaryDark: '#53389E',
  navy: '#101828',
  dark: '#1D2939',
  success: '#12B76A',
  warning: '#F79009',
  danger: '#F04438',
  blue: '#2E90FA',
}

function StatusBadge({ status }) {
  const style = {
    Selesai: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Dikirim: 'bg-blue-50 text-blue-700 border-blue-100',
    Diproses: 'bg-amber-50 text-amber-700 border-amber-100',
    Menunggu: 'bg-slate-50 text-slate-600 border-slate-200',
    Dibatalkan: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Menunggu
      }`}
    >
      {status}
    </span>
  )
}

function PaymentBadge({ status }) {
  const style = {
    Lunas: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    Gagal: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Pending
      }`}
    >
      {status}
    </span>
  )
}

function MiniProgress({ label, value, count, color }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-950">{count}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const orders = [
    {
      id: '#NK-1024',
      customer: 'Aulia Ramadhani',
      email: 'aulia@email.com',
      product: 'Yamaha Acoustic Guitar',
      date: '30 Apr 2026',
      total: 'Rp2.350.000',
      payment: 'Pending',
      status: 'Diproses',
    },
    {
      id: '#NK-1025',
      customer: 'Rizky Ananda',
      email: 'rizky@email.com',
      product: 'Roland GO:KEYS',
      date: '30 Apr 2026',
      total: 'Rp4.700.000',
      payment: 'Lunas',
      status: 'Dikirim',
    },
    {
      id: '#NK-1026',
      customer: 'Nabila Putri',
      email: 'nabila@email.com',
      product: 'Shure SM58 Microphone',
      date: '29 Apr 2026',
      total: 'Rp1.250.000',
      payment: 'Lunas',
      status: 'Selesai',
    },
    {
      id: '#NK-1027',
      customer: 'Fajar Maulana',
      email: 'fajar@email.com',
      product: 'Focusrite Scarlett Solo',
      date: '29 Apr 2026',
      total: 'Rp2.100.000',
      payment: 'Pending',
      status: 'Menunggu',
    },
    {
      id: '#NK-1028',
      customer: 'Kevin Arya',
      email: 'kevin@email.com',
      product: 'Drum Stick Vic Firth',
      date: '28 Apr 2026',
      total: 'Rp220.000',
      payment: 'Gagal',
      status: 'Dibatalkan',
    },
  ]

  const priorityOrders = orders.filter(
    (order) => order.payment === 'Pending' || order.status === 'Menunggu'
  )

  return (
    <AdminLayout
      activeMenu="orders"
      breadcrumb="Admin Panel / Orders"
      title="Manajemen Pesanan"
      searchPlaceholder="Cari order, customer, produk..."
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-sm md:p-7"
        style={{
          background: `linear-gradient(135deg, ${theme.navy}, ${theme.dark} 55%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/75">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Pesanan aktif dipantau
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Kelola pesanan customer dengan cepat dan terstruktur.
            </h2>

            <p className="mt-3 max-w-2xl leading-relaxed text-white/65">
              Pantau pembayaran, proses pesanan, pengiriman, dan transaksi terbaru
              dalam satu halaman yang ringkas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Hari ini</p>
              <h3 className="mt-1 text-xl font-bold">24</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Pending</p>
              <h3 className="mt-1 text-xl font-bold">18</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Revenue</p>
              <h3 className="mt-1 text-xl font-bold">Rp8.4jt</h3>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pesanan"
          value="349"
          note="Semua transaksi"
          icon="order"
          color={theme.blue}
        />

        <StatCard
          title="Diproses"
          value="46"
          note="Pesanan aktif"
          icon="box"
          color={theme.warning}
        />

        <StatCard
          title="Dikirim"
          value="28"
          note="Dalam pengiriman"
          icon="product"
          color={theme.primary}
        />

        <StatCard
          title="Selesai"
          value="275"
          note="Transaksi selesai"
          icon="chart"
          color={theme.success}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.55fr]">
        {/* LEFT */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Daftar Pesanan"
            description="Kelola status pembayaran, proses pesanan, dan pengiriman."
            action={
              <button className="hidden items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:inline-flex">
                <AdminIcon name="filter" size={18} />
                Filter
              </button>
            }
          />

          {/* FILTER BAR */}
          <div className="mb-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_170px_170px]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-slate-400">
                <AdminIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Cari nomor pesanan atau customer..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option>Semua Status</option>
              <option>Menunggu</option>
              <option>Diproses</option>
              <option>Dikirim</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>

            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option>Semua Bayar</option>
              <option>Lunas</option>
              <option>Pending</option>
              <option>Gagal</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Produk
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pembayaran
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-950">
                        {order.id}
                      </p>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </td>

                    <td className="py-4">
                      <p className="text-sm font-semibold text-slate-950">
                        {order.customer}
                      </p>
                      <p className="text-xs text-slate-500">{order.email}</p>
                    </td>

                    <td className="max-w-[220px] py-4 text-sm text-slate-700">
                      <p className="truncate">{order.product}</p>
                    </td>

                    <td className="py-4 text-sm font-semibold text-slate-950">
                      {order.total}
                    </td>

                    <td className="py-4">
                      <PaymentBadge status={order.payment} />
                    </td>

                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="py-4">
                      <div className="flex gap-2">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                          <AdminIcon name="eye" size={17} />
                        </button>

                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                          <AdminIcon name="edit" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Pesanan Prioritas"
              description="Butuh verifikasi atau proses lanjut."
            />

            <div className="space-y-4">
              {priorityOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-950">
                        {order.id}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {order.customer}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {order.product}
                      </p>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <p className="text-sm font-semibold text-slate-950">
                      {order.total}
                    </p>
                    <PaymentBadge status={order.payment} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Ringkasan Status"
              description="Distribusi pesanan saat ini."
            />

            <div className="space-y-4">
              <MiniProgress
                label="Menunggu"
                count="18 order"
                value={36}
                color={theme.warning}
              />
              <MiniProgress
                label="Diproses"
                count="46 order"
                value={62}
                color={theme.primary}
              />
              <MiniProgress
                label="Dikirim"
                count="28 order"
                value={48}
                color={theme.blue}
              />
              <MiniProgress
                label="Selesai"
                count="275 order"
                value={86}
                color={theme.success}
              />
              <MiniProgress
                label="Dibatalkan"
                count="7 order"
                value={18}
                color={theme.danger}
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Catatan Admin"
              description="Prioritas operasional hari ini."
            />

            <div className="space-y-3">
              {[
                'Verifikasi pembayaran pending',
                'Update resi pengiriman',
                'Cek pesanan belum diproses',
              ].map((task) => (
                <label
                  key={task}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <input type="checkbox" className="mt-1 accent-violet-600" />
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