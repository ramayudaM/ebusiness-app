import { FALLBACK_HERO, FALLBACK_CATEGORY } from '@/shared/utils/placeholders';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { useHomeData } from '../hooks/useHomeData';
import { CircleAlert, ShieldCheck, Truck, Award, Music, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

// SKELETON COMPONENTS
const CategorySkeleton = () => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-zinc-900/80 animate-pulse mb-4 border border-zinc-800"></div>
        <div className="h-3 w-20 bg-zinc-900 animate-pulse rounded"></div>
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col h-full relative backdrop-blur-sm">
        <div className="relative aspect-[4/3] bg-zinc-800/50 animate-pulse"></div>
        <div className="p-5 flex flex-col flex-1 h-40">
            <div className="h-4 bg-zinc-800/60 animate-pulse rounded w-full mb-3"></div>
            <div className="h-4 bg-zinc-800/60 animate-pulse rounded w-3/4 mb-5"></div>
            <div className="h-3 bg-zinc-800/60 animate-pulse rounded w-1/4 mb-4"></div>
            <div className="mt-auto flex flex-col gap-2">
                <div className="h-4 bg-zinc-800/60 animate-pulse rounded w-1/3"></div>
                <div className="h-5 bg-zinc-800/60 animate-pulse rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-zinc-800/60 animate-pulse rounded-xl w-full mt-5"></div>
        </div>
    </div>
);

