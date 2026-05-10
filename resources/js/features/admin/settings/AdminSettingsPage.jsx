import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'

function readAdminStorage() {
  try {
    const raw = localStorage.getItem('admin-auth-storage')
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return parsed?.state?.admin || parsed?.admin || parsed?.user || null
  } catch {
    return null
  }
}

function SettingCard({ icon, title, description, children }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: theme.primarySoft,
            color: theme.primary,
          }}
        >
          <AdminIcon name={icon} size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
            {description}
          </p>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default function AdminSettingsPage() {
  const admin = useMemo(() => readAdminStorage(), [])
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('admin_theme_mode') || 'light'
  )

  const adminName = admin?.name || 'Admin NadaKita'
  const adminEmail = admin?.email || 'admin@nadakita.local'
  const adminRole = admin?.role || 'admin'

  const changeTheme = (mode) => {
    setThemeMode(mode)
    localStorage.setItem('admin_theme_mode', mode)
  }

  return (
    <AdminLayout
      activeMenu="settings"
      breadcrumb="Admin / Pengaturan"
      title="Pengaturan Admin"
      searchPlaceholder="Cari pengaturan..."
    >
      <section
        className="relative overflow-hidden rounded-[34px] p-7 text-white shadow-sm md:p-8"
        style={{
          background: `linear-gradient(135deg, ${theme.navyDark}, ${theme.navy} 58%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Admin profile & preferences
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Kelola profil, tampilan, dan preferensi admin.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 md:text-[15px]">
              Halaman ini disiapkan untuk pengaturan admin panel NadaKita agar
              lebih nyaman digunakan dalam operasional toko.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-[24px] text-2xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                }}
              >
                {adminName.slice(0, 1).toUpperCase()}
              </div>

              <div>
                <p className="text-lg font-black text-white">{adminName}</p>
                <p className="mt-1 text-sm font-medium text-white/55">
                  {adminEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] text-4xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                }}
              >
                {adminName.slice(0, 1).toUpperCase()}
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                {adminName}
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {adminEmail}
              </p>

              <span
                className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide"
                style={{
                  backgroundColor: theme.primarySoft,
                  color: theme.primary,
                }}
              >
                {adminRole}
              </span>
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Status Sistem
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-bold text-slate-600">
                  Login Admin
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  Aktif
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-bold text-slate-600">
                  Theme Mode
                </span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                  {themeMode}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <SettingCard
            icon="profile"
            title="Informasi Profil"
            description="Data dasar akun admin yang sedang digunakan."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Nama
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {adminName}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Email
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {adminEmail}
                </p>
              </div>
            </div>
          </SettingCard>

          <SettingCard
            icon="settings"
            title="Preferensi Tampilan"
            description="Atur mode tampilan admin panel sesuai kebutuhan."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => changeTheme('light')}
                className={`rounded-[24px] border p-5 text-left transition ${
                  themeMode === 'light'
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AdminIcon name="sun" />
                  <p className="font-black text-slate-950">Light Mode</p>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Tampilan terang untuk penggunaan harian.
                </p>
              </button>

              <button
                type="button"
                onClick={() => changeTheme('dark')}
                className={`rounded-[24px] border p-5 text-left transition ${
                  themeMode === 'dark'
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AdminIcon name="moon" />
                  <p className="font-black text-slate-950">Dark Mode</p>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Tampilan gelap untuk layar kerja malam.
                </p>
              </button>
            </div>
          </SettingCard>

          <SettingCard
            icon="shield"
            title="Keamanan Akun"
            description="Pengaturan keamanan admin panel."
          >
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-black text-amber-800">
                Catatan Pengembangan
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-amber-700">
                Fitur ubah password dan manajemen admin dapat ditambahkan setelah
                backend akun admin disiapkan.
              </p>
            </div>
          </SettingCard>
        </div>
      </section>
    </AdminLayout>
  )
}