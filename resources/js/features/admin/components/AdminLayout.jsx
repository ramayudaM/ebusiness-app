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
        className={`relative flex shrink-0 items-center justify-center rounded-2xl font-bold shadow-sm ${compact ? 'h-10 w-10 text-sm' : 'h-11 w-11 text-base'
          }`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.brass})`,
          color: '#FFFFFF',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        A
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      {!compact && (
        <div className="min-w-0" style={{ fontFamily: "'Manrope', sans-serif" }}>
          <p className="truncate text-sm font-bold leading-none" style={{ color: theme.textPrimary }}>
            Admin NadaKita
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
            Sonic Control Room
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
    <div className="flex h-full flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div
        className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
      >
        <a
          href="/admin/dashboard"
          className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''
            }`}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.brass})`,
              boxShadow: `0 10px 25px ${theme.primaryGlow}`,
            }}
          >
            ♪
          </div>

          {!sidebarCollapsed && (
            <div>
              <h2 className="text-base font-bold leading-none text-white tracking-tight">
                NadaKita
              </h2>
              <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
                Sonic Control Room
              </p>
            </div>
          )}
        </a>

        <button
          type="button"
          onClick={onCloseMobile}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition hover:bg-white/10 xl:hidden"
        >
          <AdminIcon name="x" />
        </button>

        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white xl:flex"
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
                <p className="mb-3 px-4 text-[9px] font-bold uppercase tracking-[0.28em] text-white/25">
                  {group.label}
                </p>
              )}

              <nav className="space-y-1">
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

      <div className="border-t border-white/8 pt-5">
        {!sidebarCollapsed ? (
          <div className="space-y-3">
            <a
              href="/admin/settings"
              className="block rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.brass})`,
                  }}
                >
                  A
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    Admin NadaKita
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/30">
                    Master Access
                  </p>
                </div>
              </div>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/45 transition hover:bg-white/5 hover:text-white"
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
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
              title="Tampilkan sidebar"
            >
              <AdminIcon name="chevronRight" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
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
  const sidebarWidth = sidebarCollapsed ? 'xl:ml-[96px]' : 'xl:ml-[280px]'

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
      className="min-h-screen"
      style={{
        backgroundColor: isDark ? '#080E1A' : theme.background,
        color: isDark ? '#E8E4DE' : theme.textPrimary,
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm xl:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col p-5 text-white shadow-2xl transition-all duration-300 xl:flex ${sidebarCollapsed ? 'w-[96px]' : 'w-[280px]'
          }`}
        style={{
          background: `linear-gradient(180deg, ${theme.sidebar} 0%, ${theme.navyDark} 100%)`,
          borderRight: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] p-5 text-white shadow-2xl transition-transform duration-300 xl:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          background: `linear-gradient(180deg, ${theme.sidebar} 0%, ${theme.navyDark} 100%)`,
          borderRight: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <SidebarContent
          activeMenu={activeMenu}
          sidebarCollapsed={false}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${sidebarWidth}`}>
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            backgroundColor: isDark ? 'rgba(8,14,26,0.88)' : `${theme.background}EE`,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.borderSoft,
          }}
        >
          <div className="flex h-[72px] items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition hover:shadow-md xl:hidden"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                  color: isDark ? '#E8E4DE' : theme.textSecondary,
                }}
              >
                <AdminIcon name="menu" />
              </button>

              {sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition hover:shadow-md xl:flex"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                    color: isDark ? '#E8E4DE' : theme.textSecondary,
                  }}
                  title="Tampilkan sidebar"
                >
                  <AdminIcon name="chevronRight" />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {breadcrumbItems.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.15em]"
                        style={{
                          color: index === breadcrumbItems.length - 1
                            ? theme.primary
                            : isDark ? 'rgba(255,255,255,0.3)' : theme.textMuted,
                        }}
                      >
                        {item}
                      </span>

                      {index < breadcrumbItems.length - 1 && (
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.15)' : theme.textMuted }}>›</span>
                      )}
                    </div>
                  ))}
                </div>

                <h1
                  className="mt-0.5 truncate text-lg font-bold tracking-tight"
                  style={{ color: isDark ? '#FFFFFF' : theme.textPrimary }}
                >
                  {title}
                </h1>
              </div>
            </div>

            {/* Search */}
            <div className="hidden max-w-md flex-1 lg:flex">
              <div
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 transition-all focus-within:shadow-md"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.border,
                }}
              >
                <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : theme.textMuted }}>
                  <AdminIcon name="search" />
                </span>

                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full border-0 bg-transparent text-sm font-medium outline-none ring-0 placeholder:font-normal focus:border-0 focus:outline-none focus:ring-0"
                  style={{
                    color: isDark ? '#E8E4DE' : theme.textPrimary,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition hover:shadow-md"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                  color: isDark ? '#E8E4DE' : theme.textSecondary,
                }}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                <AdminIcon name={isDark ? 'sun' : 'moon'} />
              </button>

              <a
                href="/admin/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition hover:shadow-md"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                  color: isDark ? '#E8E4DE' : theme.textSecondary,
                }}
                title="Notifikasi"
              >
                <AdminIcon name="bell" />
                <span
                  className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2"
                  style={{ 
                    backgroundColor: theme.primary,
                    borderColor: isDark ? '#080E1A' : theme.background,
                  }}
                />
              </a>

              <div className="hidden h-8 w-px md:block" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : theme.borderSoft }} />

              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="hidden items-center gap-3 rounded-xl border px-3 py-1.5 shadow-sm transition hover:shadow-md md:flex"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                }}
              >
                <AdminAvatar />
                <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : theme.textMuted }}>
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
                <div
                  className="absolute right-0 top-14 z-50 w-[260px] overflow-hidden rounded-2xl border shadow-2xl"
                  style={{
                    backgroundColor: isDark ? '#10182A' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.border,
                  }}
                >
                  <div className="p-4" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : theme.borderSoft}` }}>
                    <AdminAvatar />
                  </div>

                  <div className="p-1.5">
                    {[
                      { href: '/admin/settings', icon: 'profile', label: 'Profil Admin' },
                      { href: '/admin/settings', icon: 'settings', label: 'Pengaturan' },
                      { href: '/admin/notifications', icon: 'bell', label: 'Notifikasi' },
                    ].map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition"
                        style={{ color: isDark ? '#E8E4DE' : theme.textPrimary }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : theme.surfaceSoft}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <AdminIcon name={item.icon} />
                        {item.label}
                      </a>
                    ))}

                    <button
                      type="button"
                      onClick={handleToggleTheme}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition"
                      style={{ color: isDark ? '#E8E4DE' : theme.textPrimary }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : theme.surfaceSoft}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <AdminIcon name={isDark ? 'sun' : 'moon'} />
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>

                  <div className="p-1.5" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : theme.borderSoft}` }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-bold transition hover:bg-red-500/10"
                      style={{ color: theme.danger }}
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

        <section className="mx-auto max-w-[1440px] space-y-6 p-4 md:p-8">
          {children}
        </section>
      </main>
    </div>
  )
}