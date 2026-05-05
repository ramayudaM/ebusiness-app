import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { 
    ChevronLeft, 
    Truck, 
    ShieldCheck, 
    CreditCard, 
    RotateCcw,
    Clock,
    MapPin,
    AlertCircle,
    Info,
    HelpCircle
} from 'lucide-react';

export const HelpArticlePage = () => {
    const { slug } = useParams();

    // Mock data for help articles
    const articles = {
        'pengiriman': {
            title: 'Informasi Lengkap Pengiriman',
            icon: <Truck className="text-blue-500" />,
            content: (
                <div className="space-y-6">
                    <p>NadaKita berkomitmen memberikan pengalaman pengiriman instrumen musik yang paling aman di Indonesia. Kami memahami bahwa instrumen Anda sangat berharga.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock size={18} /> Estimasi Waktu</h4>
                            <p className="text-sm text-gray-600">Proses packing kayu standar studio kami memakan waktu 24 jam untuk memastikan keamanan maksimal sebelum dikirim.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><ShieldCheck size={18} /> Proteksi Ganda</h4>
                            <p className="text-sm text-gray-600">Setiap gitar dan keyboard wajib menggunakan Hardcase atau Box Kayu tambahan untuk pengiriman luar kota.</p>
                        </div>
                    </div>
                </div>
            )
        },
        'pembayaran': {
            title: 'Metode & Kebijakan Pembayaran',
            icon: <CreditCard className="text-green-500" />,
            content: (
                <div className="space-y-6">
                    <p>Kami menyediakan berbagai metode pembayaran yang aman dan terverifikasi untuk kenyamanan Anda berbelanja instrumen musik.</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="font-bold text-orange-600">01.</div>
                            <div>
                                <h4 className="font-bold">Transfer Bank (VA)</h4>
                                <p className="text-sm text-gray-500">Mendukung BCA, Mandiri, BNI, dan BRI dengan verifikasi otomatis 24/7.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="font-bold text-orange-600">02.</div>
                            <div>
                                <h4 className="font-bold">Cicilan 0%</h4>
                                <p className="text-sm text-gray-500">Nikmati cicilan 0% hingga 12 bulan menggunakan kartu kredit atau partner pembiayaan kami.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        },
        'pengembalian': {
            title: 'Kebijakan Pengembalian & Retur',
            icon: <RotateCcw className="text-orange-500" />,
            content: (
                <div className="space-y-6">
                    <p>Kepuasan Anda adalah prioritas kami. Jika instrumen yang diterima tidak sesuai atau mengalami kendala teknis, Anda dapat mengajukan retur.</p>
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2"><AlertCircle size={18} /> Aturan Emas Retur</h4>
                        <p className="text-sm text-orange-800">Wajib melampirkan video unboxing tanpa terputus. Tanpa video ini, mohon maaf klaim tidak dapat diproses.</p>
                    </div>
                </div>
            )
        },
        'keamanan': {
            title: 'Pusat Keamanan & Privasi',
            icon: <ShieldCheck className="text-purple-500" />,
            content: (
                <div className="space-y-6">
                    <p>NadaKita menjamin data pribadi dan transaksi Anda terlindungi dengan enkripsi standar perbankan.</p>
                    <p>Jika Anda merasa ada aktivitas mencurigakan pada akun Anda, segera lakukan:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li>Ganti password secara berkala.</li>
                        <li>Jangan berikan kode OTP kepada siapapun, termasuk staf NadaKita.</li>
                        <li>Pastikan URL website selalu <strong>nadakita.id</strong>.</li>
                    </ul>
                </div>
            )
        },
        'lacak-pesanan': {
            title: 'Bagaimana Cara Melacak Pesanan?',
            icon: <Truck className="text-blue-500" />,
            content: (
                <div className="space-y-6">
                    <p>Setelah pesanan Anda dikirim, Anda akan menerima nomor resi melalui email dan notifikasi di akun NadaKita Anda. Anda dapat melacak status pengiriman melalui langkah berikut:</p>
                    <ol className="list-decimal pl-5 space-y-3">
                        <li>Masuk ke akun NadaKita Anda.</li>
                        <li>Buka menu <strong>Pesanan Saya</strong>.</li>
                        <li>Pilih pesanan yang ingin Anda lacak.</li>
                        <li>Klik tombol <strong>Lacak Resi</strong> untuk melihat status terbaru dari ekspedisi.</li>
                    </ol>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                        <Info className="text-blue-600 shrink-0" size={24} />
                        <p className="text-sm text-blue-800 leading-relaxed">Pembaruan status pengiriman biasanya memakan waktu 1x24 jam setelah kurir menjemput paket dari studio kami.</p>
                    </div>
                </div>
            )
        },
        'area-jangkauan': {
            title: 'Area Jangkauan Pengiriman',
            icon: <MapPin className="text-red-500" />,
            content: (
                <div className="space-y-6">
                    <p>NadaKita melayani pengiriman ke seluruh penjuru Indonesia. Kami bekerja sama dengan mitra logistik terpercaya untuk memastikan instrumen Anda sampai dengan selamat.</p>
                    <ul className="list-disc pl-5 space-y-3">
                        <li><strong>Jabodetabek:</strong> Pengiriman 1-2 hari kerja. Tersedia opsi pengiriman instan.</li>
                        <li><strong>Pulau Jawa:</strong> Pengiriman 2-4 hari kerja via Jalur Darat.</li>
                        <li><strong>Luar Pulau Jawa:</strong> Pengiriman 4-7 hari kerja via Jalur Udara/Laut (dengan proteksi kayu).</li>
                    </ul>
                    <p>Untuk pengiriman luar negeri, silakan hubungi tim Support kami untuk mendapatkan estimasi biaya khusus.</p>
                </div>
            )
        },
        'garansi-pengiriman': {
            title: 'Kebijakan Garansi Pengiriman',
            icon: <ShieldCheck className="text-green-500" />,
            content: (
                <div className="space-y-6">
                    <p>Semua instrumen yang dibeli di NadaKita sudah termasuk <strong>Asuransi Pengiriman Penuh</strong> secara gratis.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-bold mb-2">Apa yang Dicover?</h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• Kerusakan fisik akibat benturan</li>
                                <li>• Kehilangan paket</li>
                                <li>• Kerusakan akibat air/cuaca</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-bold mb-2">Syarat Klaim</h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>• Video Unboxing tanpa jeda</li>
                                <li>• Foto resi yang jelas</li>
                                <li>• Maksimal 24 jam setelah diterima</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        'metode-pembayaran': {
            title: 'Metode Pembayaran Tersedia',
            icon: <CreditCard className="text-green-500" />,
            content: (
                <div className="space-y-6">
                    <p>Pilih metode pembayaran yang paling nyaman untuk Anda:</p>
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-100 rounded-xl">
                            <h4 className="font-bold">Virtual Account</h4>
                            <p className="text-sm text-gray-600">BCA, Mandiri, BNI, BRI, Permata. Verifikasi otomatis.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-xl">
                            <h4 className="font-bold">E-Wallet</h4>
                            <p className="text-sm text-gray-600">GoPay, OVO, ShopeePay, Dana, LinkAja.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-xl">
                            <h4 className="font-bold">Kartu Kredit & Cicilan</h4>
                            <p className="text-sm text-gray-600">Visa, Mastercard, JCB, AMEX. Cicilan 0% hingga 12 bulan.</p>
                        </div>
                    </div>
                </div>
            )
        },
        'masalah-transaksi': {
            title: 'Kendala Transaksi & Pembayaran',
            icon: <AlertCircle className="text-red-500" />,
            content: (
                <div className="space-y-6">
                    <p>Jika transaksi Anda gagal atau status tidak berubah setelah pembayaran:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li>Pastikan Anda mentransfer sesuai nominal hingga 3 digit terakhir.</li>
                        <li>Tunggu maksimal 10 menit untuk verifikasi sistem.</li>
                        <li>Simpan bukti transfer Anda.</li>
                        <li>Hubungi CS NadaKita melalui WhatsApp dengan melampirkan bukti transfer jika status belum berubah dalam 1 jam.</li>
                    </ul>
                </div>
            )
        },
        'refund-dan-dana': {
            title: 'Kebijakan Refund (Pengembalian Dana)',
            icon: <RotateCcw className="text-orange-500" />,
            content: (
                <div className="space-y-6">
                    <p>Proses refund dilakukan jika pesanan dibatalkan atau produk tidak tersedia.</p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                        <li>Pengajuan refund diproses maksimal 3-5 hari kerja.</li>
                        <li>Refund akan dikirimkan ke saldo akun NadaKita atau rekening asal pembayar.</li>
                        <li>Untuk pembayaran via Kartu Kredit, refund akan muncul pada tagihan bulan berikutnya.</li>
                    </ol>
                </div>
            )
        },
        'kebijakan-retur': {
            title: 'Kebijakan Retur Produk',
            icon: <RotateCcw className="text-orange-500" />,
            content: (
                <div className="space-y-6">
                    <p>Produk dapat diretur jika terjadi kerusakan pabrik atau kesalahan pengiriman oleh tim NadaKita.</p>
                    <p><strong>Syarat Retur:</strong></p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        <li>Produk belum digunakan secara intensif.</li>
                        <li>Kelengkapan (box, kartu garansi, aksesoris) masih utuh.</li>
                        <li>Maksimal pengajuan 3 hari setelah barang diterima.</li>
                    </ul>
                </div>
            )
        },
        'klaim-garansi': {
            title: 'Panduan Klaim Garansi',
            icon: <ShieldCheck className="text-blue-500" />,
            content: (
                <div className="space-y-6">
                    <p>Setiap instrumen di NadaKita mendapatkan garansi resmi distributor atau garansi toko selama 1 tahun.</p>
                    <div className="bg-blue-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-blue-900 mb-2">Cara Klaim:</h4>
                        <p className="text-sm text-blue-800">Cukup bawa unit Anda beserta invoice pembelian dan kartu garansi ke Service Center mitra kami atau kirimkan kembali ke Studio NadaKita.</p>
                    </div>
                </div>
            )
        },
        'tukar-unit': {
            title: 'Kebijakan Tukar Unit',
            icon: <RotateCcw className="text-purple-500" />,
            content: (
                <div className="space-y-6">
                    <p>Ingin ganti warna atau tipe instrumen? Kami melayani tukar unit dengan ketentuan:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                        <li>Hanya berlaku dalam 1x24 jam setelah barang diterima.</li>
                        <li>Kondisi barang harus 100% mulus (Like New).</li>
                        <li>Biaya pengiriman bolak-balik ditanggung oleh pembeli.</li>
                        <li>Selisih harga produk akan disesuaikan (tambah atau refund).</li>
                    </ul>
                </div>
            )
        },
        'ganti-password': {
            title: 'Keamanan: Cara Ganti Password',
            icon: <ShieldCheck className="text-purple-500" />,
            content: (
                <div className="space-y-6">
                    <p>Kami menyarankan Anda mengganti password secara berkala setiap 3-6 bulan sekali.</p>
                    <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                        <li>Masuk ke menu <strong>Pengaturan Akun</strong>.</li>
                        <li>Pilih tab <strong>Keamanan</strong>.</li>
                        <li>Klik <strong>Ubah Kata Sandi</strong>.</li>
                        <li>Masukkan password lama dan password baru Anda.</li>
                        <li>Verifikasi melalui email jika diperlukan.</li>
                    </ol>
                </div>
            )
        },
        'verifikasi-akun': {
            title: 'Verifikasi Akun NadaKita',
            icon: <ShieldCheck className="text-blue-500" />,
            content: (
                <div className="space-y-6">
                    <p>Verifikasi akun diperlukan untuk transaksi dengan nominal besar dan penarikan dana refund.</p>
                    <div className="p-4 border border-blue-100 rounded-xl bg-blue-50 text-sm text-blue-800">
                        Siapkan KTP/SIM Anda untuk proses verifikasi identitas melalui foto selfie di menu profil.
                    </div>
                </div>
            )
        },
        'privasi-data': {
            title: 'Kebijakan Privasi Data',
            icon: <ShieldCheck className="text-gray-500" />,
            content: (
                <div className="space-y-6">
                    <p>Data Anda aman bersama kami. NadaKita tidak pernah membagikan informasi pribadi pelanggan kepada pihak ketiga untuk kepentingan marketing tanpa persetujuan Anda.</p>
                    <p>Seluruh data transaksi dienkripsi menggunakan teknologi SSL terbaru untuk menjamin keamanan finansial Anda.</p>
                </div>
            )
        },
        'faq': {
            title: 'Semua Pertanyaan (FAQ)',
            icon: <HelpCircle className="text-orange-500" />,
            content: (
                <div className="space-y-8">
                    <p>Temukan jawaban untuk pertanyaan yang paling sering diajukan oleh komunitas NadaKita.</p>
                    <div className="space-y-6">
                        {[
                            { q: "Apakah bisa COD?", a: "Saat ini kami hanya melayani pembayaran melalui Transfer Bank, E-Wallet, dan Kartu Kredit untuk keamanan transaksi." },
                            { q: "Di mana lokasi studio fisik NadaKita?", a: "Studio utama kami berada di Jakarta Selatan. Anda dapat berkunjung untuk mencoba instrumen dengan membuat janji temu terlebih dahulu." },
                            { q: "Apakah ada diskon untuk pelajar?", a: "Ya! Kami memiliki program NadaPelajar yang memberikan potongan harga 10% untuk instrumen tertentu dengan melampirkan kartu pelajar." }
                        ].map((item, i) => (
                            <div key={i} className="border-b border-gray-100 pb-6">
                                <h4 className="font-bold text-gray-900 mb-2">Q: {item.q}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">A: {item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    };

    const article = articles[slug] || {
        title: 'Halaman Bantuan',
        icon: <AlertCircle className="text-gray-400" />,
        content: (
            <div className="text-center py-20">
                <p className="text-gray-500">Mohon maaf, artikel bantuan yang Anda cari belum tersedia atau sedang dalam pembaruan.</p>
                <Link to="/help" className="mt-6 inline-block text-orange-600 font-bold">Kembali ke Pusat Bantuan</Link>
            </div>
        )
    };

    return (
        <Layout>
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
                    <Link to="/help" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium">
                        <ChevronLeft size={16} /> Kembali ke Pusat Bantuan
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <header className="mb-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        {article.icon}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> Terakhir diperbarui: 5 Mei 2026</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>Estimasi baca: 3 menit</span>
                    </div>
                </header>

                <div className="prose prose-orange max-w-none text-gray-700 leading-relaxed">
                    {article.content}
                </div>
            </div>
        </Layout>
    );
};

