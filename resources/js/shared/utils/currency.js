/**
 * Format angka menjadi format mata uang Rupiah Indonesia.
 *
 * Contoh:
 *   formatRupiah(1500000) => "Rp 1.500.000"
 *   formatRupiah(250000)  => "Rp 250.000"
 *
 * @param {number} amount - Nilai dalam Rupiah
 * @returns {string} - String format Rupiah
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
