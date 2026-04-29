import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import Progress from '../components/Progress'
import SectionHeader from '../components/SectionHeader'

const theme = {
  primary: '#7F56D9',
  primaryDark: '#53389E',
  navy: '#101828',
  dark: '#1D2939',
  success: '#12B76A',
  warning: '#F79009',
  blue: '#2E90FA',
}

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Produk',
      value: '128',
      change: '+12.4%',
      note: 'bulan ini',
      icon: 'product',
      color: theme.blue,
    },
    {
      title: 'Pesanan Masuk',
      value: '349',
      change: '+18.2%',
      note: 'minggu ini',
      icon: 'order',
      color: theme.success,
    },
    {
      title: 'Customer Aktif',
      value: '1.284',
      change: '+9.8%',
      note: 'customer baru',
      icon: 'customer',
      color: theme.primary,
    },
    {
      title: 'Revenue',
      value: 'Rp24.5jt',
      change: '+21.7%',
      note: 'lebih tinggi',
      icon: 'revenue',
      color: theme.warning,
    },
  ]

  const sales = [
    { day: 'Sen', value: 42 },
    { day: 'Sel', value: 68 },
    { day: 'Rab', value: 54 },
    { day: 'Kam', value: 86 },
    { day: 'Jum', value: 63 },
    { day: 'Sab', value: 95 },
    { day: 'Min', value: 74 },
  ]

  const orders = [
    ['#NK-1024', 'Aulia Ramadhani', 'Yamaha Acoustic Guitar', 'Rp2.350.000', 'Diproses'],
    ['#NK-1025', 'Rizky Ananda', 'Roland GO:KEYS', 'Rp4.700.000', 'Dikirim'],
    ['#NK-1026', 'Nabila Putri', 'Shure SM58 Microphone', 'Rp1.250.000', 'Selesai'],
    ['#NK-1027', 'Fajar Maulana', 'Focusrite Scarlett Solo', 'Rp2.100.000', 'Menunggu'],
  ]

  const products = [
    {
      name: 'Yamaha Acoustic Guitar',
      category: 'Guitar',
      sold: 42,
      stock: 14,
      image: '/images/guitar.jpg',
    },
    {
      name: 'Roland GO:KEYS',
      category: 'Keyboard',
      sold: 31,
      stock: 9,
      image: '/images/keyboard.jpg',
    },
    {
      name: 'Shure SM58 Microphone',
      category: 'Microphone',
      sold: 25,
      stock: 7,
      image: '/images/microphone.jpg',
    },
  ]

  const statusClass = {
    Selesai: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Dikirim: 'bg-blue-50 text-blue-700 border-blue-100',
    Diproses: 'bg-amber-50 text-amber-700 border-amber-100',
    Menunggu: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <AdminLayout
      activeMenu="dashboard"
      breadcrumb="Admin Panel / Dashboard"
      title="Dashboard Overview"
      searchPlaceholder="Cari produk, pesanan, customer..."
    >
      {/* HERO */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div
          className="relative overflow-hidden rounded-[32px] p-7 text-white shadow-sm md:p-8"
          style={{
            background: `linear-gradient(135deg, ${theme.navy}, ${theme.dark} 55%, ${theme.primaryDark})`,
          }}
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/75">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Sistem toko aktif
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Kelola toko musik dengan dashboard yang clean dan efisien.
            </h2>

            <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
              Pantau penjualan, produk, pesanan, stok, dan performa kategori
              dalam satu tampilan admin yang ringkas dan profesional.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Conversion</p>
                <h3 className="mt-1 text-xl font-bold">8.4%</h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Avg Order</p>
                <h3 className="mt-1 text-xl font-bold">Rp720k</h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Visitors</p>
                <h3 className="mt-1 text-xl font-bold">12.4k</h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/50">Orders</p>
                <h3 className="mt-1 text-xl font-bold">349</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="h-56 bg-slate-200">
            <img
              src="/images/admin-hero.jpg"
              alt="NadaKita"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6">
            <p className="text-sm text-slate-500">Highlight minggu ini</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">
              Guitar Series
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Kategori gitar menjadi kategori dengan penjualan tertinggi.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          {/* CHART */}
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Penjualan Mingguan"
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

          {/* ORDERS */}
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Pesanan Terbaru"
              description="Transaksi terbaru yang masuk ke sistem."
              action={
                <a
                  href="/admin/orders"
                  className="text-sm font-semibold text-purple-700 hover:underline"
                >
                  Lihat Semua
                </a>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
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
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(([id, customer, product, total, status]) => (
                    <tr
                      key={id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="py-4 text-sm font-bold text-slate-950">
                        {id}
                      </td>
                      <td className="py-4 text-sm text-slate-700">{customer}</td>
                      <td className="py-4 text-sm text-slate-700">{product}</td>
                      <td className="py-4 text-sm font-semibold text-slate-950">
                        {total}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Produk Unggulan"
              description="Produk dengan performa terbaik minggu ini."
              action={
                <a
                  href="/admin/products"
                  className="text-sm font-semibold text-purple-700 hover:underline"
                >
                  Kelola
                </a>
              }
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 transition hover:shadow-lg"
                >
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {product.category}
                        </p>
                      </div>

                      <span className="h-fit rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Terjual</p>
                        <h4 className="mt-1 font-bold text-slate-950">
                          {product.sold}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Stok</p>
                        <h4 className="mt-1 font-bold text-slate-950">
                          {product.stock}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Target Bulanan"
              description="Revenue bulan ini hampir mencapai target."
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
              description="Kategori produk paling aktif."
            />

            <div className="space-y-5">
              <Progress label="Guitar" value={82} color={theme.primary} />
              <Progress label="Keyboard" value={67} color={theme.blue} />
              <Progress label="Microphone" value={54} color={theme.success} />
              <Progress label="Accessories" value={38} color={theme.warning} />
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Task Admin"
              description="Checklist operasional hari ini."
            />

            <div className="space-y-3">
              {[
                'Cek stok produk terlaris',
                'Verifikasi pembayaran pending',
                'Review promo minggu ini',
                'Update banner katalog',
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

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Aktivitas Terbaru" />

            <div className="space-y-5">
              {[
                'Pesanan baru dari Aulia Ramadhani',
                'Produk Yamaha Acoustic Guitar diperbarui',
                'Pembayaran #NK-1026 berhasil diverifikasi',
                'Stok microphone tersisa 7 unit',
              ].map((activity) => (
                <div key={activity} className="flex gap-3">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {activity}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Baru saja</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}