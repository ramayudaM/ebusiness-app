import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import SectionHeader from '../components/SectionHeader'
import Progress from '../components/Progress'
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

function ReportBadge({ status }) {
  const style = {
    Naik: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Stabil: 'bg-blue-50 text-blue-700 border-blue-100',
    Turun: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Stabil
      }`}
    >
      {status}
    </span>
  )
}

export default function AdminReportsPage() {
  const sales = [
    { day: 'Sen', value: 44 },
    { day: 'Sel', value: 68 },
    { day: 'Rab', value: 52 },
    { day: 'Kam', value: 86 },
    { day: 'Jum', value: 61 },
    { day: 'Sab', value: 94 },
    { day: 'Min', value: 78 },
  ]

  const topProducts = [
    {
      name: 'Yamaha Acoustic Guitar',
      category: 'Guitar',
      sold: 42,
      revenue: 'Rp98.700.000',
      status: 'Naik',
    },
    {
      name: 'Roland GO:KEYS',
      category: 'Keyboard',
      sold: 31,
      revenue: 'Rp145.700.000',
      status: 'Naik',
    },
    {
      name: 'Shure SM58 Microphone',
      category: 'Microphone',
      sold: 25,
      revenue: 'Rp31.250.000',
      status: 'Stabil',
    },
    {
      name: 'Focusrite Scarlett Solo',
      category: 'Audio Interface',
      sold: 18,
      revenue: 'Rp37.800.000',
      status: 'Turun',
    },
  ]

  return (
    <AdminLayout
      activeMenu="reports"
      breadcrumb="Admin Panel / Reports"
      title="Laporan & Analitik"
      searchPlaceholder="Cari laporan, produk, kategori..."
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
              Laporan penjualan aktif
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Pantau performa bisnis dan perkembangan toko secara menyeluruh.
            </h2>

            <p className="mt-3 max-w-2xl leading-relaxed text-white/65">
              Lihat ringkasan revenue, transaksi, produk terlaris, kategori populer,
              dan indikator performa utama toko NadaKita.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Growth</p>
              <h3 className="mt-1 text-xl font-bold">+21.7%</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">AOV</p>
              <h3 className="mt-1 text-xl font-bold">Rp720k</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Target</p>
              <h3 className="mt-1 text-xl font-bold">78%</h3>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="Rp24.5jt"
          note="Bulan ini"
          icon="revenue"
          color={theme.warning}
        />

        <StatCard
          title="Total Order"
          value="349"
          note="Semua transaksi"
          icon="order"
          color={theme.blue}
        />

        <StatCard
          title="Conversion Rate"
          value="8.4%"
          note="Dari total visitor"
          icon="chart"
          color={theme.success}
        />

        <StatCard
          title="Target Tercapai"
          value="78%"
          note="Dari target bulanan"
          icon="target"
          color={theme.primary}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.55fr]">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Tren Penjualan Mingguan"
              description="Performa transaksi selama 7 hari terakhir."
              action={
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
                  <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm">
                    Minggu
                  </button>
                  <button className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500">
                    Bulan
                  </button>
                </div>
              }
            />

            <div className="grid h-72 grid-cols-7 items-end gap-3 md:gap-5">
              {sales.map((item) => (
                <div key={item.day} className="flex h-full flex-col justify-end">
                  <div className="flex h-full items-end">
                    <div
                      className="w-full origin-bottom rounded-t-[18px] transition hover:scale-y-105"
                      style={{
                        height: `${item.value}%`,
                        background: `linear-gradient(180deg, ${theme.primary}, ${theme.primaryDark})`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold text-slate-500">
                    {item.day}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Produk dengan Performa Terbaik"
              description="Produk yang menghasilkan penjualan tertinggi."
              action={
                <button className="hidden items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:inline-flex">
                  <AdminIcon name="filter" size={18} />
                  Filter
                </button>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Produk
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Kategori
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Terjual
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Revenue
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topProducts.map((product) => (
                    <tr
                      key={product.name}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="py-4">
                        <p className="text-sm font-semibold text-slate-950">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Produk alat musik
                        </p>
                      </td>

                      <td className="py-4 text-sm text-slate-700">
                        {product.category}
                      </td>

                      <td className="py-4 text-sm font-semibold text-slate-950">
                        {product.sold}
                      </td>

                      <td className="py-4 text-sm font-semibold text-slate-950">
                        {product.revenue}
                      </td>

                      <td className="py-4">
                        <ReportBadge status={product.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Target Bulanan"
              description="Progress revenue terhadap target."
            />

            <Progress label="Progress Target" value={78} color={theme.primary} />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Target</p>
                <h4 className="mt-1 font-bold text-slate-950">Rp31.5jt</h4>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <p className="text-xs text-purple-600">Tercapai</p>
                <h4 className="mt-1 font-bold text-purple-800">Rp24.5jt</h4>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Performa Kategori"
              description="Kategori produk dengan kontribusi terbaik."
            />

            <div className="space-y-4">
              <MiniProgress
                label="Guitar"
                count="42%"
                value={82}
                color={theme.primary}
              />
              <MiniProgress
                label="Keyboard"
                count="28%"
                value={67}
                color={theme.blue}
              />
              <MiniProgress
                label="Microphone"
                count="18%"
                value={54}
                color={theme.success}
              />
              <MiniProgress
                label="Accessories"
                count="12%"
                value={38}
                color={theme.warning}
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Metode Pembayaran"
              description="Distribusi pembayaran customer."
            />

            <div className="space-y-4">
              <MiniProgress
                label="Transfer Bank"
                count="46%"
                value={76}
                color={theme.blue}
              />
              <MiniProgress
                label="E-Wallet"
                count="34%"
                value={62}
                color={theme.primary}
              />
              <MiniProgress
                label="Virtual Account"
                count="20%"
                value={44}
                color={theme.success}
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Catatan Laporan"
              description="Insight singkat untuk admin."
            />

            <div className="space-y-3">
              {[
                'Kategori Guitar masih menjadi kontributor terbesar',
                'Revenue bulan ini sudah mencapai 78% target',
                'E-wallet meningkat dibanding periode sebelumnya',
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