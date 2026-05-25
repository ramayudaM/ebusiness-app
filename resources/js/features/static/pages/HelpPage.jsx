import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { motion } from 'framer-motion';
import { 
    Search, 
    CircleHelp, 
    MessageCircle, 
    Phone, 
    Mail, 
    ShieldCheck, 
    Truck, 
    CreditCard, 
    RotateCcw,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    ArrowRight,
    Headphones,
    Zap,
    Clock
} from 'lucide-react';

export const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { 
            icon: <Truck className="text-blue-500" />, 
            title: 'Pengiriman', 
            slug: 'pengiriman',
            description: 'Lacak pesanan, biaya ongkir, dan estimasi waktu.',
            links: [
                { name: 'Lacak Pesanan', slug: 'lacak-pesanan' },
                { name: 'Area Jangkauan', slug: 'area-jangkauan' },
                { name: 'Garansi Pengiriman', slug: 'garansi-pengiriman' }
            ]
        },
        { 
            icon: <CreditCard className="text-green-500" />, 
            title: 'Pembayaran', 
            slug: 'pembayaran',
            description: 'Metode pembayaran, konfirmasi, dan cicilan.',
            links: [
                { name: 'Metode Tersedia', slug: 'metode-pembayaran' },
                { name: 'Masalah Transaksi', slug: 'masalah-transaksi' },
                { name: 'Refund & Dana', slug: 'refund-dan-dana' }
            ]
        },
        { 
            icon: <RotateCcw className="text-orange-500" />, 
            title: 'Pengembalian', 
            slug: 'pengembalian',
            description: 'Prosedur retur barang dan klaim garansi.',
            links: [
                { name: 'Kebijakan Retur', slug: 'kebijakan-retur' },
                { name: 'Klaim Garansi', slug: 'klaim-garansi' },
                { name: 'Tukar Unit', slug: 'tukar-unit' }
            ]
        },
        { 
            icon: <ShieldCheck className="text-purple-500" />, 
            title: 'Keamanan', 
            slug: 'keamanan',
            description: 'Perlindungan akun dan data pribadi Anda.',
            links: [
                { name: 'Ganti Password', slug: 'ganti-password' },
                { name: 'Verifikasi Akun', slug: 'verifikasi-akun' },
                { name: 'Privasi Data', slug: 'privasi-data' }
            ]
        }
    ];

    const allFaqs = [
        {
            q: "Bagaimana cara klaim garansi instrumen?",
            a: "Anda dapat melakukan klaim melalui menu Pesanan Saya, pilih produk yang bermasalah, dan klik tombol 'Klaim Garansi'. Pastikan segel produk masih utuh."
        },
        {
            q: "Apakah NadaKita melayani pengiriman luar pulau?",
            a: "Ya, kami bekerja sama dengan berbagai ekspedisi untuk menjangkau seluruh wilayah Indonesia dengan pengemasan kayu standar keamanan tinggi."
        },
        {
            q: "Bagaimana jika barang yang diterima cacat?",
            a: "Segera hubungi Customer Service kami dalam waktu maksimal 1x24 jam setelah barang diterima dengan melampirkan video unboxing."
        },
        {
            q: "Bagaimana cara melacak pesanan saya?",
            a: "Buka halaman Lacak Pesanan, masukkan nomor resi atau ID pesanan Anda untuk melihat status pengiriman terkini secara real-time."
        }
    ];

    const filteredFaqs = useMemo(() => {
        if (!searchQuery) return allFaqs.slice(0, 3);
        return allFaqs.filter(faq => 
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 overflow-hidden bg-[var(--bg-primary)]">
                {/* Ambient Glow */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--primary)]/8 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--accent-brass)]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-center"
                    >
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6">
                            Layanan NadaKita
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-ui">
                            Dukungan penuh untuk memilih, membeli, dan menikmati instrumen premium Anda dengan percaya diri.
                        </p>
                    </motion.div>

                    {/* Premium Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-12 max-w-2xl mx-auto"
                    >
                        <form onSubmit={(e) => { e.preventDefault(); }} className="relative group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary)]/0 via-[var(--accent-brass)]/20 to-[var(--primary)]/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl"></div>
                            <div className="relative flex items-center bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-full shadow-[var(--shadow-elevated)] overflow-hidden group-focus-within:border-[var(--accent-brass)] transition-colors duration-300">
                                <Search size={18} className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-brass)] transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Cari bantuan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none text-base font-ui"
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Service Categories Grid */}
            <div className="bg-[var(--bg-primary)] py-24 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                            Kategori Layanan
                        </h2>
                        <p className="text-[var(--text-secondary)] font-ui max-w-2xl">
                            Jelajahi panduan lengkap untuk setiap aspek pengalaman berbelanja Anda.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Link 
                                    to={`/help/${cat.slug}`}
                                    className="h-full block bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300 p-8 hover:border-[var(--accent-brass)] overflow-hidden relative"
                                >
                                    {/* Animated Glow on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-brass)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--accent-brass)]/20 flex items-center justify-center mb-6 text-[var(--accent-brass)] group-hover:scale-110 group-hover:bg-[var(--primary)]/20 transition-all duration-300">
                                            {cat.icon}
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-brass)] transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed flex-1">
                                            {cat.description}
                                        </p>

                                        {/* Links */}
                                        <div className="pt-6 border-t border-[var(--border-premium)] space-y-3">
                                            {cat.links.map(link => (
                                                <Link
                                                    key={link.slug}
                                                    to={`/help/${link.slug}`}
                                                    className="flex items-center justify-between text-sm text-[var(--text-secondary)] hover:text-[var(--accent-brass)] transition-colors group/link"
                                                >
                                                    <span className="font-medium">{link.name}</span>
                                                    <ChevronRight size={14} className="opacity-0 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-3 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works / Shopping Journey */}
            <div className="bg-[var(--bg-secondary)] py-24">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                            Alur Pembelian
                        </h2>
                        <p className="text-[var(--text-secondary)] font-ui max-w-2xl">
                            Perjalanan belanja Anda dimulai dari sini hingga instrumen tiba di tangan Anda.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: 1, title: 'Jelajahi Koleksi', desc: 'Temukan instrumen premium pilihan sesuai kebutuhan Anda.', icon: <Search size={24} /> },
                            { step: 2, title: 'Tambah ke Keranjang', desc: 'Pilih varian dan jumlah, lalu masukkan keranjang belanja Anda.', icon: <Zap size={24} /> },
                            { step: 3, title: 'Selesaikan Pembayaran', desc: 'Checkout aman dengan berbagai metode pembayaran terpercaya.', icon: <CreditCard size={24} /> },
                            { step: 4, title: 'Pantau Pesanan', desc: 'Lacak pengiriman real-time hingga instrumen tiba dengan aman.', icon: <Truck size={24} /> },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--accent-brass)] to-transparent"></div>
                                )}

                                <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] p-8 h-full hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
                                    {/* Step Number */}
                                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 border border-[var(--accent-brass)]/30 flex items-center justify-center mb-6 text-[var(--accent-brass)] font-display font-bold text-lg">
                                        {item.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-[var(--accent-brass)] mb-6 opacity-80">
                                        {item.icon}
                                    </div>

                                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-ui">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main FAQ & Contact */}
            <div className="bg-[var(--bg-primary)] py-24">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQ Section */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="mb-10"
                            >
                                <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-3">
                                    <CircleHelp className="text-[var(--accent-brass)]" size={32} />
                                    {searchQuery ? `Hasil Pencarian (${filteredFaqs.length})` : 'Pertanyaan Populer'}
                                </h2>
                                <p className="text-[var(--text-secondary)] font-ui">
                                    Temukan jawaban atas pertanyaan umum dari customer kami.
                                </p>
                            </motion.div>

                            {filteredFaqs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredFaqs.map((faq, i) => (
                                        <motion.details 
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: i * 0.05 }}
                                            viewport={{ once: true }}
                                            className="group bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden hover:border-[var(--accent-brass)] transition-all duration-300 open:shadow-[var(--shadow-elevated)]"
                                        >
                                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--surface-secondary)] transition-colors">
                                                <span className="font-bold text-[var(--text-primary)] pr-4 group-open:text-[var(--accent-brass)] transition-colors text-left">{faq.q}</span>
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-open:bg-[var(--accent-brass)]/20 group-open:text-[var(--accent-brass)] transition-all">
                                                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                                                </div>
                                            </summary>
                                            <div className="px-6 pb-6 text-[var(--text-secondary)] text-[15px] leading-relaxed border-t border-[var(--border-premium)] pt-5 font-ui">
                                                {faq.a}
                                            </div>
                                        </motion.details>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[var(--surface-primary)] rounded-3xl p-12 text-center border border-[var(--border-premium)]">
                                    <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--accent-brass)]/20">
                                        <Search size={28} className="text-[var(--text-muted)]" />
                                    </div>
                                    <h4 className="font-display text-xl font-bold text-[var(--text-primary)]">Pencarian Tidak Ditemukan</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-xs mx-auto font-ui">Coba kata kunci lain untuk menemukan jawaban yang Anda cari.</p>
                                </div>
                            )}

                            {!searchQuery && (
                                <Link to="/help/faq" className="mt-10 inline-flex items-center gap-2 text-[var(--accent-brass)] font-bold hover:gap-3 transition-all group">
                                    Lihat semua FAQ <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>

                        {/* Contact Sidebar */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {/* Primary Contact Card */}
                            <div className="bg-gradient-to-br from-[var(--primary)]/15 to-[var(--accent-brass)]/10 rounded-[2rem] p-8 border border-[var(--accent-brass)]/30 shadow-[0_0_20px_var(--glow-warm)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <Headphones size={24} className="text-[var(--accent-brass)]" />
                                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">Butuh Bantuan?</h3>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed font-ui">
                                    Tim customer service kami siap membantu Anda dengan respons cepat dan solusi profesional.
                                </p>
                                
                                <div className="space-y-3">
                                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[var(--surface-primary)] rounded-xl hover:bg-[var(--primary)]/5 border border-[var(--border-premium)] transition-all group">
                                        <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center text-[var(--accent-brass)]">
                                            <MessageCircle size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">WhatsApp</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Chat dengan kami</p>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]" />
                                    </a>
                                    
                                    <a href="mailto:support@nadakita.id" className="flex items-center gap-3 p-4 bg-[var(--surface-primary)] rounded-xl hover:bg-[var(--primary)]/5 border border-[var(--border-premium)] transition-all group">
                                        <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center text-[var(--accent-brass)]">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Email</p>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">support@nadakita.id</p>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]" />
                                    </a>
                                </div>
                            </div>

                            {/* Hours Card */}
                            <div className="bg-[var(--surface-primary)] rounded-2xl p-6 border border-[var(--border-premium)] shadow-[var(--shadow-subtle)]">
                                <h4 className="font-display font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                    <Clock size={18} className="text-[var(--accent-brass)]" />
                                    Jam Operasional
                                </h4>
                                <div className="space-y-3 text-sm font-ui">
                                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border-soft)]">
                                        <span className="text-[var(--text-secondary)]">Senin - Jumat</span>
                                        <span className="font-bold text-[var(--text-primary)]">09:00 - 20:00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Sabtu - Minggu</span>
                                        <span className="font-bold text-[var(--text-primary)]">10:00 - 17:00</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-6 md:px-12 text-center"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 tracking-tight">
                        Siap Menemukan Mahakarya Anda?
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto font-ui">
                        Jelajahi koleksi instrumen premium kami dan temukan yang sempurna untuk Anda.
                    </p>
                    <Link 
                        to="/explore"
                        className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[var(--primary)] text-[var(--bg-primary)] rounded-full font-ui font-bold text-sm uppercase tracking-wider hover:shadow-[0_10px_30px_var(--glow-warm)] hover:-translate-y-1 transition-all duration-300"
                    >
                        Jelajahi Koleksi
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </Layout>
    );
};
