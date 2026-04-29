import { useState } from 'react'
import AdminIcon from './AdminIcon'
import SidebarItem from './SidebarItem'

const theme = {
  primary: '#7F56D9',
  primaryDark: '#53389E',
  navy: '#101828',
  dark: '#1D2939',
}

export default function AdminLayout({
  children,
  activeMenu = 'dashboard',
  breadcrumb = 'Admin Panel / Dashboard',
  title = 'Dashboard Overview',
  searchPlaceholder = 'Cari produk, pesanan, customer...',
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarOffset = sidebarCollapsed ? 'xl:ml-[88px]' : 'xl:ml-[260px]'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/10 p-4 text-white transition-all duration-300 xl:flex ${
          sidebarCollapsed ? 'w-[88px]' : 'w-[260px]'
        }`}
        style={{
          background: `linear-gradient(180deg, ${theme.navy}, ${theme.dark})`,
        }}
      >
        <div>
          <div
            className={`mb-8 flex items-center ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white font-black text-purple-700 shadow-sm">
                N
              </div>

              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-lg font-bold leading-none">NadaKita</h2>
                  <p className="mt-1 text-xs text-white/45">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon="dashboard"
              label="Dashboard"
              active={activeMenu === 'dashboard'}
              collapsed={sidebarCollapsed}
              href="/admin/dashboard"
            />
            <SidebarItem
              icon="product"
              label="Produk"
              active={activeMenu === 'products'}
              collapsed={sidebarCollapsed}
              href="/admin/products"
            />
            <SidebarItem
              icon="order"
              label="Pesanan"
              active={activeMenu === 'orders'}
              collapsed={sidebarCollapsed}
              href="/admin/orders"
            />
            <SidebarItem
              icon="customer"
              label="Customer"
              active={activeMenu === 'customers'}
              collapsed={sidebarCollapsed}
              href="/admin/customers"
            />
            <SidebarItem
              icon="chart"
              label="Laporan"
              active={activeMenu === 'reports'}
              collapsed={sidebarCollapsed}
              href="/admin/reports"
            />
          </nav>
        </div>
      </aside>

      <main className={`min-h-screen transition-all duration-300 ${sidebarOffset}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#F8FAFC]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 xl:flex"
              >
                <AdminIcon name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'} />
              </button>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  {breadcrumb}
                </p>
                <h1 className="truncate text-xl font-bold text-slate-950 md:text-2xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="hidden max-w-xl flex-1 lg:flex">
              <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-slate-400">
                  <AdminIcon name="search" />
                </span>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                <AdminIcon name="bell" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-[10px] text-white">
                  3
                </span>
              </button>

              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold leading-none text-slate-900">
                    Admin
                  </p>
                  <p className="mt-1 text-xs text-slate-500">NadaKita</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1700px] space-y-6 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}