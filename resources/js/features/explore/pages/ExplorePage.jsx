import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
// Custom debounce to avoid lodash import issues
function debounce(func, wait) {
    let timeout;
    return function (...args) {
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
            <div className="container-page pt-32 pb-12 flex flex-col lg:flex-row gap-8 min-h-screen">

                {/* Desktop Sidebar Filter */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="bg-[var(--surface-primary)] p-6 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] flex items-center gap-2">
                                <Filter size={18} className="text-[var(--primary)]" /> Filter
                            </h2>
                            <button
                                onClick={resetFilters}
                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Pencarian</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari mahakarya..."
                                    value={localSearch}
                                    onChange={handleSearchChange}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--primary)] outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                />
                                <Search size={16} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Kategori</label>
                            {isLoadingCategories ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-5 bg-[var(--surface-secondary)] rounded animate-pulse w-3/4"></div>)}
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.category === '' ? 'border-[var(--primary)]' : 'border-[var(--border-soft)] group-hover:border-[var(--primary)]/50'}`}>
                                            {filters.category === '' && <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === ''}
                                            onChange={() => setFilter('category', '')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm font-medium transition-colors ${filters.category === '' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                                            Semua Koleksi
                                        </span>
                                    </label>
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filters.category === cat.slug ? 'border-[var(--primary)]' : 'border-[var(--border-soft)] group-hover:border-[var(--primary)]/50'}`}>
                                                {filters.category === cat.slug && <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={filters.category === cat.slug}
                                                onChange={() => setFilter('category', cat.slug)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-medium flex-1 transition-colors ${filters.category === cat.slug ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                                                {cat.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--surface-secondary)] px-2 py-0.5 rounded-full">{cat.products_count}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Rentang Nilai</label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-3.5 text-[10px] font-bold text-[var(--text-muted)]">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        value={formatPriceDisplay(filters.min_price)}
                                        onChange={(e) => handlePriceInput('min_price', e.target.value)}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-8 pr-3 py-3 text-sm font-medium focus:border-[var(--primary)] outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    />
                                </div>
                                <span className="text-[var(--text-muted)] font-medium">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-3.5 text-[10px] font-bold text-[var(--text-muted)]">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        value={formatPriceDisplay(filters.max_price)}
                                        onChange={(e) => handlePriceInput('max_price', e.target.value)}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-8 pr-3 py-3 text-sm font-medium focus:border-[var(--primary)] outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer group bg-[var(--bg-primary)] border border-[var(--border-soft)] p-4 rounded-xl hover:border-[var(--primary)]/50 transition-colors">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.in_stock ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)]'}`}>
                                    {filters.in_stock && <Check size={14} className="text-[var(--bg-primary)]" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={filters.in_stock}
                                    onChange={(e) => setFilter('in_stock', e.target.checked)}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                    Hanya stok tersedia
                                </span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full flex flex-col">

                    {/* Top Bar */}
                    <div className="bg-[var(--surface-primary)] p-6 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] leading-tight mb-2">
                                {filters.category
                                    ? categories.find(c => c.slug === filters.category)?.name || 'Koleksi Atelier'
                                    : 'Eksplorasi Mahakarya'
                                }
                            </h1>
                            <p className="text-sm text-[var(--text-secondary)] font-medium">
                                {isLoadingProducts
                                    ? 'Mengkurasi karya...'
                                    : `Menemukan ${meta.total} instrumen terpilih`
                                }
                                {filters.search && <span> untuk <strong className="text-[var(--primary)] font-bold">"{filters.search}"</strong></span>}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-5 py-3 bg-[var(--bg-primary)] border border-[var(--border-soft)] hover:border-[var(--primary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                            >
                                <Filter size={14} /> Filter
                            </button>

                            <div className="relative shrink-0">
                                <select
                                    value={`${filters.sort_by}-${filters.sort_order}`}
                                    onChange={handleSortChange}
                                    className="appearance-none bg-[var(--bg-primary)] border border-[var(--border-soft)] hover:border-[var(--primary)] text-[var(--text-primary)] text-sm font-bold rounded-xl pl-5 pr-12 py-3 focus:border-[var(--primary)] outline-none cursor-pointer transition-colors shadow-sm"
                                >
                                    <option value="created_at-desc">Kurasi Terbaru</option>
                                    <option value="price_sen-asc">Nilai Terendah</option>
                                    <option value="price_sen-desc">Nilai Tertinggi</option>
                                    <option value="name-asc">Nama (A-Z)</option>
                                    <option value="average_rating-desc">Apresiasi Tertinggi</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoadingProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center flex flex-col items-center bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                                <div className="w-24 h-24 bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-full flex items-center justify-center mb-6 relative z-10 text-[var(--primary)]">
                                    <Search size={32} />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3 relative z-10">Karya Tidak Ditemukan</h3>
                                <p className="text-[var(--text-secondary)] font-medium mb-8 max-w-md mx-auto relative z-10">
                                    Kami tidak dapat menemukan mahakarya yang sesuai dengan kriteria Anda. 
                                    Mungkin Anda ingin menyesuaikan filter atau mencoba kata kunci lain.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="btn-atelier-primary px-8 py-4 relative z-10"
                                >
                                    Hapus Semua Filter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoadingProducts && meta?.last_page > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-3">
                            <button
                                onClick={() => handlePageChange(meta.current_page - 1)}
                                disabled={meta.current_page === 1}
                                className="px-6 py-3 bg-[var(--surface-primary)] border border-[var(--border-premium)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--border-premium)] disabled:hover:text-[var(--text-primary)] transition-all"
                            >
                                Prev
                            </button>
                            <div className="flex gap-2">
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
                                                className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-full border transition-all ${meta.current_page === page
                                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-orange-500/20'
                                                    : 'bg-[var(--surface-primary)] border-[var(--border-premium)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === meta.current_page - 2 || page === meta.current_page + 2) {
                                        return <span key={page} className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)]">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            <button
                                onClick={() => handlePageChange(meta.current_page + 1)}
                                disabled={meta.current_page === meta.last_page}
                                className="px-6 py-3 bg-[var(--surface-primary)] border border-[var(--border-premium)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--border-premium)] disabled:hover:text-[var(--text-primary)] transition-all"
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
                    <div className="relative w-[85%] max-w-sm bg-[var(--surface-primary)] h-full shadow-2xl flex flex-col animate-in slide-in-from-right transition-colors">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-premium)] bg-[var(--bg-primary)]">
                            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] flex items-center gap-2">
                                <Filter size={18} className="text-[var(--primary)]" /> Filter
                            </h2>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--surface-secondary)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {/* Same Filter UI as desktop, duplicated for mobile drawer */}
                            <div className="space-y-8">
                                {/* Search */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Pencarian</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cari mahakarya..."
                                            value={localSearch}
                                            onChange={handleSearchChange}
                                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--primary)] outline-none transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                        />
                                        <Search size={16} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Kategori</label>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.category === '' ? 'border-[var(--primary)]' : 'border-[var(--border-soft)] group-hover:border-[var(--primary)]/50'}`}>
                                                {filters.category === '' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category_mobile"
                                                checked={filters.category === ''}
                                                onChange={() => setFilter('category', '')}
                                                className="hidden"
                                            />
                                            <span className={`text-base font-medium ${filters.category === '' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                Semua Koleksi
                                            </span>
                                        </label>
                                        {categories.map((cat) => (
                                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.category === cat.slug ? 'border-[var(--primary)]' : 'border-[var(--border-soft)] group-hover:border-[var(--primary)]/50'}`}>
                                                    {filters.category === cat.slug && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]"></div>}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="category_mobile"
                                                    checked={filters.category === cat.slug}
                                                    onChange={() => setFilter('category', cat.slug)}
                                                    className="hidden"
                                                />
                                                <span className={`text-base font-medium flex-1 ${filters.category === cat.slug ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                    {cat.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Rentang Nilai</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-3.5 text-[10px] font-bold text-[var(--text-muted)]">Rp</span>
                                            <input
                                                type="text"
                                                placeholder="Min"
                                                value={formatPriceDisplay(filters.min_price)}
                                                onChange={(e) => handlePriceInput('min_price', e.target.value)}
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-8 pr-3 py-3 text-sm font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                            />
                                        </div>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-3.5 text-[10px] font-bold text-[var(--text-muted)]">Rp</span>
                                            <input
                                                type="text"
                                                placeholder="Max"
                                                value={formatPriceDisplay(filters.max_price)}
                                                onChange={(e) => handlePriceInput('max_price', e.target.value)}
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl pl-8 pr-3 py-3 text-sm font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stock */}
                                <label className="flex items-center gap-3 cursor-pointer bg-[var(--bg-primary)] border border-[var(--border-soft)] p-4 rounded-xl">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.in_stock ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)]'}`}>
                                        {filters.in_stock && <Check size={14} className="text-[var(--bg-primary)]" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={filters.in_stock}
                                        onChange={(e) => setFilter('in_stock', e.target.checked)}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        Hanya stok tersedia
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border-premium)] flex gap-3 bg-[var(--surface-primary)]">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-4 flex-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="px-4 py-4 flex-[2] btn-atelier-primary text-xs"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};
