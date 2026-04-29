import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import SectionHeader from '../components/SectionHeader'
import AdminIcon from '../components/AdminIcon'

const theme = {
  primary: '#7F56D9',
  success: '#12B76A',
  warning: '#F79009',
  danger: '#F04438',
  blue: '#2E90FA',
  navy: '#101828',
  dark: '#1D2939',
  primaryDark: '#53389E',
}

function StatusBadge({ status }) {
  const style = {
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Draft: 'bg-slate-50 text-slate-600 border-slate-200',
    'Stok Rendah': 'bg-amber-50 text-amber-700 border-amber-100',
    Habis: 'bg-rose-50 text-rose-700 border-rose-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Draft
      }`}
    >
      {status}
    </span>
  )
}

export default function AdminProductsPage() {
  const products = [
    {
      id: 'PRD-001',
      name: 'Yamaha Acoustic Guitar',
      category: 'Guitar',
      price: 'Rp2.350.000',
      stock: 14,
      sold: 42,
      status: 'Aktif',
      image: '/images/guitar.jpg',
    },
    {
      id: 'PRD-002',
      name: 'Roland GO:KEYS',
      category: 'Keyboard',
      price: 'Rp4.700.000',
      stock: 9,
      sold: 31,
      status: 'Aktif',
      image: '/images/keyboard.jpg',
    },
    {
      id: 'PRD-003',
      name: 'Shure SM58 Microphone',
      category: 'Microphone',
      price: 'Rp1.250.000',
      stock: 7,
      sold: 25,
      status: 'Stok Rendah',
      image: '/images/microphone.jpg',
    },
    {
      id: 'PRD-004',
      name: 'Focusrite Scarlett Solo',
      category: 'Audio Interface',
      price: 'Rp2.100.000',
      stock: 5,
      sold: 18,
      status: 'Stok Rendah',
      image: '/images/audio-interface.jpg',
    },
    {
      id: 'PRD-005',
      name: 'Drum Stick Vic Firth',
      category: 'Accessories',
      price: 'Rp220.000',
      stock: 0,
      sold: 54,
      status: 'Habis',
      image: '/images/drum-stick.jpg',
    },
  ]

  const priorityProducts = products.filter((product) => product.status !== 'Aktif')

  return (
    <AdminLayout
      activeMenu="products"
      breadcrumb="Admin Panel / Products"
      title="Manajemen Produk"
      searchPlaceholder="Cari produk, kategori, stok..."
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-[32px] p-7 text-white shadow-sm md:p-8"
        style={{
          background: `linear-gradient(135deg, ${theme.navy}, ${theme.dark} 55%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/75">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Katalog produk aktif
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Kelola katalog produk dengan lebih rapi dan efisien.
            </h2>

            <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
              Pantau stok, harga, status produk, dan performa penjualan produk
              dalam satu halaman admin yang clean dan profesional.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50">
            <AdminIcon name="plus" />
            Tambah Produk
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Produk"
          value="128"
          note="Semua produk katalog"
          icon="box"
          color={theme.blue}
        />

        <StatCard
          title="Produk Aktif"
          value="116"
          note="Produk tampil di katalog"
          icon="product"
          color={theme.success}
        />

        <StatCard
          title="Stok Rendah"
          value="12"
          note="Butuh perhatian admin"
          icon="alert"
          color={theme.warning}
        />

        <StatCard
          title="Produk Habis"
          value="5"
          note="Perlu restock segera"
          icon="alert"
          color={theme.danger}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Daftar Produk"
              description="Kelola produk, harga, stok, dan status katalog."
              action={
                <button className="hidden items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:inline-flex">
                  <AdminIcon name="plus" size={18} />
                  Tambah Produk
                </button>
              }
            />

            {/* FILTER BAR */}
            <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_160px]">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-slate-400">
                  <AdminIcon name="search" />
                </span>
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
                <option>Semua Kategori</option>
                <option>Guitar</option>
                <option>Keyboard</option>
                <option>Microphone</option>
                <option>Accessories</option>
              </select>

              <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <AdminIcon name="filter" size={18} />
                Filter
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Produk
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Kategori
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Harga
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stok
                    </th>
                    <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Terjual
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
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-950">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">{product.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-sm text-slate-700">
                        {product.category}
                      </td>

                      <td className="py-4 text-sm font-semibold text-slate-950">
                        {product.price}
                      </td>

                      <td className="py-4 text-sm text-slate-700">
                        {product.stock} unit
                      </td>

                      <td className="py-4 text-sm text-slate-700">
                        {product.sold}
                      </td>

                      <td className="py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                            <AdminIcon name="eye" size={17} />
                          </button>

                          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                            <AdminIcon name="edit" size={17} />
                          </button>

                          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50">
                            <AdminIcon name="trash" size={17} />
                          </button>
                        </div>
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
              title="Produk Prioritas"
              description="Produk yang perlu segera dicek."
            />

            <div className="space-y-4">
              {priorityProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Stok tersisa {product.stock} unit
                      </p>
                      <div className="mt-3">
                        <StatusBadge status={product.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Kategori Produk"
              description="Ringkasan jumlah produk per kategori."
            />

            <div className="space-y-4">
              {[
                ['Guitar', 42, theme.primary],
                ['Keyboard', 28, theme.blue],
                ['Microphone', 24, theme.success],
                ['Accessories', 34, theme.warning],
              ].map(([category, count, color]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{category}</span>
                    <span className="font-semibold text-slate-950">
                      {count} produk
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(Number(count) * 2, 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Catatan Admin"
              description="Checklist singkat untuk pengelolaan produk."
            />

            <div className="space-y-3">
              {[
                'Update gambar produk yang masih kosong',
                'Cek ulang harga produk promo',
                'Restock produk dengan stok rendah',
                'Rapikan kategori produk baru',
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