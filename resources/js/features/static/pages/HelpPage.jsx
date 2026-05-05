import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { 
    Search, 
    HelpCircle, 
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
    ArrowRight
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
            <div className="bg-gray-950 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
                
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Ada yang bisa kami bantu?
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input 
                            type="text"
                            placeholder="Cari kendala atau pertanyaan Anda..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 mb-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-7 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <Link to={`/help/${cat.slug}`} className="block group mb-6">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                    {cat.icon}
                                </div>
                                <h3 className="font-extrabold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{cat.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {cat.description}
                                </p>
                            </Link>
                            
                            <div className="mt-auto pt-6 border-t border-gray-50">
                                <ul className="space-y-4">
                                    {cat.links.map(link => (
                                        <li key={link.slug}>
                                            <Link 
                                                to={`/help/${link.slug}`}
                                                className="flex items-center justify-between w-full text-sm font-bold text-gray-700 hover:text-orange-600 group transition-colors"
                                            >
                                                {link.name}
                                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
                <div className="grid lg:grid-cols-3 gap-16">
                    
                    {/* FAQ Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                <HelpCircle className="text-orange-600" /> 
                                {searchQuery ? `Hasil Pencarian (${filteredFaqs.length})` : 'Pertanyaan Populer'}
                            </h2>
                        </div>

                        {filteredFaqs.length > 0 ? (
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, i) => (
                                    <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 open:ring-2 open:ring-orange-100">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                            <span className="font-bold text-gray-800 pr-4 group-open:text-orange-600 transition-colors">{faq.q}</span>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-open:bg-orange-50 group-open:text-orange-600 transition-all">
                                                <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                                            </div>
                                        </summary>
                                        <div className="px-6 pb-6 text-gray-600 text-[15px] leading-relaxed border-t border-gray-50 pt-5">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Search size={24} className="text-gray-300" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h4>
                                <p className="text-gray-500 max-w-xs mx-auto">Kami tidak dapat menemukan jawaban untuk "{searchQuery}". Coba kata kunci lain.</p>
                            </div>
                        )}

                        {!searchQuery && (
                            <Link to="/help/faq" className="mt-10 inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all">
                                Lihat semua FAQ <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>

                    {/* Contact Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-orange-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
                            <div className="relative z-10">
                                <h3 className="text-xl font-extrabold mb-2">Masih Butuh Bantuan?</h3>
                                <p className="text-orange-100 text-sm mb-8">Tim support kami siap membantu Anda 24/7.</p>
                                
                                <div className="space-y-4">
                                    <a href="#" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10 group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-orange-200">Live Chat</p>
                                            <p className="text-sm font-bold">Chat Sekarang</p>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100" />
                                    </a>
                                    
                                    <a href="#" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10 group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600">
                                            <Mail size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-orange-200">Email</p>
                                            <p className="text-sm font-bold">support@nadakita.id</p>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100" />
                                    </a>

                                    <a href="#" className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10 group">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-orange-200">Call Center</p>
                                            <p className="text-sm font-bold">0800-1234-5678</p>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100" />
                                    </a>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4">Jam Operasional Studio</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Senin - Jumat</span>
                                    <span className="font-bold">09:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sabtu - Minggu</span>
                                    <span className="font-bold">10:00 - 17:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};
