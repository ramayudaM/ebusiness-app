import { FALLBACK_HERO, FALLBACK_CATEGORY } from '@/shared/utils/placeholders';
import React from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { ProductCard } from '@/shared/components/ProductCard';
import { CategoryIcon } from '@/shared/components/CategoryIcon';
import { useHomeData } from '../hooks/useHomeData';
import { AlertCircle } from 'lucide-react';

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
                    <AlertCircle size={48} className="text-red-500 mb-4" />
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

                {/* Categories Container centered over the Hero bottom maybe? For now just below */}
                <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={`cat-skel-${i}`} />)
                        ) : (
                            categories?.map((cat) => (
                                <a href={`/category/${cat.slug}`} key={cat.id} className="flex flex-col items-center group cursor-pointer">
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
                                </a>
                            ))
                        )}
                    </div>
                </section>

                {/* Flash Sale Ribbon & Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-600 tracking-wider text-white text-sm md:text-base font-extrabold px-3 py-1.5 rounded uppercase flex items-center gap-2">
                                <span className="text-yellow-300">⚡</span> FLASH SALE
                            </div>
                            <div className="flex gap-1.5 font-mono text-sm md:text-base font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">
                                <span>02</span>:<span>45</span>:<span>12</span>
                            </div>
                        </div>
                        <a href="/flash-sale" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">Lihat Semua &rarr;</a>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={`fs-skel-${i}`} />)}
                        </div>
                    ) : flash_sale?.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                            <p className="text-gray-500 font-medium">Belum ada produk Flash Sale saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {flash_sale?.map((product) => (
                                <ProductCard key={`fs-${product.id}`} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* New Arrivals Section */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
                    <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-gray-100">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Baru</h2>
                        <a href="/new-arrivals" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">Lihat Semua &rarr;</a>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
                            {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={`na-skel-${i}`} />)}
                        </div>
                    ) : new_arrivals?.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                            <p className="text-gray-500 font-medium">Belum ada produk terbaru.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
                            {new_arrivals?.map((product) => (
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