const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export const HomePage = () => {
    // Memaksa scroll ke atas saat komponen dimuat (mengatasi bug auto-scroll)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data, isLoading, error, refetch } = useHomeData();

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col text-white transition-colors duration-300 relative overflow-hidden">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-white">Gagal Memuat Data</h2>
                    <p className="text-zinc-400 mb-6 text-center max-w-md">Terjadi kesalahan saat memuat halaman beranda. Silakan coba beberapa saat lagi.</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                    >
                        Coba Lagi
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const { hero, categories, flash_sale, new_arrivals } = data || {};

    const globalBrands = [
        { name: 'Yamaha', logo: 'https://cdn.worldvectorlogo.com/logos/yamaha-2.svg' },
        { name: 'Fender', logo: 'https://cdn.worldvectorlogo.com/logos/fender-1.svg' },
        { name: 'Gibson', logo: 'https://cdn.worldvectorlogo.com/logos/gibson-guitars.svg' },
        { name: 'Roland', logo: 'https://cdn.worldvectorlogo.com/logos/roland-2.svg' },
        { name: 'Korg', logo: 'https://cdn.worldvectorlogo.com/logos/korg.svg' },
        { name: 'Pearl', logo: 'https://cdn.worldvectorlogo.com/logos/pearl-1.svg' },
        { name: 'Marshall', logo: 'https://cdn.worldvectorlogo.com/logos/marshall-1.svg' },
        { name: 'Ibanez', logo: 'https://cdn.worldvectorlogo.com/logos/ibanez.svg' }
    ];

    const features = [
        { icon: <ShieldCheck size={28} className="text-orange-500" />, title: 'Garansi Resmi', desc: '100% Produk original dengan perlindungan garansi resmi.' },
        { icon: <Truck size={28} className="text-orange-500" />, title: 'Pengiriman Aman', desc: 'Asuransi pengiriman penuh untuk instrumen musik Anda.' },
        { icon: <Award size={28} className="text-orange-500" />, title: 'Kualitas Terjamin', desc: 'Melewati proses pengecekan kualitas (QC) yang ketat.' },
        { icon: <Music size={28} className="text-orange-500" />, title: 'Pilihan Terlengkap', desc: 'Ribuan instrumen untuk semua tingkat keahlian.' }
    ];

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col text-white transition-colors duration-300 relative z-0 overflow-x-hidden selection:bg-orange-500/30">

            {/* Global Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-orange-600/5 blur-[150px] mix-blend-screen"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-orange-700/5 blur-[150px] mix-blend-screen"></div>
            </div>

            <Navbar />

            <main className="flex-1 w-full flex flex-col items-center">

                {/* HERO SECTION */}
                <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-32 md:pt-36 md:pb-48 flex flex-col items-center text-center z-10">
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeIn}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md mb-8"
                    >
                        <Sparkles size={16} className="text-orange-500" />
                        <span className="text-sm text-zinc-300 font-medium">Temukan Harmoni Sejatimu <ArrowRight size={14} className="inline ml-1" /></span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 py-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 leading-[1.1] md:leading-[1.15]"
                    >
                        {hero?.title && !hero.title.includes('Dengar') && !hero.title.includes('Bermain')
                            ? hero.title
                            : 'Toko Alat Musik\nTerlengkap.'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-2xl text-zinc-400 max-w-3xl mb-10 leading-relaxed"
                    >
                        {hero?.subtitle && !hero.subtitle.includes('Kurasi instrumen') && !hero.subtitle.includes('Dengar')
                            ? hero.subtitle
                            : 'Miliki instrumen musik digital premium pilihan dari berbagai brand legendaris dunia. Didesain secara presisi untuk menginspirasi setiap performa dan melahirkan karya terbaik Anda.'}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <a
                            href={'/explore'}
                            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {hero?.cta_text || 'Mulai Belanja'} <ArrowRight size={18} />
                        </a>
                        <a
                            href="#features"
                            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center"
                        >
                            Lihat Layanan
                        </a>
                    </motion.div>

                    {/* Hero Massive Bottom Glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] max-w-[1200px] h-[300px] bg-orange-600/30 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[200px] bg-orange-500/50 blur-[100px] rounded-[100%] pointer-events-none -z-10 mix-blend-screen"></div>
                </section>

                {/* BRANDS SECTION */}
                <section className="w-full border-y border-zinc-900/50 bg-[#0A0A0A]/50 py-12 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Dipercaya Oleh Merek Kelas Dunia</p>

                        <div className="w-full relative flex items-center h-16">
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>

                            <motion.div
                                animate={{ x: [0, -1000] }}
                                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                                className="flex w-max items-center"
                            >
                                {[...globalBrands, ...globalBrands, ...globalBrands].map((brand, i) => (
                                    <div key={i} className="flex items-center justify-center w-32 md:w-48 mx-6 shrink-0 group/logo">
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="w-full h-8 md:h-10 object-contain filter grayscale opacity-30 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 transition-all duration-500 cursor-pointer"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'block';
                                            }}
                                        />
                                        <span className="hidden text-xl font-bold text-zinc-700 group-hover/logo:text-white uppercase transition-colors">
                                            {brand.name}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>

                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION (Why Us) */}
                <motion.section
                    id="features"
                    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeIn}
                    className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 relative"
                >
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="inline-block px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6 tracking-widest uppercase">Mengapa Kami?</div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Layanan Tanpa Kompromi</h2>
                        <p className="text-zinc-400 max-w-2xl text-lg">Kami menggabungkan kejelasan, kepercayaan, dan performa instrumen berkualitas untuk memberikan hasil yang benar-benar penting bagi karya Anda.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {features.map((feature, idx) => (
                            <motion.div key={idx} variants={fadeIn} className="relative group rounded-[2rem] p-[1px] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900/10">
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative h-full bg-[#0A0A0A] rounded-[calc(2rem-1px)] p-8 flex flex-col z-10 overflow-hidden">
                                    {/* Inner glow top right */}
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-600/10 blur-[40px] group-hover:bg-orange-500/30 transition-colors duration-500"></div>

                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                        <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* CATEGORIES SECTION (The Process / Categories) */}
                <motion.section
                    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeIn}
                    className="w-full bg-zinc-950/50 border-y border-zinc-900 py-24 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="inline-block px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6 tracking-widest uppercase">Kategori</div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Eksplorasi Instrumen Impian</h2>
                            <p className="text-zinc-400 max-w-2xl text-lg">Dari gitar klasik hingga synthesizer modern. Temukan instrumen yang tepat untuk menyempurnakan setiap melodi Anda.</p>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                            className="flex flex-wrap justify-center gap-4 md:gap-6"
                        >
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                            ) : (
                                categories?.map((cat) => (
                                    <Link to={`/explore?category=${cat.slug}`} key={cat.id}>
                                        <motion.div
                                            variants={fadeIn}
                                            whileHover={{ y: -8, scale: 1.03 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            className="group relative flex flex-col items-center w-28 md:w-36 cursor-pointer"
                                        >
                                            <div className="w-full aspect-square rounded-3xl bg-[#0A0A0A] border border-zinc-800 flex flex-col items-center justify-center p-6 mb-3 relative overflow-hidden transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_0_40px_rgba(234,88,12,0.2)]">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                {cat.icon_url ? (
                                                    <img
                                                        src={cat.icon_url}
                                                        alt={cat.name}
                                                        className="w-12 h-12 object-contain filter invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                                        onError={(e) => { e.target.src = FALLBACK_CATEGORY }}
                                                    />
                                                ) : (
                                                    <CategoryIcon name={cat.name} className="w-10 h-10 text-zinc-500 group-hover:text-orange-500 transition-colors duration-300" />
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-zinc-400 text-center group-hover:text-white transition-colors">{cat.name}</span>
                                        </motion.div>
                                    </Link>
                                ))
                            )}
                        </motion.div>
                    </div>
                </motion.section>

                {/* NEW ARRIVALS (Ready to Launch) */}
                <motion.section
                    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeIn}
                    className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 relative"
                >
                    {/* Glowing background behind title */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md"></div>
                            <Sparkles size={24} className="text-orange-500 relative z-10" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Siap untuk Memulai Karya Nyata?</h2>
                        <p className="text-zinc-400 max-w-2xl text-lg mb-8">Koleksi terbaru kami dirancang khusus bagi mereka yang mengutamakan kualitas, performa, dan harmoni sejati.</p>
                        <Link to="/explore" className="bg-white hover:bg-zinc-200 text-black font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105">
                            Jelajahi Semua Produk
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                        </div>
                    ) : new_arrivals?.length === 0 ? (
                        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-transparent"></div>
                            <p className="text-zinc-400 font-medium relative z-10">Belum ada produk terbaru saat ini.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                        >
                            {new_arrivals?.slice(0, 8).map((product) => (
                                <motion.div key={`na-${product.id}`} variants={fadeIn} className="h-full">
                                    <div className="h-full group hover:-translate-y-2 transition-transform duration-500">
                                        {/* Wraps ProductCard to match dark theme gracefully if ProductCard is light, 
                                            though preferably ProductCard inherits dark mode. */}
                                        <div className="h-full ring-1 ring-zinc-800 group-hover:ring-orange-500/50 rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl">
                                            <ProductCard product={product} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.section>

                {/* BOTTOM CTA */}
                <motion.section
                    initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeIn}
                    className="w-full max-w-7xl mx-auto px-6 mb-24 relative z-10"
                >
                    <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative group rounded-[3rem] p-[1px] overflow-hidden bg-gradient-to-b from-zinc-800 via-zinc-800 to-zinc-900/10 hover:from-orange-500/50 hover:to-orange-500/10 transition-all duration-700 shadow-2xl"
                    >
                        <div className="relative h-full bg-[#0A0A0A] rounded-[calc(3rem-1px)] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between z-10 overflow-hidden">
                            {/* Inner glows */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/5 blur-[100px] group-hover:bg-orange-500/15 transition-all duration-700 pointer-events-none"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-950/10 blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 mb-8 md:mb-0 max-w-xl text-center md:text-left">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Mulai Bermain Lebih Baik Hari Ini.</h2>
                                <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
                                    Ribuan musisi telah menemukan suara khas mereka bersama NadaKita.
                                </p>
                            </div>
                            <div className="relative z-10 flex shrink-0">
                                <Link to="/explore" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-10 py-5 rounded-full text-lg transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] hover:scale-105 flex items-center gap-3">
                                    Eksplorasi Sekarang <ChevronRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

            </main>

            <Footer />
        </div>
    );
};
