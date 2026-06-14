import { useState } from 'react'
import AdminIcon from './AdminIcon'
import SidebarItem from './SidebarItem'
import { adminTheme as theme } from '../styles/adminTheme'

const menuGroups = [
  {
    label: 'Overview',
    items: [
      {
        icon: 'dashboard',
        label: 'Dashboard',
        activeKey: 'dashboard',
        href: '/admin/dashboard',
      },
    ],
  },
  {
    label: 'Operasional',
    items: [
      {
        icon: 'order',
        label: 'Pesanan',
        activeKey: 'orders',
        href: '/admin/orders',
      },
      {
        icon: 'product',
        label: 'Produk',
        activeKey: 'products',
        href: '/admin/products',
      },
      {
        icon: 'category',
        label: 'Kategori',
        activeKey: 'categories',
        href: '/admin/categories',
      },
    ],
  },
  {
    label: 'Customer',
    items: [
      {
        icon: 'customer',
        label: 'Customer',
        activeKey: 'customers',
        href: '/admin/customers',
      },
      {
        icon: 'review',
        label: 'Ulasan',
        activeKey: 'reviews',
        href: '/admin/reviews',
      },
    ],
  },
  {
    label: 'Insight',
    items: [
      {
        icon: 'chart',
        label: 'Laporan',
        activeKey: 'reports',
        href: '/admin/reports',
      },
    ],
  },
]

