import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { adminTheme as theme } from '../styles/adminTheme'
import { adminOrderService } from './adminOrderService'

/* =========================
   Helpers
========================= */

function toNumber(value) {
  const number = Number(value || 0)
  return Number.isNaN(number) ? 0 : number
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(toNumber(value))
    .replace('Rp', 'Rp ')
}

function formatDateTime(value) {
  if (!value) return '-'

  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatShortDateTime(value) {
  if (!value) return '-'

  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getOrderNumber(order) {
  return (
    order?.order_number ||
    order?.invoice_number ||
    order?.code ||
    `#ORD-${order?.id || '-'}`
  )
}

function getCustomer(order) {
  return order?.user || order?.customer || {}
}

function getShippingAddress(order) {
  return order?.shipping_address || order?.address || order?.delivery_address || {}
}

function getItems(order) {
  return order?.items || order?.order_items || []
}

function getSubtotal(order) {
  return (
    order?.subtotal ||
    order?.subtotal_amount ||
    order?.subtotal_price ||
    getItems(order).reduce((sum, item) => {
      const qty = Number(item?.quantity || item?.qty || 1)
      const price =
        toNumber(item?.price) ||
        toNumber(item?.unit_price) ||
        toNumber(item?.price_sen) ||
        0

      return sum + qty * price
    }, 0)
  )
}

function getDiscount(order) {
  return (
    toNumber(order?.discount) ||
    toNumber(order?.discount_amount) ||
    toNumber(order?.voucher_discount) ||
    0
  )
}

function getShippingCost(order) {
  return (
    toNumber(order?.shipping_cost) ||
    toNumber(order?.shipping_fee) ||
    toNumber(order?.delivery_fee) ||
    0
  )
}

function getInsuranceCost(order) {
  return (
    toNumber(order?.insurance_cost) ||
    toNumber(order?.protection_fee) ||
    0
  )
}

function getServiceFee(order) {
  return (
    toNumber(order?.service_fee) ||
    toNumber(order?.handling_fee) ||
    0
  )
}

function getGrandTotal(order) {
  return (
    toNumber(order?.total) ||
    toNumber(order?.grand_total) ||
    toNumber(order?.total_amount) ||
    toNumber(order?.final_total) ||
    getSubtotal(order) - getDiscount(order) + getShippingCost(order) + getInsuranceCost(order) + getServiceFee(order)
  )
}

function getPaymentMethod(order) {
  return (
    order?.payment_method ||
    order?.payment?.method ||
    order?.payment_channel ||
    'Transfer Bank'
  )
}

function getTrackingNumber(order) {
  return (
    order?.tracking_number ||
    order?.shipment?.tracking_number ||
    ''
  )
}

function getCourierName(order) {
  return (
    order?.courier ||
    order?.shipping_method ||
    order?.shipment?.courier ||
    'Kurir'
  )
}

function getOrderStatusLabel(status) {
  const map = {
    pending: 'Menunggu',
    processing: 'Sedang Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return map[String(status || '').toLowerCase()] || status || 'Menunggu'
}

function getPaymentStatusLabel(status) {
  const map = {
    unpaid: 'Belum Bayar',
    pending: 'Menunggu',
    paid: 'Lunas',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    refunded: 'Refund',
  }

  return map[String(status || '').toLowerCase()] || status || 'Belum Bayar'
}

function buildTimeline(order) {
  const timeline = []

  if (order?.created_at) {
    timeline.push({
      key: 'created',
      title: 'Pesanan Dibuat',
      description: `Order ${getOrderNumber(order)} berhasil dibuat.`,
      time: order.created_at,
      tone: 'slate',
    })
  }

  if (order?.paid_at || String(order?.payment_status).toLowerCase() === 'paid') {
    timeline.push({
      key: 'paid',
      title: 'Pembayaran Diterima',
      description: `Pembayaran dikonfirmasi melalui ${getPaymentMethod(order)}.`,
      time: order?.paid_at || order?.updated_at,
      tone: 'emerald',
    })
  }

  if (
    String(order?.status).toLowerCase() === 'processing' ||
    String(order?.status).toLowerCase() === 'shipped' ||
    String(order?.status).toLowerCase() === 'completed'
  ) {
    timeline.push({
      key: 'processing',
      title: 'Sedang Diproses',
      description: 'Pesanan sedang disiapkan oleh tim operasional.',
      time: order?.processed_at || order?.updated_at,
      tone: 'orange',
    })
  }

  if (
    String(order?.status).toLowerCase() === 'shipped' ||
    String(order?.status).toLowerCase() === 'completed'
  ) {
    timeline.push({
      key: 'shipped',
      title: 'Pesanan Dikirim',
      description: getTrackingNumber(order)
        ? `Nomor resi: ${getTrackingNumber(order)}`
        : 'Pesanan telah dikirim ke alamat customer.',
      time: order?.shipped_at || order?.updated_at,
      tone: 'blue',
    })
  }

  if (String(order?.status).toLowerCase() === 'completed') {
    timeline.push({
      key: 'completed',
      title: 'Pesanan Selesai',
      description: 'Pesanan telah diterima dan transaksi selesai.',
      time: order?.completed_at || order?.updated_at,
      tone: 'emerald',
    })
  }

  if (String(order?.status).toLowerCase() === 'cancelled') {
    timeline.push({
      key: 'cancelled',
      title: 'Pesanan Dibatalkan',
      description: 'Pesanan tidak dilanjutkan atau dibatalkan.',
      time: order?.cancelled_at || order?.updated_at,
      tone: 'rose',
    })
  }

  return timeline
}

function getInitials(name = 'AD') {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function badgeClass(status, type = 'order') {
  const key = String(status || '').toLowerCase()

  if (type === 'payment') {
    const map = {
      unpaid: 'bg-slate-100 text-slate-700 ring-slate-200',
      pending: 'bg-amber-50 text-amber-700 ring-amber-100',
      paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      failed: 'bg-rose-50 text-rose-700 ring-rose-100',
      expired: 'bg-rose-50 text-rose-700 ring-rose-100',
      refunded: 'bg-violet-50 text-violet-700 ring-violet-100',
    }

    return map[key] || map.unpaid
  }

  const map = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    processing: 'bg-sky-50 text-sky-700 ring-sky-100',
    shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-100',
  }

  return map[key] || map.pending
}

/* =========================
   Local UI Parts
========================= */

function MiniIcon({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }

  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone] || tones.slate}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        {children}
      </svg>
    </span>
  )
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-[17px] font-black tracking-tight text-slate-950">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        {right ? <div>{right}</div> : null}
      </div>

      <div className="px-6 py-6">{children}</div>
    </section>
  )
}

