import { FALLBACK_HERO, FALLBACK_CATEGORY } from '@/shared/utils/placeholders';
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { useHomeData } from '../hooks/useHomeData';
import { CircleAlert, ShieldCheck, Truck, Award, Music } from 'lucide-react';

// SKELETON COMPONENTS
const CategorySkeleton = () => (
    <div className="flex flex-col items-center">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 animate-pulse mb-3"></div>
        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full relative">
        <div className="relative aspect-[4/3] bg-gray-200 animate-pulse"></div>
        <div className="p-4 flex flex-col flex-1 h-36">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
            <div className="h-2 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
            <div className="mt-auto flex flex-col gap-1">
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-full mt-4"></div>
        </div>
    </div>
);

export const HomePage = () => {
    const { data, isLoading, error, refetch } = useHomeData();

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <CircleAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Gagal Memuat Data</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-md">Terjadi kesalahan saat memuat halaman beranda. Silakan coba beberapa saat lagi.</p>
                    <button 
                        onClick={() => refetch()}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
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

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-900">
            <Navbar />
            
            <main className="flex-1 w-full overflow-hidden">
                {/* Hero Section */}
                <section className="relative bg-gray-900 overflow-hidden md:aspect-[3/1] max-h-[600px] min-h-[350px] md:min-h-[300px] rounded-b-xl md:rounded-lg mx-auto w-full md:w-[96%] mt-0 md:mt-4 shadow-lg">
                    {isLoading ? (
                        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-black/60 z-10 w-full h-full"></div>
                            <img 
                                src={hero?.image_url || FALLBACK_HERO} 
                                alt="Hero" 
                                className="absolute inset-0 w-full h-full object-cover z-0" 
                                onError={(e) => { e.target.src = FALLBACK_HERO }}
                            />
                            <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white w-full h-full">
                                <div className="flex flex-col justify-center items-center md:items-start h-full py-12 md:py-0">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 max-w-3xl leading-tight">
                                        {hero?.title || 'Dengar. Beli. Bermain.'}
                                    </h1>
                                    <p className="text-sm md:text-lg lg:text-xl max-w-2xl mb-8 md:mb-10 text-gray-200">
                                        {hero?.subtitle || 'Kurasi instrumen musik pilihan dari maestro untuk inspirasi tanpa batas dalam setiap nada yang Anda ciptakan.'}
                                    </p>
                                    <a 
                                        href={hero?.cta_link || '/explore'} 
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3.5 rounded transition-all shadow-md text-sm md:text-base border border-orange-500 hover:scale-105 inline-block"
                                    >
                                        {hero?.cta_text || 'Mulai Belanja'}
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* Categories Container */}
                <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                        ) : (
                            categories?.map((cat) => (
                                <Link to={`/explore?category=${cat.slug}`} key={cat.id} className="flex flex-col items-center group cursor-pointer">
                                    <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-3.5 mb-3 group-hover:shadow-md group-hover:border-orange-200 transition-all group-hover:-translate-y-1 text-gray-500 group-hover:text-orange-600">
                                        {cat.icon_url ? (
                                            <img 
                                                src={cat.icon_url} 
                                                alt={cat.name} 
                                                className="w-full h-full object-contain filter group-hover:sepia group-hover:hue-rotate-[15deg] transition-all"
                                                onError={(e) => { e.target.src = FALLBACK_CATEGORY }}
                                            />
                                        ) : (
                                            <CategoryIcon name={cat.name} className="w-6 h-6 md:w-8 md:h-8" />
                                        )}
                                    </div>
                                    <span className="text-[11px] md:text-xs font-semibold text-gray-700 text-center group-hover:text-orange-600 leading-tight block truncate w-full px-1">{cat.name}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                {/* Features Section (Replacement for Flash Sale) */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <ShieldCheck size={32} className="text-orange-600" />,
                                title: 'Garansi Resmi',
                                desc: '100% Produk original dengan perlindungan garansi resmi dari distributor.'
                            },
                            {
                                icon: <Truck size={32} className="text-orange-600" />,
                                title: 'Pengiriman Aman',
                                desc: 'Asuransi pengiriman penuh untuk setiap instrumen musik yang Anda pesan.'
                            },
                            {
                                icon: <Award size={32} className="text-orange-600" />,
                                title: 'Kualitas Terjamin',
                                desc: 'Setiap instrumen melewati proses pengecekan kualitas (QC) yang ketat sebelum dikirim.'
                            },
                            {
                                icon: <Music size={32} className="text-orange-600" />,
                                title: 'Pilihan Terlengkap',
                                desc: 'Menyediakan ribuan instrumen dan aksesori musik untuk semua tingkat keahlian.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Brands Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 overflow-hidden relative">
                    <div className="flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Merek Kelas Dunia Tersedia di Sini</h3>
                        
                        <div className="w-full relative flex items-center h-20">
                            {/* Left Fade */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                            
                            {/* Marquee Track */}
                            <div className="flex w-max animate-marquee hover-pause items-center">
                                {[...globalBrands, ...globalBrands].map((brand, i) => (
                                    <div key={i} className="flex items-center justify-center w-32 md:w-48 mx-6 shrink-0 group/logo">
                                        <img 
                                            src={brand.logo} 
                                            alt={brand.name} 
                                            className="w-full h-8 md:h-12 object-contain filter grayscale group-hover/logo:grayscale-0 opacity-50 group-hover/logo:opacity-100 transition-all duration-300 cursor-pointer"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'block';
                                            }}
                                        />
                                        <span className="hidden text-xl md:text-2xl font-black text-gray-400 group-hover/logo:text-gray-800 tracking-tighter uppercase transition-colors">
                                            {brand.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Right Fade */}
                            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
                        </div>
                    </div>
                </section>                {/* New Arrivals Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
                    <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-gray-100">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Koleksi Terbaru</h2>
                        <Link to="/explore" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">Lihat Semua &rarr;</Link>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
                            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                        </div>
                    ) : new_arrivals?.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                            <p className="text-gray-500 font-medium">Belum ada produk terbaru.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
                            {new_arrivals?.slice(0, 8).map((product) => (
                                <ProductCard key={`na-${product.id}`} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};
