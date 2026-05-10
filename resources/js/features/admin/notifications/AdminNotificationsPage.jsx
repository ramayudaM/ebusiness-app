import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'

const initialNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'Pesanan baru masuk',
    description: 'Ada pesanan baru yang perlu diverifikasi oleh admin.',
    time: 'Baru saja',
    status: 'unread',
    tone: 'blue',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Pembayaran menunggu konfirmasi',
    description: 'Beberapa pembayaran customer masih perlu dicek statusnya.',
    time: '10 menit lalu',
    status: 'unread',
    tone: 'orange',
  },
  {
    id: 3,
    type: 'stock',
    title: 'Stok produk mulai rendah',
    description: 'Cek stok produk agar katalog tetap tersedia untuk customer.',
    time: 'Hari ini',
    status: 'read',
    tone: 'red',
  },
  {
    id: 4,
    type: 'review',
    title: 'Ulasan customer baru',
    description: 'Ada ulasan baru yang masuk dan bisa dimoderasi.',
    time: 'Kemarin',
    status: 'read',
    tone: 'green',
  },
]

function getToneStyle(tone) {
  const tones = {
    blue: {
      bg: theme.blueSoft,
      color: theme.blue,
      icon: 'order',
    },
    orange: {
      bg: theme.primarySoft,
      color: theme.primary,
      icon: 'revenue',
    },
    red: {
      bg: theme.dangerSoft,
      color: theme.danger,
      icon: 'alert',
    },
    green: {
      bg: theme.successSoft,
      color: theme.success,
      icon: 'review',
    },
  }

  return tones[tone] || tones.blue
}

function NotificationCard({ notification, onMarkRead }) {
  const tone = getToneStyle(notification.tone)
  const unread = notification.status === 'unread'

  return (
    <article
      className={`rounded-[28px] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        unread ? 'border-orange-100' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: tone.bg,
              color: tone.color,
            }}
          >
            <AdminIcon name={tone.icon} size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-slate-950">
                {notification.title}
              </h3>

              {unread && (
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide"
                  style={{
                    backgroundColor: theme.primarySoft,
                    color: theme.primary,
                  }}
                >
                  Baru
                </span>
              )}
            </div>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              {notification.description}
            </p>

            <p className="mt-3 text-xs font-bold text-slate-400">
              {notification.time}
            </p>
          </div>
        </div>

        {unread && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tandai Dibaca
          </button>
        )}
      </div>
    </article>
  )
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((item) => item.status === 'unread')
    }

    if (filter === 'read') {
      return notifications.filter((item) => item.status === 'read')
    }

    return notifications
  }, [notifications, filter])

  const unreadCount = notifications.filter((item) => item.status === 'unread').length

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'read' } : item
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'read',
      }))
    )
  }

  return (
    <AdminLayout
      activeMenu="notifications"
      breadcrumb="Admin / Notifikasi"
      title="Notifikasi Admin"
      searchPlaceholder="Cari notifikasi..."
    >
      <section
        className="relative overflow-hidden rounded-[34px] p-7 text-white shadow-sm md:p-8"
        style={{
          background: `linear-gradient(135deg, ${theme.navyDark}, ${theme.navy} 58%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Admin notification center
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Pantau aktivitas penting toko dalam satu halaman.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 md:text-[15px]">
              Notifikasi ini membantu admin memantau pesanan, pembayaran, stok,
              dan ulasan customer dengan lebih cepat.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            <AdminIcon name="check" size={18} />
            Tandai Semua Dibaca
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-[26px] border p-5 text-left shadow-sm transition ${
            filter === 'all'
              ? 'border-orange-200 bg-orange-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Semua
          </p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">
            {notifications.length}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Total notifikasi
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`rounded-[26px] border p-5 text-left shadow-sm transition ${
            filter === 'unread'
              ? 'border-orange-200 bg-orange-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Belum Dibaca
          </p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">
            {unreadCount}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Perlu dicek admin
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter('read')}
          className={`rounded-[26px] border p-5 text-left shadow-sm transition ${
            filter === 'read'
              ? 'border-orange-200 bg-orange-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Dibaca
          </p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">
            {notifications.length - unreadCount}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sudah ditinjau
          </p>
        </button>
      </section>

      <section className="space-y-4">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={markAsRead}
          />
        ))}
      </section>
    </AdminLayout>
  )
}