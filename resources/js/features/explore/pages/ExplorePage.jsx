import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
// Custom debounce to avoid lodash import issues
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

import { Layout } from '@/shared/components/Layout';
import { ProductCard } from '@/shared/components/ProductCard';
import { ProductCardSkeleton } from '@/shared/components/Skeleton';
import useExploreStore from '../exploreStore';

export const ExplorePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { 
        products, 
        categories, 
        meta, 
        isLoadingProducts, 
        isLoadingCategories, 
        filters, 
        setFilter, 
        setFilters,
        resetFilters,
        fetchProducts, 
        fetchCategories 
    } = useExploreStore();

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.search || '');

    // Sync URL params initially
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        
        const searchParam = queryParams.get('search');
        if (searchParam) {
            setFilter('search', searchParam);
            setLocalSearch(searchParam);
        }
        
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            setFilter('category', categoryParam);
        }

        fetchCategories();
    }, []); // Run once on mount

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
        
        // Update URL to match filters if we want deep linking
        const queryParams = new URLSearchParams(location.search);
        
        if (filters.search) {
            queryParams.set('search', filters.search);
        } else {
            queryParams.delete('search');
        }

        if (filters.category) {
            queryParams.set('category', filters.category);
        } else {
            queryParams.delete('category');
        }
        
        navigate({ search: queryParams.toString() }, { replace: true });
        
    }, [
        filters.search, 
        filters.category, 
        filters.min_price, 
        filters.max_price, 
        filters.in_stock, 
        filters.sort_by, 
        filters.sort_order, 
        filters.page
    ]);

    // Debounced search logic to prevent API spam typing
    const debouncedSearch = useCallback(
        debounce((val) => {
            setFilter('search', val);
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= meta.last_page) {
            setFilter('page', newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        const [by, order] = value.split('-');
        setFilters({ sort_by: by, sort_order: order });
    };

    const formatPriceDisplay = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceInput = (key, value) => {
        const numericValue = value.replace(/\D/g, '');
        setFilter(key, numericValue);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-10 selection:bg-orange-500/30">
                
                {/* Desktop Sidebar Filter */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)] sticky top-28">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                                <Filter size={20} className="text-orange-500" /> Filter
                            </h2>
                            <button 
                                onClick={resetFilters}
                                className="text-sm text-red-400 hover:text-red-300 font-bold transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Cari Produk</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Kata kunci..." 
                                    value={localSearch}
                                    onChange={handleSearchChange}
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all text-white placeholder-zinc-600"
                                />
                                <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Kategori</label>
                            {isLoadingCategories ? (
                                <div className="space-y-2.5">
                                    {[1,2,3,4].map(i => <div key={i} className="h-5 bg-zinc-900 animate-pulse rounded w-3/4"></div>)}
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="category"
                                            checked={filters.category === ''}
                                            onChange={() => setFilter('category', '')}
                                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 bg-[#050505] border-zinc-800"
                                        />
                                        <span className={`text-sm transition-colors ${filters.category === '' ? 'text-orange-500 font-bold' : 'text-zinc-400 group-hover:text-white'}`}>
                                            Semua Kategori
                                        </span>
                                    </label>
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                type="radio" 
                                                name="category"
                                                checked={filters.category === cat.slug}
                                                onChange={() => setFilter('category', cat.slug)}
                                                className="w-4 h-4 text-orange-600 focus:ring-orange-500 bg-[#050505] border-zinc-800"
                                            />
                                            <span className={`text-sm flex-1 transition-colors ${filters.category === cat.slug ? 'text-orange-500 font-bold' : 'text-zinc-400 group-hover:text-white'}`}>
                                                {cat.name}
                                            </span>
                                            <span className="text-xs text-zinc-500 font-medium">({cat.products_count})</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Harga (Rp)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Min" 
                                    value={formatPriceDisplay(filters.min_price)}
                                    onChange={(e) => handlePriceInput('min_price', e.target.value)}
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none text-white placeholder-zinc-600"
                                />
                                <span className="text-zinc-600 font-semibold">-</span>
                                <input 
                                    type="text" 
                                    placeholder="Max" 
                                    value={formatPriceDisplay(filters.max_price)}
                                    onChange={(e) => handlePriceInput('max_price', e.target.value)}
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none text-white placeholder-zinc-600"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.in_stock}
                                        onChange={(e) => setFilter('in_stock', e.target.checked)}
                                        className="w-5 h-5 appearance-none border border-zinc-800 bg-[#050505] rounded focus:ring-1 focus:ring-orange-500/50 focus:outline-none checked:bg-orange-600 checked:border-orange-600 transition-colors"
                                    />
                                    {filters.in_stock && <Check size={14} className="absolute inset-0 m-auto text-white pointer-events-none" />}
                                </div>
                                <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                                    Hanya stok tersedia
                                </span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full flex flex-col">
                    
                    {/* Top Bar */}
                    <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-black text-white leading-tight">
                                {filters.category 
                                    ? categories.find(c => c.slug === filters.category)?.name || 'Katalog Produk' 
                                    : 'Eksplorasi Instrumen'
                                }
                            </h1>
                            <p className="text-sm text-zinc-400 mt-1.5 font-medium">
                                {isLoadingProducts 
                                    ? 'Memuat produk...' 
                                    : `Menampilkan ${products.length} dari total ${meta.total} produk`
                                }
                                {filters.search && <span className="text-orange-500 font-bold"> untuk "{filters.search}"</span>}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all border border-zinc-800"
                            >
                                <Filter size={16} className="text-orange-500" /> Filter
                            </button>

                            <div className="relative shrink-0">
                                <select 
                                    value={`${filters.sort_by}-${filters.sort_order}`}
                                    onChange={handleSortChange}
                                    className="appearance-none bg-[#050505] border border-zinc-800 text-zinc-300 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none cursor-pointer transition-all"
                                >
                                    <option value="created_at-desc">Terbaru</option>
                                    <option value="price_sen-asc">Harga Terendah</option>
                                    <option value="price_sen-desc">Harga Tertinggi</option>
                                    <option value="name-asc">Nama (A-Z)</option>
                                    <option value="average_rating-desc">Ulasan Terbaik</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoadingProducts ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center bg-zinc-900/40 rounded-2xl border border-zinc-800/80 backdrop-blur-sm shadow-xl transition-all">
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-5 border border-zinc-800">
                                    <Search size={32} className="text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Produk tidak ditemukan</h3>
                                <p className="text-zinc-400 mb-6 max-w-md mx-auto px-4">
                                    Kami tidak dapat menemukan produk yang sesuai dengan filter pencarian Anda. 
                                    Coba ubah kata kunci atau reset filter.
                                </p>
                                <button 
                                    onClick={resetFilters}
                                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoadingProducts && meta?.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button 
                                onClick={() => handlePageChange(meta.current_page - 1)}
                                disabled={meta.current_page === 1}
                                className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Prev
                            </button>
                            <div className="flex gap-1.5">
                                {[...Array(meta.last_page)].map((_, i) => {
                                    const page = i + 1;
                                    if (
                                        page === 1 || 
                                        page === meta.last_page || 
                                        (page >= meta.current_page - 1 && page <= meta.current_page + 1)
                                    ) {
                                        return (
                                            <button 
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl border transition-all ${
                                                    meta.current_page === page 
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                                                        : 'bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === meta.current_page - 2 || page === meta.current_page + 2) {
                                        return <span key={page} className="w-10 h-10 flex items-center justify-center text-zinc-650 font-bold">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button 
                                onClick={() => handlePageChange(meta.current_page + 1)}
                                disabled={meta.current_page === meta.last_page}
                                className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Filter Drawer (Modal) */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden flex justify-end">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsMobileFilterOpen(false)}
                    ></div>
                    <div className="relative w-[85%] max-w-sm bg-[#0A0A0A] border-l border-zinc-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right transition-all">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-[#050505]">
                            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                                <Filter size={20} className="text-orange-500" /> Filter
                            </h2>
                            <button 
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shadow-sm transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-300 mb-2">Cari Produk</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Kata kunci..." 
                                            value={localSearch}
                                            onChange={handleSearchChange}
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none text-white placeholder-zinc-600"
                                        />
                                        <Search size={18} className="absolute left-3.5 top-3.5 text-zinc-500" />
                                    </div>
                                </div>

                                 {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-300 mb-2">Kategori</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="category_mobile"
                                                checked={filters.category === ''}
                                                onChange={() => setFilter('category', '')}
                                                className="w-5 h-5 text-orange-600 focus:ring-orange-500 bg-[#050505] border-zinc-850"
                                            />
                                            <span className={`text-base font-medium transition-colors ${filters.category === '' ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}>
                                                Semua Kategori
                                            </span>
                                        </label>
                                        {categories.map((cat) => (
                                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="category_mobile"
                                                    checked={filters.category === cat.slug}
                                                    onChange={() => setFilter('category', cat.slug)}
                                                    className="w-5 h-5 text-orange-600 focus:ring-orange-500 bg-[#050505] border-zinc-850"
                                                />
                                                <span className={`text-base flex-1 transition-colors ${filters.category === cat.slug ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}>
                                                    {cat.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                 {/* Price */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-300 mb-2">Harga</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Min" 
                                            value={formatPriceDisplay(filters.min_price)}
                                            onChange={(e) => handlePriceInput('min_price', e.target.value)}
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white placeholder-zinc-650 focus:ring-1 focus:ring-orange-500/50"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Max" 
                                            value={formatPriceDisplay(filters.max_price)}
                                            onChange={(e) => handlePriceInput('max_price', e.target.value)}
                                            className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white placeholder-zinc-650 focus:ring-1 focus:ring-orange-500/50"
                                        />
                                    </div>
                                </div>

                                 {/* Stock */}
                                <label className="flex items-center gap-3 cursor-pointer bg-[#050505] p-4 rounded-xl border border-zinc-900 transition-colors">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={filters.in_stock}
                                            onChange={(e) => setFilter('in_stock', e.target.checked)}
                                            className="w-6 h-6 appearance-none border border-zinc-800 bg-[#050505] rounded focus:ring-1 focus:ring-orange-500/50 checked:bg-orange-600 checked:border-orange-600 transition-colors"
                                        />
                                        {filters.in_stock && <Check size={16} className="absolute inset-0 m-auto text-white pointer-events-none" />}
                                    </div>
                                    <span className="text-sm font-bold text-zinc-300">
                                        Tampilkan stok tersedia
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="p-5 border-t border-zinc-900 flex gap-3 bg-[#050505] transition-colors">
                            <button 
                                onClick={resetFilters}
                                className="px-4 py-3 flex-1 bg-red-950/20 border border-red-900/20 text-red-400 font-bold rounded-xl active:scale-95 transition-all hover:bg-red-900/20"
                            >
                                Reset
                            </button>
                            <button 
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="px-4 py-3 flex-[2] bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95 transition-all"
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </Layout>
    );
};
