import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { useHomeData } from '../hooks/useHomeData';
import { ShieldCheck, Truck, Award, Music, ArrowRight, Play, CircleAlert } from 'lucide-react';
import { FALLBACK_HERO, FALLBACK_CATEGORY } from '@/shared/utils/placeholders';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CategorySkeleton = () => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--surface-secondary)] border border-[var(--border-premium)] animate-pulse mb-4"></div>
        <div className="h-3 w-16 bg-[var(--surface-secondary)] animate-pulse rounded"></div>
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-3xl overflow-hidden flex flex-col h-full relative">
        <div className="relative aspect-[4/3] bg-[var(--surface-secondary)] animate-pulse"></div>
        <div className="p-6 flex flex-col flex-1 h-40">
            <div className="h-4 bg-[var(--surface-secondary)] animate-pulse rounded w-full mb-3"></div>
            <div className="h-4 bg-[var(--surface-secondary)] animate-pulse rounded w-3/4 mb-5"></div>
            <div className="h-3 bg-[var(--surface-secondary)] animate-pulse rounded w-1/4 mb-5"></div>
            <div className="mt-auto h-10 bg-[var(--surface-secondary)] animate-pulse rounded w-full"></div>
        </div>
    </div>
);

export const HomePage = () => {
    const { data, isLoading, error, refetch } = useHomeData();
    const containerRef = useRef(null);
    const heroImageRef = useRef(null);

    useGSAP(() => {
        if (isLoading || error) return;

        const tl = gsap.timeline();

        // Hero Entrance
        tl.fromTo('.hero-text-anim', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
        );

        // 3D/Floating Guitar Effect
        if (heroImageRef.current) {
            gsap.to(heroImageRef.current, {
                y: -15,
                rotationX: 2,
                rotationY: -2,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.fromTo(heroImageRef.current,
                { scale: 1.1, opacity: 0, z: -100 },
                { scale: 1, opacity: 1, z: 0, duration: 1.5, ease: 'power3.out' },
                "<" // start with hero text
            );
        }

        // Scroll Reveal Sections
        const sections = gsap.utils.toArray('.reveal-section');
        sections.forEach((section) => {
            gsap.fromTo(section,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

    }, { dependencies: [isLoading, error], scope: containerRef });

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-ui text-[var(--text-primary)]">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Gagal Memuat Data</h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-center max-w-md">Terjadi kesalahan saat memuat halaman beranda.</p>
                    <button
                        onClick={() => refetch()}
                        className="btn-atelier-primary"
                    >
                        Coba Lagi
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const { hero, categories, new_arrivals } = data || {};

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

    return (
        <div ref={containerRef} className="min-h-screen bg-[var(--bg-primary)] font-ui flex flex-col text-[var(--text-primary)] transition-colors duration-500 selection:bg-[var(--primary)] selection:text-[var(--bg-primary)]">
            <Navbar />

            <main className="flex-1 w-full overflow-hidden">
                {/* 1. HERO SECTION (THE STAR) */}
                <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--bg-primary)]">
                    {/* Background Depth Effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)]/30 to-[var(--bg-primary)] pointer-events-none"></div>
                    <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen dark:mix-blend-lighten"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[var(--accent-brass)]/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen dark:mix-blend-lighten"></div>
                    
                    {/* Floating Particles (CSS) */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"></div>

                    <div className="container-page relative z-10 flex flex-col lg:flex-row items-center justify-between h-full py-12 gap-12 lg:gap-0">
                        
                        {/* Hero Typography */}
                        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <p className="hero-text-anim text-eyebrow text-[var(--primary)] mb-6 flex items-center gap-4">
                                <span className="w-8 h-px bg-[var(--primary)] hidden lg:block"></span>
                                Koleksi Eksklusif 2026
                            </p>
                            
                            <h1 className="hero-text-anim font-display text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.9] tracking-tight mb-8">
                                Temukan <br/>
                                <span className="italic text-[var(--primary)]">Nada</span> yang<br/>
                                Menjadi Ceritamu.
                            </h1>
                            
                            <p className="hero-text-anim text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-lg mb-10 leading-relaxed">
                                {hero?.subtitle || 'Kurasi instrumen musik pilihan dari maestro untuk inspirasi tanpa batas dalam setiap nada yang Anda ciptakan. Hadir dengan kualitas premium.'}
                            </p>
                            
                            <div className="hero-text-anim flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                                <Link
                                    to="/explore"
                                    className="w-full sm:w-auto btn-atelier-primary px-10 py-5 text-xs tracking-widest uppercase group"
                                >
                                    Belanja Sekarang
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-full text-xs font-bold tracking-widest uppercase text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors group">
                                    <div className="w-10 h-10 rounded-full border border-[var(--border-premium)] flex items-center justify-center group-hover:border-[var(--primary)] transition-colors">
                                        <Play size={12} className="ml-1" />
                                    </div>
                                    Tonton Profil
                                </button>
                            </div>
                        </div>

                        {/* Hero 3D Visual */}
                        <div className="w-full lg:w-7/12 relative flex items-center justify-center lg:justify-end min-h-[500px] mt-10 lg:mt-0">
                            {/* Premium 3D Stage/Pedestal */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-10 w-[85%] h-40 bg-gradient-to-t from-[var(--primary)]/10 to-transparent rounded-[100%] blur-2xl transform perspective-1000 rotateX-75 pointer-events-none"></div>
                            
                            {/* Inner Stage Core */}
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-20 w-[60%] h-8 bg-black/40 dark:bg-black/80 rounded-[100%] blur-lg transform perspective-1000 rotateX-75"></div>
                            
                            {/* Floating Neon Ring */}
                            <motion.div 
                                animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border border-[var(--primary)]/20 rounded-full blur-[2px]"
                            ></motion.div>
                            
                            {/* Spotlight glow */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--primary-soft)_0%,transparent_50%)] pointer-events-none"></div>

                            {isLoading ? (
                                <div className="w-[200px] h-[500px] bg-[var(--surface-secondary)] animate-pulse rounded-full blur-xl"></div>
                            ) : (
                                <div ref={heroImageRef} className="relative z-20 w-[80%] md:w-[60%] lg:w-[70%] max-w-[500px] perspective-[2000px] transform-style-3d">
                                    {/* Transparent PNG Guitar for true 3D floating effect */}
                                    <img
                                        src={hero?.image_url?.includes('transparent') ? hero.image_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fender_Stratocaster.png/800px-Fender_Stratocaster.png'}
                                        alt="Premium Instrument"
                                        className="w-full h-auto object-contain drop-shadow-[0_40px_30px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_50px_40px_rgba(0,0,0,0.9)] transform -rotate-12 hover:rotate-0 transition-transform duration-700 ease-out"
                                        style={{ transform: 'translateZ(80px)' }}
                                    />
                                    {/* Sub-shadow just behind the guitar for depth */}
                                    <img
                                        src={hero?.image_url?.includes('transparent') ? hero.image_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fender_Stratocaster.png/800px-Fender_Stratocaster.png'}
                                        alt="Shadow"
                                        className="absolute inset-0 w-full h-auto object-contain blur-2xl opacity-40 brightness-0 transform -rotate-12"
                                        style={{ transform: 'translateZ(0px) translateY(20px)' }}
                                    />
                                </div>
                            )}

                            {/* Floating UI Elements */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 left-0 lg:-left-10 bg-[var(--surface-primary)]/80 backdrop-blur-xl border border-[var(--border-premium)] px-6 py-4 rounded-2xl shadow-xl z-30"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Kurasi</p>
                                <p className="font-display text-2xl">Masterpiece</p>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 right-0 lg:-right-5 bg-[var(--surface-primary)]/80 backdrop-blur-xl border border-[var(--border-premium)] px-6 py-4 rounded-2xl shadow-xl z-30 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                    <Award size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Garansi</p>
                                    <p className="font-display text-xl">Seumur Hidup</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 2. BRAND STORY / STUDIO ATMOSPHERE SECTION */}
                <section className="reveal-section py-24 md:py-32 bg-[var(--surface-primary)] border-y border-[var(--border-premium)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
                    <div className="container-page flex flex-col md:flex-row items-center gap-16 relative z-10">
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop" 
                                    alt="Atelier Atmosphere" 
                                    className="w-full h-full object-cover filter grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <p className="font-display text-3xl text-white">Di Balik Layar</p>
                                    <p className="text-white/70 text-sm mt-2 font-medium">Studio kurasi kami di pusat seni suara.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center">
                            <p className="text-eyebrow text-[var(--primary)] mb-6">Filosofi NadaKita</p>
                            <h2 className="text-section-title font-display mb-8">Bukan Sekadar Alat,<br/>Melainkan <span className="italic text-[var(--primary)]">Jiwa.</span></h2>
                            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
                                Kami percaya bahwa setiap instrumen memiliki suara yang menunggu untuk ditemukan. Di NadaKita Atelier, kami tidak hanya menjual gitar atau piano; kami mengkurasi teman perjalanan musikal Anda.
                            </p>
                            <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                                Melalui proses seleksi yang ketat oleh para ahli, kami memastikan bahwa setiap karya yang sampai ke tangan Anda memiliki resonansi, karakter, dan kualitas tanpa kompromi.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="font-display text-4xl text-[var(--primary)] mb-1">5K+</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Karya Dikurasi</p>
                                </div>
                                <div className="w-px h-12 bg-[var(--border-premium)]"></div>
                                <div className="text-center">
                                    <p className="font-display text-4xl text-[var(--primary)] mb-1">12</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Ahli Luthier</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. FEATURED CATEGORIES */}
                <section className="reveal-section py-24 md:py-32 container-page">
                    <div className="text-center mb-16">
                        <p className="text-eyebrow text-[var(--primary)] mb-4">Eksplorasi</p>
                        <h2 className="text-section-title font-display">Koleksi <span className="italic">Kategori</span></h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                        ) : (
                            categories?.slice(0, 4).map((cat, index) => (
                                <Link 
                                    to={`/explore?category=${cat.slug}`} 
                                    key={cat.id} 
                                    className="group flex flex-col items-center p-8 bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] hover:border-[var(--primary)] hover:bg-[var(--surface-secondary)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                                    <div className="w-20 h-20 rounded-2xl bg-[var(--bg-primary)] shadow-inner border border-[var(--border-soft)] flex items-center justify-center p-4 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 text-[var(--primary)]">
                                        {cat.icon_url ? (
                                            <img
                                                src={cat.icon_url}
                                                alt={cat.name}
                                                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                                                onError={(e) => { e.target.src = FALLBACK_CATEGORY }}
                                            />
                                        ) : (
                                            <CategoryIcon name={cat.name} className="w-8 h-8" />
                                        )}
                                    </div>
                                    <span className="font-display text-2xl relative z-10">{cat.name}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-2 relative z-10 group-hover:text-[var(--primary)] transition-colors">Eksplor &rarr;</span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                {/* 4. MENGAPA NADAKITA? / PREMIUM SERVICE */}
                <section className="reveal-section py-24 md:py-32 bg-[var(--bg-secondary)] border-y border-[var(--border-premium)]">
                    <div className="container-page">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <p className="text-eyebrow text-[var(--primary)] mb-4">Standar Kami</p>
                                <h2 className="text-section-title font-display">Mengapa <span className="italic">NadaKita?</span></h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <ShieldCheck size={28} />,
                                    title: 'Otentisitas Dijamin',
                                    desc: 'Sertifikat keaslian resmi untuk setiap karya yang Anda bawa pulang.'
                                },
                                {
                                    icon: <Truck size={28} />,
                                    title: 'Logistik White-Glove',
                                    desc: 'Pengiriman khusus dengan asuransi penuh dan penanganan ekstra hati-hati.'
                                },
                                {
                                    icon: <Award size={28} />,
                                    title: 'Kurasi Maestro',
                                    desc: 'Standar QC tertinggi oleh teknisi berpengalaman di industri.'
                                },
                                {
                                    icon: <Music size={28} />,
                                    title: 'Ruang Uji Akustik',
                                    desc: 'Konsultasi dan pengujian suara komprehensif sebelum pembelian.'
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-[var(--surface-primary)] p-8 rounded-[2rem] border border-[var(--border-premium)] hover:border-[var(--primary)]/50 transition-colors duration-500 flex flex-col group relative overflow-hidden">
                                    <div className="w-14 h-14 bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-2xl flex items-center justify-center mb-6 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-primary)] transition-colors duration-500">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. NEW ARRIVALS / FEATURED INSTRUMENTS */}
                <section className="reveal-section py-24 md:py-32 container-page">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-eyebrow text-[var(--primary)] mb-4">Mahakarya Baru</p>
                            <h2 className="text-section-title font-display">Tiba di <span className="italic">Atelier</span></h2>
                        </div>
                        <Link to="/explore" className="btn-atelier-secondary py-3 px-6 text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                            Lihat Galeri <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                        </div>
                    ) : new_arrivals?.length === 0 ? (
                        <div className="bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-[2rem] p-16 text-center shadow-sm">
                            <p className="text-[var(--text-secondary)] font-medium">Koleksi sedang dipersiapkan di studio.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {new_arrivals?.slice(0, 4).map((product) => (
                                <ProductCard key={`na-${product.id}`} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* 6. MARQUEE BRANDS */}
                <section className="py-24 border-y border-[var(--border-premium)] bg-gradient-to-b from-[var(--surface-primary)] to-[var(--bg-primary)] overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[var(--surface-primary)] to-transparent z-10 pointer-events-none"></div>
                    
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Dipercaya oleh Maestro di Seluruh Dunia</p>
                    </div>

                    <div className="flex w-max animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] items-center">
                        {[...globalBrands, ...globalBrands, ...globalBrands, ...globalBrands].map((brand, i) => (
                            <div key={i} className="flex flex-col items-center justify-center w-32 md:w-56 mx-8 md:mx-12 shrink-0 group/logo cursor-pointer">
                                <div className="h-16 md:h-20 w-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover/logo:-translate-y-2">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-8 md:h-10 object-contain filter grayscale opacity-30 dark:invert dark:opacity-20 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                    <span className="hidden text-2xl md:text-3xl font-display font-bold text-[var(--text-muted)] group-hover/logo:text-[var(--text-primary)] tracking-wide uppercase transition-colors">
                                        {brand.name}
                                    </span>
                                </div>
                                <div className="w-0 h-px bg-[var(--primary)] group-hover/logo:w-12 transition-all duration-500 opacity-0 group-hover/logo:opacity-100"></div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none"></div>
                </section>

                {/* 7. BOTTOM CTA SECTION */}
                <section className="reveal-section relative py-32 overflow-hidden bg-[var(--primary)] text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop')] opacity-10 object-cover mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)] to-transparent"></div>
                    
                    <div className="container-page relative z-10 flex flex-col items-center text-center">
                        <p className="text-eyebrow text-white/70 mb-6">Mulai Perjalanan Anda</p>
                        <h2 className="font-display text-[3rem] md:text-[5rem] leading-none mb-8">
                            Saatnya Anda <span className="italic font-light">Bermain.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 font-medium">
                            Koleksi eksklusif kami menunggu sentuhan Anda. Jadikan setiap ruang penuh dengan harmoni.
                        </p>
                        <Link
                            to="/explore"
                            className="bg-white text-[var(--primary)] px-10 py-5 rounded-full font-ui text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
                        >
                            JELAJAHI SEKARANG
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