function InfoLine({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`text-right text-sm ${strong ? 'font-black text-slate-950' : 'font-semibold text-slate-700'}`}>
        {value || '-'}
      </span>
    </div>
  )
}

function TimelineItem({ item, isLast = false }) {
  const toneMap = {
    slate: 'bg-slate-300',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
  }

  return (
    <div className="relative flex gap-4">
      <div className="relative flex w-5 flex-col items-center">
        <span className={`z-10 mt-1 h-3.5 w-3.5 rounded-full ${toneMap[item.tone] || toneMap.slate}`} />
        {!isLast ? <span className="mt-1 h-full w-px bg-slate-200" /> : null}
      </div>

      <div className="pb-6">
        <p className="text-sm font-black text-slate-900">{item.title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
          {formatShortDateTime(item.time)}
        </p>
      </div>
    </div>
  )
}

/* =========================
   Main Component
========================= */

export default function AdminOrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [noteLoading, setNoteLoading] = useState(false)

  const [form, setForm] = useState({
    status: 'pending',
    payment_status: 'unpaid',
    tracking_number: '',
  })

  const [noteInput, setNoteInput] = useState('')

  const items = useMemo(() => getItems(order), [order])
  const customer = useMemo(() => getCustomer(order), [order])
  const address = useMemo(() => getShippingAddress(order), [order])
  const timeline = useMemo(() => buildTimeline(order), [order])

  const internalNotes = useMemo(() => {
    return order?.internal_notes || order?.notes || []
  }, [order])

  const fetchOrder = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminOrderService.getOrder(id)
      const orderData = response?.data?.data || response?.data || null

      setOrder(orderData)

      setForm({
        status: orderData?.status || 'pending',
        payment_status: orderData?.payment_status || 'unpaid',
        tracking_number: getTrackingNumber(orderData),
      })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Detail pesanan belum berhasil dimuat.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveOrderMeta = async () => {
    if (!order) return

    setSaving(true)

    try {
      const tasks = []

      if (form.status !== order.status && adminOrderService.updateStatus) {
        tasks.push(adminOrderService.updateStatus(order.id, form.status))
      }

      if (
        form.payment_status !== order.payment_status &&
        adminOrderService.updatePaymentStatus
      ) {
        tasks.push(
          adminOrderService.updatePaymentStatus(order.id, form.payment_status)
        )
      }

      if (
        form.tracking_number !== getTrackingNumber(order) &&
        adminOrderService.updateTrackingNumber
      ) {
        tasks.push(
          adminOrderService.updateTrackingNumber(order.id, form.tracking_number)
        )
      }

      await Promise.all(tasks)
      await fetchOrder()

      alert('Perubahan pesanan berhasil disimpan.')
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          'Perubahan pesanan belum berhasil disimpan.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteInput.trim()) {
      alert('Catatan internal masih kosong.')
      return
    }

    if (!adminOrderService.addInternalNote) {
      alert('Fitur simpan catatan belum tersedia di service.')
      return
    }

    setNoteLoading(true)

    try {
      await adminOrderService.addInternalNote(order.id, {
        note: noteInput,
      })

      setNoteInput('')
      await fetchOrder()
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          'Catatan internal belum berhasil ditambahkan.'
      )
    } finally {
      setNoteLoading(false)
    }
  }

  const handleDownloadInvoice = () => {
    const url = order?.invoice_url || order?.invoice?.url

    if (url) {
      window.open(url, '_blank')
      return
    }

    alert('Invoice belum tersedia.')
  }

  const handlePrintPackingSlip = () => {
    window.print()
  }

  const handleSendNotification = async () => {
    if (!adminOrderService.sendNotification) {
      alert('Fitur kirim notifikasi belum tersedia.')
      return
    }

    try {
      await adminOrderService.sendNotification(order.id)
      alert('Notifikasi berhasil dikirim ke customer.')
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          'Notifikasi belum berhasil dikirim.'
      )
    }
  }

  if (loading) {
    return (
      <AdminLayout
        activeMenu="orders"
        breadcrumb="Dashboard / Pesanan / Detail"
        title="Detail Pesanan"
        searchPlaceholder="Cari pesanan, SKU, atau pelanggan..."
      >
        <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Memuat detail pesanan...
            </p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !order) {
    return (
      <AdminLayout
        activeMenu="orders"
        breadcrumb="Dashboard / Pesanan / Detail"
        title="Detail Pesanan"
        searchPlaceholder="Cari pesanan, SKU, atau pelanggan..."
      >
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm font-bold text-rose-700">
          {error || 'Pesanan tidak ditemukan.'}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      activeMenu="orders"
      breadcrumb={`Dashboard / Pesanan / ${getOrderNumber(order)}`}
      title="Detail Pesanan"
      searchPlaceholder="Cari pesanan, SKU, atau pelanggan..."
    >
      <div className="space-y-6">
        {/* HEADER */}
        <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[34px] font-black tracking-tight text-slate-950">
                  Order {getOrderNumber(order)}
                </h1>

                <span
                  className={`inline-flex rounded-full px-4 py-1.5 text-xs font-black ring-1 ${badgeClass(order?.status, 'order')}`}
                >
                  {getOrderStatusLabel(order?.status)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-500">
                <span>{formatDateTime(order?.created_at)}</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                <span>Metode bayar: {getPaymentMethod(order)}</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${badgeClass(order?.payment_status, 'payment')}`}
                >
                  {getPaymentStatusLabel(order?.payment_status)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={fetchOrder}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TOP INFO */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <SectionCard
                title="Informasi Pelanggan"
                subtitle="Data customer yang melakukan transaksi."
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-black text-orange-700"
                    style={{ backgroundColor: '#FDE7DA' }}
                  >
                    {getInitials(customer?.name || 'CU')}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[22px] font-black leading-tight text-slate-950">
                      {customer?.name || 'Customer'}
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-500">
                      {customer?.email || '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <InfoLine
                    label="Telepon"
                    value={customer?.phone || customer?.phone_number || '-'}
                  />
                  <InfoLine
                    label="Member"
                    value={customer?.member_since || customer?.created_at ? `Sejak ${formatShortDateTime(customer?.member_since || customer?.created_at)}` : '-'}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Alamat Pengiriman"
                subtitle="Alamat tujuan pengiriman pesanan."
              >
                <div className="space-y-2 text-sm leading-7 text-slate-600">
                  <p className="font-black text-slate-950">
                    {address?.label || address?.recipient_name || customer?.name || 'Alamat Utama'}
                  </p>
                  <p>{address?.line1 || address?.address || address?.street || '-'}</p>
                  {address?.line2 ? <p>{address.line2}</p> : null}
                  <p>
                    {[
                      address?.district,
                      address?.city,
                      address?.province,
                      address?.postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </p>
                  <p>{address?.country || 'Indonesia'}</p>
                </div>
              </SectionCard>

              <section
                className="rounded-[28px] px-6 py-6 text-white shadow-[0_18px_36px_rgba(2,6,23,0.18)]"
                style={{
                  background: `linear-gradient(145deg, ${theme.navyDark}, ${theme.navy})`,
                }}
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">
                  Aksi Cepat
                </p>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100"
                  >
                    Download Invoice
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintPackingSlip}
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    Print Packing List
                  </button>

                  <button
                    type="button"
                    onClick={handleSendNotification}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-black text-white shadow-md transition hover:brightness-105"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Kirim Notifikasi
                  </button>
                </div>
              </section>
            </div>

            {/* ITEMS */}
            <SectionCard
              title="Detail Item Pesanan"
              subtitle="Daftar produk yang dipesan customer."
              right={
                <span className="text-sm font-black text-slate-500">
                  {items.length} item
                </span>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Produk
                      </th>
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Harga Unit
                      </th>
                      <th className="pb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Jumlah
                      </th>
                      <th className="pb-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-sm font-semibold text-slate-500"
                        >
                          Belum ada item pesanan.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, index) => {
                        const qty = Number(item?.quantity || item?.qty || 1)
                        const unitPrice =
                          toNumber(item?.price) ||
                          toNumber(item?.unit_price) ||
                          toNumber(item?.price_sen) ||
                          0
                        const lineTotal =
                          toNumber(item?.subtotal) ||
                          toNumber(item?.subtotal_price) ||
                          unitPrice * qty

                        const productName =
                          item?.product?.name ||
                          item?.name ||
                          'Produk'

                        const productSku =
                          item?.product?.sku ||
                          item?.sku ||
                          '-'

                        const productImage =
                          item?.product?.image_url ||
                          item?.product?.thumbnail ||
                          item?.image_url ||
                          ''

                        return (
                          <tr
                            key={item?.id || `${productName}-${index}`}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="py-5 pr-5">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                                  {productImage ? (
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-black text-slate-400">
                                      NK
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[17px] font-black leading-tight text-slate-950">
                                    {productName}
                                  </p>
                                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                                    SKU: {productSku}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-5 pr-5 text-sm font-semibold text-slate-700">
                              {formatCurrency(unitPrice)}
                            </td>

                            <td className="py-5 pr-5 text-sm font-semibold text-slate-700">
                              {qty}
                            </td>

                            <td className="py-5 text-right text-[17px] font-black text-slate-950">
                              {formatCurrency(lineTotal)}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* PAYMENT SUMMARY */}
            <SectionCard title="Ringkasan Pembayaran" subtitle="Rangkuman nominal transaksi pesanan ini.">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
                  <InfoLine label="Subtotal" value={formatCurrency(getSubtotal(order))} />
                  <InfoLine
                    label="Diskon"
                    value={
                      getDiscount(order) > 0
                        ? `- ${formatCurrency(getDiscount(order))}`
                        : formatCurrency(0)
                    }
                  />
                  <InfoLine
                    label="Biaya Pengiriman"
                    value={formatCurrency(getShippingCost(order))}
                  />
                  <InfoLine
                    label="Biaya Asuransi"
                    value={formatCurrency(getInsuranceCost(order))}
                  />
                  {getServiceFee(order) > 0 ? (
                    <InfoLine
                      label="Biaya Layanan"
                      value={formatCurrency(getServiceFee(order))}
                    />
                  ) : null}

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                          Total Akhir
                        </p>
                        <p
                          className="mt-1 text-[30px] font-black tracking-tight"
                          style={{ color: theme.primaryDark }}
                        >
                          {formatCurrency(getGrandTotal(order))}
                        </p>
                      </div>

                      <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-orange-700">
                        System Live
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <MiniIcon tone="blue">
                        <>
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 10h18" />
                        </>
                      </MiniIcon>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Metode Pembayaran
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {getPaymentMethod(order)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Status pembayaran:{' '}
                      <span className="font-black text-slate-900">
                        {getPaymentStatusLabel(order?.payment_status)}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <MiniIcon tone="orange">
                        <>
                          <path d="M8 7h8" />
                          <path d="M8 12h8" />
                          <path d="M8 17h5" />
                          <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                        </>
                      </MiniIcon>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Pembaruan Terakhir
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {formatShortDateTime(order?.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            {/* UPDATE STATUS */}
            <SectionCard title="Update Pesanan" subtitle="Ubah status order, pembayaran, dan resi pengiriman.">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Status Pesanan
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition focus:border-orange-200 focus:bg-white"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="shipped">Dikirim</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Status Pembayaran
                  </label>
                  <select
                    value={form.payment_status}
                    onChange={(e) =>
                      handleChange('payment_status', e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition focus:border-orange-200 focus:bg-white"
                  >
                    <option value="unpaid">Belum Bayar</option>
                    <option value="pending">Menunggu</option>
                    <option value="paid">Lunas</option>
                    <option value="failed">Gagal</option>
                    <option value="expired">Kedaluwarsa</option>
                    <option value="refunded">Refund</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={form.tracking_number}
                    onChange={(e) =>
                      handleChange('tracking_number', e.target.value)
                    }
                    placeholder="Masukkan nomor resi"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-orange-200 focus:bg-white"
                  />
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Kurir: <span className="font-bold">{getCourierName(order)}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveOrderMeta}
                  disabled={saving}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm font-black text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: theme.primary }}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </SectionCard>

            {/* INTERNAL NOTE */}
            <SectionCard title="Catatan Internal" subtitle="Catatan ini hanya terlihat oleh admin.">
              <div className="space-y-4">
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Tambahkan catatan internal untuk tim admin..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-200 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={noteLoading}
                  className="text-sm font-black text-orange-600 transition hover:text-orange-700 disabled:opacity-60"
                >
                  {noteLoading ? 'Menyimpan catatan...' : '+ Simpan Catatan'}
                </button>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  {internalNotes.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400">
                      Belum ada catatan internal.
                    </p>
                  ) : (
                    internalNotes.map((note, index) => {
                      const author =
                        note?.author?.name ||
                        note?.user?.name ||
                        note?.admin_name ||
                        'Admin'

                      const content =
                        note?.note || note?.content || note?.message || '-'

                      return (
                        <div
                          key={note?.id || index}
                          className="rounded-2xl bg-slate-50 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-700">
                              {getInitials(author)}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-6 text-slate-700">
                                {content}
                              </p>
                              <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                                {author} • {formatShortDateTime(note?.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </SectionCard>

            {/* TIMELINE */}
            <SectionCard title="Timeline Pesanan" subtitle="Riwayat progres pesanan secara ringkas.">
              <div>
                {timeline.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400">
                    Timeline belum tersedia.
                  </p>
                ) : (
                  timeline.map((item, index) => (
                    <TimelineItem
                      key={item.key}
                      item={item}
                      isLast={index === timeline.length - 1}
                    />
                  ))
                )}
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}