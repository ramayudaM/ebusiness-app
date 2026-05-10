import { useEffect, useState } from 'react'
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
          <p className="truncate text-sm font-black leading-none text-slate-900">
            Admin Nada
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
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
    <div className="flex h-full flex-col">
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
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('admin_theme_mode') || 'light'
  )

  const isDark = themeMode === 'dark'
  const sidebarWidth = sidebarCollapsed ? 'xl:ml-[96px]' : 'xl:ml-[292px]'

  const breadcrumbItems = String(breadcrumb)
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('admin_theme_mode', next)
      return next
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin-auth-storage')
    window.location.href = '/login'
  }

  useEffect(() => {
    document.documentElement.classList.toggle('admin-dark', isDark)
  }, [isDark])

  return (
    <div
      className="min-h-screen text-slate-950"
      style={{
        backgroundColor: isDark ? '#0B1220' : theme.background,
      }}
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-white/10 p-5 text-white shadow-2xl transition-all duration-300 xl:flex ${
          sidebarCollapsed ? 'w-[96px]' : 'w-[292px]'
        }`}
        style={{
          background: `linear-gradient(180deg, ${theme.sidebar}, ${theme.navy})`,
        }}
      >
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[292px] border-r border-white/10 p-5 text-white shadow-2xl transition-transform duration-300 xl:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: `linear-gradient(180deg, ${theme.sidebar}, ${theme.navy})`,
        }}
      >
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={false}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      <main className={`min-h-screen transition-all duration-300 ${sidebarWidth}`}>
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.86)' : `${theme.background}E6`,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.8)',
          }}
        >
          <div className="flex h-[76px] items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 xl:hidden"
              >
                <AdminIcon name="menu" />
              </button>

              {sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 xl:flex"
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
                            : isDark
                              ? 'text-slate-500'
                              : 'text-slate-400'
                        }`}
                      >
                        {item}
                      </span>

                      {index < breadcrumbItems.length - 1 && (
                        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>
                          ›
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <h1
                  className="mt-1 truncate text-lg font-black tracking-tight md:text-2xl"
                  style={{ color: isDark ? '#FFFFFF' : theme.textPrimary }}
                >
                  {title}
                </h1>
              </div>
            </div>

            <div className="hidden max-w-xl flex-1 lg:flex">
              <div
                className="flex w-full items-center gap-3 rounded-[22px] border px-4 py-3 shadow-sm"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                }}
              >
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                  <AdminIcon name="search" />
                </span>

                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full border-0 bg-transparent text-sm font-semibold outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
                  style={{ color: isDark ? '#FFFFFF' : theme.textPrimary }}
                />
              </div>
            </div>

            <div className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                title={isDark ? 'Gunakan light mode' : 'Gunakan dark mode'}
              >
                <AdminIcon name={isDark ? 'sun' : 'moon'} />
              </button>

              <a
                href="/admin/notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                title="Notifikasi admin"
              >
                <AdminIcon name="bell" />
                <span
                  className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: theme.primary }}
                />
              </a>

              <div className="hidden h-9 w-px bg-slate-200 md:block" />

              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="hidden items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50 md:flex"
              >
                <AdminAvatar />

                <span className="text-slate-400 transition hover:text-slate-700">
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
                <div className="absolute right-0 top-14 z-50 w-[280px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 p-4">
                    <AdminAvatar />
                  </div>

                  <div className="p-2">
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <AdminIcon name="profile" />
                      Profil Admin
                    </a>

                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <AdminIcon name="settings" />
                      Pengaturan
                    </a>

                    <a
                      href="/admin/notifications"
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <AdminIcon name="bell" />
                      Notifikasi
                    </a>

                    <button
                      type="button"
                      onClick={handleToggleTheme}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <AdminIcon name={isDark ? 'sun' : 'moon'} />
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-rose-600 transition hover:bg-rose-50"
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