function AdminAvatar({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-2xl font-black shadow-sm ${
          compact ? 'h-10 w-10 text-sm' : 'h-11 w-11 text-base'
        }`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
          color: '#FFFFFF',
        }}
      >
        A
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-sm font-black leading-none text-white">
            Admin Nada
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
            Super Admin
          </p>
        </div>
      )}
    </div>
  )
}

function SidebarContent({
  activeMenu,
  sidebarCollapsed,
  onToggle,
  onCloseMobile,
}) {
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin-auth-storage')
    window.location.href = '/login'
  }

  return (
    <div className="relative z-10 flex h-full flex-col">
      <div
        className={`flex items-center ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <a
          href="/admin/dashboard"
          className={`flex items-center gap-3 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] font-black text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
              boxShadow: `0 14px 30px ${theme.primary}35`,
            }}
          >
            N
          </div>

          {!sidebarCollapsed && (
            <div>
              <h2 className="text-lg font-black leading-none text-white">
                NadaKita Admin
              </h2>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">
                Premium Curator
              </p>
            </div>
          )}
        </a>

        <button
          type="button"
          onClick={onCloseMobile}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/70 transition hover:bg-white/10 xl:hidden"
        >
          <AdminIcon name="x" />
        </button>

        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white xl:flex"
            title="Sembunyikan sidebar"
          >
            <AdminIcon name="chevronLeft" />
          </button>
        )}
      </div>

      <div
        className="mt-8 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/28">
                  {group.label}
                </p>
              )}

              <nav className="space-y-1.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.activeKey}
                    icon={item.icon}
                    label={item.label}
                    active={activeMenu === item.activeKey}
                    collapsed={sidebarCollapsed}
                    href={item.href}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        {!sidebarCollapsed ? (
          <div className="space-y-4">
            <a
              href="/admin/settings"
              className="block rounded-[24px] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                  }}
                >
                  A
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    Admin NadaKita
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-white/35">
                    Master Access
                  </p>
                </div>
              </div>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              <AdminIcon name="logout" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onToggle}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              title="Tampilkan sidebar"
            >
              <AdminIcon name="chevronRight" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              title="Keluar"
            >
              <AdminIcon name="logout" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
  activeMenu = 'dashboard',
  breadcrumb = 'Admin / Dashboard',
  title = 'Dashboard Overview',
  searchPlaceholder = 'Cari produk, pesanan, customer...',
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const sidebarWidth = sidebarCollapsed ? 'xl:ml-[96px]' : 'xl:ml-[292px]'

  const breadcrumbItems = String(breadcrumb)
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin-auth-storage')
    window.location.href = '/login'
  }

  return (
    <div
      className="admin-customer-skin relative min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-orange-500/30"
      style={{
        background:
          'radial-gradient(circle at 12% 18%, rgba(234,88,12,0.12), transparent 30%), radial-gradient(circle at 82% 8%, rgba(194,65,12,0.08), transparent 32%), #050505',
      }}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[8%] h-[42vw] w-[42vw] rounded-full bg-orange-600/5 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[8%] right-[4%] h-[50vw] w-[50vw] rounded-full bg-orange-700/5 blur-[150px] mix-blend-screen" />
      </div>

      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col overflow-hidden border-r border-zinc-900/80 p-5 text-white shadow-2xl transition-all duration-300 xl:flex ${
          sidebarCollapsed ? 'w-[96px]' : 'w-[292px]'
        }`}
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.98), rgba(5,5,5,0.98))',
          boxShadow: '24px 0 90px rgba(0,0,0,0.34)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-orange-600/10 blur-[110px]" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-orange-700/5 blur-[120px]" />
        </div>
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[292px] overflow-hidden border-r border-zinc-900/80 p-5 text-white shadow-2xl transition-transform duration-300 xl:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.98), rgba(5,5,5,0.98))',
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-orange-600/10 blur-[110px]" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-orange-700/5 blur-[120px]" />
        </div>
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={false}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      <main className={`relative z-10 min-h-screen transition-all duration-300 ${sidebarWidth}`}>
        <header
          className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#050505]/80 backdrop-blur-xl"
          style={{
            boxShadow: '0 20px 70px rgba(0,0,0,0.18)',
          }}
        >
          <div className="flex h-[76px] items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-sm transition hover:bg-zinc-800 xl:hidden"
              >
                <AdminIcon name="menu" />
              </button>

              {sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-sm transition hover:bg-zinc-800 xl:flex"
                  title="Tampilkan sidebar"
                >
                  <AdminIcon name="chevronRight" />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {breadcrumbItems.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-black uppercase tracking-[0.18em] ${
                          index === breadcrumbItems.length - 1
                            ? 'text-orange-600'
                            : 'text-zinc-500'
                        }`}
                      >
                        {item}
                      </span>

                      {index < breadcrumbItems.length - 1 && (
                        <span className="text-zinc-700">
                          ›
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <h1
                  className="mt-1 truncate text-lg font-black tracking-tight text-white md:text-2xl"
                >
                  {title}
                </h1>
              </div>
            </div>

            <div className="hidden max-w-xl flex-1 lg:flex">
              <div
                className="flex w-full items-center gap-3 rounded-[22px] border px-4 py-3 shadow-sm"
                style={{
                  backgroundColor: 'rgba(24,24,27,0.58)',
                  borderColor: 'rgba(63,63,70,0.72)',
                }}
              >
                <span className="text-zinc-500">
                  <AdminIcon name="search" />
                </span>

                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full border-0 bg-transparent text-sm font-semibold outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
                  style={{ color: '#FFFFFF' }}
                />
              </div>
            </div>

            <div className="relative flex items-center gap-3">
              <a
                href="/admin/notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-sm transition hover:bg-zinc-800"
                title="Notifikasi admin"
              >
                <AdminIcon name="bell" />
                <span
                  className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: theme.primary }}
                />
              </a>

              <div className="hidden h-9 w-px bg-zinc-800 md:block" />

              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="hidden items-center gap-3 rounded-[22px] border border-zinc-800 bg-zinc-900/80 px-3 py-2 shadow-sm transition hover:bg-zinc-800 md:flex"
              >
                <AdminAvatar />

                <span className="text-zinc-400 transition hover:text-white">
                  <AdminIcon name="chevronDown" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="md:hidden"
              >
                <AdminAvatar compact />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-[280px] overflow-hidden rounded-[26px] border border-zinc-800 bg-[#0A0A0A] shadow-2xl">
                  <div className="border-b border-zinc-900 p-4">
                    <AdminAvatar />
                  </div>

                  <div className="p-2">
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                    >
                      <AdminIcon name="profile" />
                      Profil Admin
                    </a>

                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                    >
                      <AdminIcon name="settings" />
                      Pengaturan
                    </a>

                    <a
                      href="/admin/notifications"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                    >
                      <AdminIcon name="bell" />
                      Notifikasi
                    </a>

                  </div>

                  <div className="border-t border-zinc-900 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <AdminIcon name="logout" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1480px] space-y-6 p-4 md:p-8">
          {children}
        </section>
      </main>
    </div>
  )
}
