import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminIcon from '../components/AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminReviewService } from './adminReviewService'

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getUserName(review) {
  return review?.user?.name || 'Customer'
}

function getUserEmail(review) {
  return review?.user?.email || '-'
}

function getProductName(review) {
  return review?.product?.name || 'Produk tidak ditemukan'
}

function getProductSku(review) {
  return review?.product?.sku || '-'
}

function getInitials(name) {
  return String(name || 'Customer')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function RatingStars({ rating, large = false }) {
  const value = Number(rating || 0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`${large ? 'text-2xl' : 'text-lg'} leading-none ${
            index < value ? 'text-amber-400' : 'text-slate-200'
          }`}
        >
          ★
        </span>
      ))}

      <span className="ml-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
        {value}/5
      </span>
    </div>
  )
}

function VisibilityBadge({ visible }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${
        visible
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
          : 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      {visible ? 'Tampil' : 'Hidden'}
    </span>
  )
}

function MetricCard({ title, value, subtitle, icon, tone }) {
  const colorMap = {
    orange: {
      bg: theme.primarySoft,
      color: theme.primary,
    },
    green: {
      bg: '#ECFDF3',
      color: theme.success,
    },
    blue: {
      bg: '#EFF6FF',
      color: theme.blue,
    },
    amber: {
      bg: '#FFFBEB',
      color: theme.warning,
    },
    red: {
      bg: '#FEF2F2',
      color: theme.danger,
    },
  }

  const selected = colorMap[tone] || colorMap.orange

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {value}
          </h3>

          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: selected.bg,
            color: selected.color,
          }}
        >
          <AdminIcon name={icon} size={24} />
        </div>
      </div>
    </div>
  )
}

