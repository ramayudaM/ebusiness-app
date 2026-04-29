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
    Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Baru: 'bg-blue-50 text-blue-700 border-blue-100',
    Loyal: 'bg-violet-50 text-violet-700 border-violet-100',
    TidakAktif: 'bg-slate-50 text-slate-600 border-slate-200',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        style[status] || style.Aktif
      }`}
    >
      {status === 'TidakAktif' ? 'Tidak Aktif' : status}
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

export default function AdminCustomersPage() {
  const customers = [
    {
      id: 'CST-001',
      name: 'Aulia Ramadhani',
      email: 'aulia@email.com',
      phone: '0812-3456-7890',
      city: 'Jakarta',
      orders: 8,
      spent: 'Rp8.450.000',
      lastOrder: '30 Apr 2026',
      status: 'Loyal',
    },
    {
      id: 'CST-002',
      name: 'Rizky Ananda',
      email: 'rizky@email.com',
      phone: '0821-2222-7821',
      city: 'Bandung',
      orders: 5,
      spent: 'Rp6.250.000',
      lastOrder: '30 Apr 2026',
      status: 'Aktif',
    },
    {
      id: 'CST-003',
      name: 'Nabila Putri',
      email: 'nabila@email.com',
      phone: '0857-8888-1200',
      city: 'Surabaya',
      orders: 2,
      spent: 'Rp1.850.000',
      lastOrder: '29 Apr 2026',
      status: 'Baru',
    },
    {
      id: 'CST-004',
      name: 'Fajar Maulana',
      email: 'fajar@email.com',
      phone: '0813-9012-4400',
      city: 'Yogyakarta',
      orders: 3,
      spent: 'Rp3.100.000',
      lastOrder: '29 Apr 2026',
      status: 'Aktif',
    },
    {
      id: 'CST-005',
      name: 'Kevin Arya',
      email: 'kevin@email.com',
      phone: '0896-1111-3456',
      city: 'Medan',
      orders: 1,
      spent: 'Rp220.000',
      lastOrder: '12 Apr 2026',
      status: 'TidakAktif',
    },
  ]

  const priorityCustomers = customers.filter(
    (customer) => customer.status === 'Loyal' || customer.orders >= 5
  )

  return (
    <AdminLayout
      activeMenu="customers"
      breadcrumb="Admin Panel / Customers"
      title="Manajemen Customer"
      searchPlaceholder="Cari customer, email, kota..."
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
              Data customer aktif
            </div>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Kelola customer dan nilai transaksi dengan lebih terstruktur.
            </h2>

            <p className="mt-3 max-w-2xl leading-relaxed text-white/65">
              Pantau customer aktif, customer loyal, aktivitas pembelian, dan peluang
              follow-up dari satu halaman yang ringkas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Customer Baru</p>
              <h3 className="mt-1 text-xl font-bold">84</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Repeat Order</p>
              <h3 className="mt-1 text-xl font-bold">42%</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Avg Spend</p>
              <h3 className="mt-1 text-xl font-bold">Rp1.8jt</h3>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Customer"
          value="1.284"
          note="Semua customer"
          icon="customer"
          color={theme.blue}
        />

        <StatCard
          title="Customer Aktif"
          value="936"
          note="Aktif bulan ini"
          icon="chart"
          color={theme.success}
        />

        <StatCard
          title="Customer Loyal"
          value="214"
          note="Repeat order tinggi"
          icon="target"
          color={theme.primary}
        />

        <StatCard
          title="Tidak Aktif"
          value="134"
          note="Perlu follow-up"
          icon="alert"
          color={theme.warning}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.55fr]">
        {/* LEFT */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Daftar Customer"
            description="Kelola data customer dan riwayat aktivitas pembelian."
            action={
              <button className="hidden items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:inline-flex">
                <AdminIcon name="filter" size={18} />
                Filter
              </button>
            }
          />

          <div className="mb-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_170px_170px]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-slate-400">
                <AdminIcon name="search" />
              </span>
              <input
                type="text"
                placeholder="Cari nama, email, atau kota..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option>Semua Status</option>
              <option>Baru</option>
              <option>Aktif</option>
              <option>Loyal</option>
              <option>Tidak Aktif</option>
            </select>

            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
              <option>Semua Kota</option>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
              <option>Yogyakarta</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kontak
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kota
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Belanja
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
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-bold text-violet-700">
                          {customer.name.charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {customer.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {customer.id} • Order terakhir {customer.lastOrder}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <p className="text-sm text-slate-700">{customer.email}</p>
                      <p className="text-xs text-slate-500">{customer.phone}</p>
                    </td>

                    <td className="py-4 text-sm text-slate-700">
                      {customer.city}
                    </td>

                    <td className="py-4 text-sm font-semibold text-slate-950">
                      {customer.orders}
                    </td>

                    <td className="py-4 text-sm font-semibold text-slate-950">
                      {customer.spent}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={customer.status} />
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
              title="Customer Prioritas"
              description="Customer dengan repeat order atau nilai belanja tinggi."
            />

            <div className="space-y-4">
              {priorityCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-bold text-violet-700">
                      {customer.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {customer.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {customer.city} • {customer.email}
                          </p>
                        </div>

                        <StatusBadge status={customer.status} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                        <div>
                          <p className="text-xs text-slate-500">Order</p>
                          <p className="text-sm font-semibold text-slate-950">
                            {customer.orders}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Belanja</p>
                          <p className="text-sm font-semibold text-slate-950">
                            {customer.spent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Segmentasi Customer"
              description="Gambaran status customer saat ini."
            />

            <div className="space-y-4">
              <MiniProgress
                label="Customer Baru"
                count="84"
                value={34}
                color={theme.blue}
              />
              <MiniProgress
                label="Customer Aktif"
                count="936"
                value={82}
                color={theme.success}
              />
              <MiniProgress
                label="Customer Loyal"
                count="214"
                value={58}
                color={theme.primary}
              />
              <MiniProgress
                label="Tidak Aktif"
                count="134"
                value={28}
                color={theme.warning}
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              title="Catatan Admin"
              description="Prioritas pengelolaan customer."
            />

            <div className="space-y-3">
              {[
                'Follow-up customer tidak aktif',
                'Cek customer dengan repeat order tinggi',
                'Update data kontak customer',
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