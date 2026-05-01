import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, LogOut, Menu, X } from 'lucide-react';
import useAuthStore from '@/features/auth/authStore';

export const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) {
            setSearchError('Ketik minimal 2 karakter');
            return;
        }
        setSearchError('');
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50 h-[72px]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
                {/* Logo & Mobile Menu Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link to="/" className="text-2xl font-bold text-gray-950 tracking-tight flex items-center">
                        NadaKita
                    </Link>
                </div>

                {/* Left Navigation Links */}
                <div className="hidden lg:flex items-center gap-6 ml-4">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/" className="text-sm font-bold text-gray-900">Beranda</Link>
                            <Link to="/explore" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Eksplorasi</Link>
                            <Link to="/collection" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Koleksi</Link>
                            <Link to="/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Bantuan</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Beranda</Link>
                            <Link to="/customer/orders" className="text-sm font-bold text-orange-700">Pesanan</Link>
                            <Link to="/customer/wishlist" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Wishlist</Link>
                            <Link to="/customer/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Profil</Link>
                        </>
                    )}
                </div>

                {/* Shared Search Bar */}
                <div className="flex-1 max-w-2xl px-4 hidden md:block">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <input
                            type="text"
                            placeholder="Cari instrumen atau aksesoris..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value.trim().length >= 2) {
                                    setSearchError('');
                                }
                            }}
                            className={`w-full bg-gray-50 border border-gray-100 rounded py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-gray-300 focus:bg-white outline-none transition-all ${
                                searchError ? 'border-red-500 ring-1 ring-red-500' : ''
                            }`}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                            <Search size={16} />
                        </button>
                        {searchError && (
                            <span className="absolute -bottom-5 left-4 text-[10px] text-red-500 font-medium">
                                {searchError}
                            </span>
                        )}
                    </form>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5 shrink-0">
                    <Link to="/cart" className="text-gray-700 hover:text-gray-900 relative">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            3
                        </span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/notifications" className="text-gray-700 hover:text-gray-900 relative hidden md:block">
                                <Bell size={24} />
                                <span className="absolute 1 top-0.5 right-0.5 bg-orange-600 w-2 h-2 rounded-full border border-white"></span>
                            </Link>

                            <div className="hidden md:flex items-center pl-5 border-l border-gray-200">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                    <img 
                                        src={user?.avatar || FALLBACK_AVATAR} 
                                        alt="Avatar" 
                                        onError={(e) => { e.target.src = FALLBACK_AVATAR }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex gap-3 items-center pl-5 border-l border-gray-200">
                            <Link 
                                to="/login" 
                                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                            >
                                Masuk
                            </Link>
                        </div>
                    )}
                    
                    <button 
                        className="lg:hidden text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile View Add-ons */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t bg-white absolute w-full left-0 top-[72px] shadow-lg z-40 pb-6">
                    <div className="p-4 space-y-4">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Cari instrumen atau aksesoris..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.trim().length >= 2) {
                                        setSearchError('');
                                    }
                                }}
                                className={`w-full bg-gray-50 border border-gray-200 rounded py-2.5 pl-4 pr-10 text-sm outline-none ${
                                    searchError ? 'border-red-500' : ''
                                }`}
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Search size={18} className="text-gray-500" />
                            </button>
                            {searchError && (
                                <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 px-1">
                                    {searchError}
                                </span>
                            )}
                        </form>
                        
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 pt-2 pb-4 border-b">
                                <img src={user?.avatar || FALLBACK_AVATAR} alt="" className="w-10 h-10 rounded-full" onError={(e) => { e.target.src = FALLBACK_AVATAR }} />
                                <div>
                                    <p className="text-sm font-bold">{user?.name || 'Customer'}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        )}

                        <nav className="flex flex-col gap-4 font-medium text-gray-700 text-sm mt-4">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)}>Eksplorasi</Link>
                                    <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)}>Koleksi</Link>
                                    <Link to="/help" onClick={() => setIsMobileMenuOpen(false)}>Bantuan</Link>
                                    <Link to="/login" className="text-orange-600 mt-2 font-bold" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/customer/orders" className="text-orange-600" onClick={() => setIsMobileMenuOpen(false)}>Pesanan</Link>
                                    <Link to="/customer/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
                                    <Link to="/customer/profile" onClick={() => setIsMobileMenuOpen(false)}>Profil</Link>
                                    <button onClick={handleLogout} className="text-left text-red-600 mt-4 font-bold flex items-center gap-2">
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};