function FeaturedReview({ review }) {
  if (!review) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <div
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
            style={{
              backgroundColor: theme.primarySoft,
              color: theme.primary,
            }}
          >
            <AdminIcon name="review" size={28} />
          </div>

          <h3 className="text-xl font-black text-slate-950">
            Belum ada ulasan unggulan
          </h3>

          <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
            Ulasan dengan rating tertinggi akan muncul di bagian ini setelah data tersedia.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-[30px] p-6 text-white shadow-sm"
      style={{
        background: `linear-gradient(145deg, ${theme.navyDark || theme.navy}, ${theme.navy} 55%, ${theme.primaryDark})`,
      }}
    >
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-orange-400/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
          Ulasan Unggulan
        </p>

        <div className="mt-5">
          <RatingStars rating={review.rating} large />
        </div>

        <p className="mt-5 text-xl font-black leading-relaxed text-white md:text-2xl">
          “{review.review_text || 'Customer belum menulis komentar.'}”
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white ring-1 ring-white/10">
            {getInitials(getUserName(review))}
          </div>

          <div>
            <p className="text-sm font-black text-white">
              {getUserName(review)}
            </p>
            <p className="mt-1 text-xs font-medium text-white/50">
              {getProductName(review)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ review, onToggleVisibility, onDelete, updatingId }) {
  const visible = Boolean(review.is_visible)

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black"
              style={{
                backgroundColor: theme.primarySoft,
                color: theme.primary,
              }}
            >
              {getInitials(getUserName(review))}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">
                {getUserName(review)}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                {getUserEmail(review)}
              </p>
            </div>

            <VisibilityBadge visible={visible} />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">
                  {getProductName(review)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  SKU: {getProductSku(review)}
                </p>
              </div>

              <RatingStars rating={review.rating} />
            </div>

            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
              {review.review_text || 'Customer tidak menulis komentar.'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span>Dibuat: {formatDate(review.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{review.helpful_count || 0} helpful</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={updatingId === review.id}
            onClick={() => onToggleVisibility(review)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
              visible
                ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                : 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <AdminIcon name={visible ? 'eyeOff' : 'eye'} size={17} />
            {visible ? 'Sembunyikan' : 'Tampilkan'}
          </button>

          <button
            type="button"
            disabled={updatingId === review.id}
            onClick={() => onDelete(review)}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AdminIcon name="trash" size={17} />
            Hapus
          </button>
        </div>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]"
        style={{
          backgroundColor: theme.primarySoft,
          color: theme.primary,
        }}
      >
        <AdminIcon name="review" size={28} />
      </div>

      <h3 className="text-xl font-black text-slate-950">
        Belum ada ulasan
      </h3>

      <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
        Ulasan akan muncul setelah customer memberi rating dan komentar pada produk.
      </p>
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [meta, setMeta] = useState(null)

  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')
  const [visibility, setVisibility] = useState('')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminReviewService.getReviews({
        search,
        rating,
        visibility,
        page,
        per_page: 10,
      })

      setReviews(response.data.data || [])
      setSummary(response.data.summary || null)
      setMeta(response.data.meta || null)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Data ulasan belum dapat dimuat. Pastikan sesi admin masih aktif.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchReviews()
    }, 350)

    return () => clearTimeout(delay)
  }, [search, rating, visibility, page])

  useEffect(() => {
    setPage(1)
  }, [search, rating, visibility])

  const stats = useMemo(() => {
    return {
      total: summary?.total_reviews || reviews.length,
      average: summary?.average_rating || 0,
      visible:
        summary?.visible_reviews ??
        reviews.filter((review) => review.is_visible).length,
      hidden:
        summary?.hidden_reviews ??
        reviews.filter((review) => !review.is_visible).length,
    }
  }, [summary, reviews])

  const featuredReview = useMemo(() => {
    if (!reviews.length) return null

    return [...reviews].sort((a, b) => {
      const ratingDiff = Number(b.rating || 0) - Number(a.rating || 0)

      if (ratingDiff !== 0) return ratingDiff

      return Number(b.helpful_count || 0) - Number(a.helpful_count || 0)
    })[0]
  }, [reviews])

  const handleToggleVisibility = async (review) => {
    setUpdatingId(review.id)

    try {
      await adminReviewService.updateVisibility(review.id, !review.is_visible)
      await fetchReviews()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Status ulasan belum dapat diperbarui.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      `Hapus ulasan dari "${getUserName(review)}"? Aksi ini tidak dapat dibatalkan.`
    )

    if (!confirmed) return

    setUpdatingId(review.id)

    try {
      await adminReviewService.deleteReview(review.id)
      await fetchReviews()
    } catch (err) {
      alert(err.response?.data?.message || 'Ulasan belum dapat dihapus.')
    } finally {
      setUpdatingId(null)
    }
  }

  const canGoPrev = Number(meta?.current_page || 1) > 1
  const canGoNext =
    Number(meta?.current_page || 1) < Number(meta?.last_page || 1)

  return (
    <AdminLayout
      activeMenu="reviews"
      breadcrumb="Admin / Ulasan"
      title="Manajemen Ulasan"
      searchPlaceholder="Cari ulasan..."
    >
      <section
        className="relative overflow-hidden rounded-[34px] p-7 text-white shadow-sm md:p-8"
        style={{
          background: `linear-gradient(135deg, ${theme.navyDark || theme.navy}, ${theme.navy} 55%, ${theme.primaryDark})`,
        }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Review moderation
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Kelola ulasan customer agar katalog tetap terpercaya.
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 md:text-[15px]">
              Pantau rating, komentar, dan status visibilitas ulasan produk
              dari database. Admin dapat menampilkan, menyembunyikan, atau
              menghapus ulasan yang tidak sesuai.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReviews}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            <AdminIcon name="refresh" size={18} />
            Refresh Data
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          title="Total Ulasan"
          value={stats.total}
          subtitle="Semua ulasan customer"
          icon="review"
          tone="orange"
        />

        <MetricCard
          title="Rating Rata-rata"
          value={`${stats.average}/5`}
          subtitle="Kualitas pengalaman customer"
          icon="star"
          tone="amber"
        />

        <MetricCard
          title="Ditampilkan"
          value={stats.visible}
          subtitle="Ulasan tampil di katalog"
          icon="eye"
          tone="green"
        />

        <MetricCard
          title="Hidden"
          value={stats.hidden}
          subtitle="Ulasan dimoderasi admin"
          icon="eyeOff"
          tone="red"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.8fr_1.2fr]">
        <FeaturedReview review={featuredReview} />

        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_180px_220px]">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
              <AdminIcon name="search" className="text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari customer, produk, SKU, atau isi ulasan..."
                className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
              />
            </div>

            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
            >
              <option value="">Semua Rating</option>
              <option value="5">5 Bintang</option>
              <option value="4">4 Bintang</option>
              <option value="3">3 Bintang</option>
              <option value="2">2 Bintang</option>
              <option value="1">1 Bintang</option>
            </select>

            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
              className="rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-0"
            >
              <option value="">Semua Status</option>
              <option value="visible">Tampil</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-950">
              Moderasi cepat
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
              Gunakan filter untuk menemukan ulasan berdasarkan rating, produk,
              customer, atau status tampil/hidden.
            </p>
          </div>
        </section>
      </section>

      {error && (
        <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat ulasan...
            </p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-[22px] font-black tracking-tight text-slate-950">
                Daftar Ulasan
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {meta?.total || reviews.length} ulasan ditemukan dari database.
              </p>
            </div>
          </div>

          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDelete}
              updatingId={updatingId}
            />
          ))}

          <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Halaman {meta?.current_page || page} dari {meta?.last_page || 1}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={!canGoPrev}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AdminIcon name="chevronLeft" size={17} />
              </button>

              <button
                className="flex h-10 min-w-10 items-center justify-center rounded-2xl px-4 text-sm font-black text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {meta?.current_page || page}
              </button>

              <button
                disabled={!canGoNext}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AdminIcon name="chevronRight" size={17} />
              </button>
            </div>
          </div>
        </section>
      )}
    </AdminLayout>
  )
}