import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Bell, LogOut, Menu, X, User, Heart, Package } from 'lucide-react';
import useAuthStore from '@/features/auth/authStore';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Initial search sync from URL query
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get('search') || queryParams.get('q');
        if (q) setSearchQuery(q);
    }, [location.search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed.length > 0 && trimmed.length < 2) {
            setSearchError('Min. 2 karakter');
            return;
        }
        setSearchError('');
        setIsMobileMenuOpen(false);
        navigate(`/explore${trimmed ? `?search=${encodeURIComponent(trimmed)}` : ''}`);
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/');
    };

    const navLinks = [
        { name: 'Beranda', path: '/' },
        { name: 'Eksplorasi', path: '/explore' },
        { name: 'Bantuan', path: '/help' },
    ];

    return (
        <header className="bg-white border-b sticky top-0 z-50 h-[72px]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="text-xl md:text-2xl font-extrabold text-gray-950 tracking-tight">
                        NadaKita
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-6 shrink-0">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path} 
                            className={`text-sm font-medium transition-colors ${
                                location.pathname === link.path ? 'text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Shared Search Bar */}
                <div className="flex-1 w-full max-w-2xl px-2 hidden md:block">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="relative flex items-center w-full">
                            <Search size={18} className="absolute left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari instrumen atau aksesoris..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.trim().length >= 2 || e.target.value.trim().length === 0) {
                                        setSearchError('');
                                    }
                                }}
                                className={`w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all ${
                                    searchError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                                }`}
                            />
                        </div>
                        {searchError && (
                            <span className="absolute -bottom-5 left-4 text-[10px] text-red-500 font-medium">
                                {searchError}
                            </span>
                        )}
                    </form>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 md:gap-5 shrink-0">
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="text-gray-700 hover:text-orange-600 relative transition-colors">
                                <ShoppingCart size={22} className="md:w-6 md:h-6" />
                                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                                    3
                                </span>
                            </Link>

                            <button className="text-gray-700 hover:text-orange-600 relative hidden sm:block transition-colors">
                                <Bell size={22} className="md:w-6 md:h-6" />
                                <span className="absolute top-0.5 right-0.5 bg-orange-600 w-2 h-2 rounded-full border border-white"></span>
                            </button>

                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-orange-200 transition-all bg-gray-100 shrink-0 object-cover">
                                        <img 
                                            src={user?.avatar || FALLBACK_AVATAR} 
                                            alt="Avatar" 
                                            onError={(e) => { e.target.src = FALLBACK_AVATAR }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Customer'}</p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600">
                                                <User size={16} /> Profil Saya
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600">
                                                <Package size={16} /> Pesanan
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600">
                                                <Heart size={16} /> Wishlist
                                            </Link>
                                        </div>
                                        <div className="py-1 border-t border-gray-100">
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                            >
                                                <LogOut size={16} /> Keluar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center pl-2">
                            <Link 
                                to="/login" 
                                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm hover:shadow-md"
                            >
                                Masuk
                            </Link>
                        </div>
                    )}
                    
                    <button 
                        className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none ml-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[72px] bg-black/20 z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-gray-100 bg-gray-50">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                                        <img src={user?.avatar || FALLBACK_AVATAR} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_AVATAR }} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-base font-bold text-gray-900 truncate">{user?.name || 'Customer'}</p>
                                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-gray-600">Selamat datang di NadaKita!</p>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-orange-600 text-white text-center text-sm font-bold py-2.5 rounded-full shadow-sm"
                                    >
                                        Masuk atau Daftar
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-b border-gray-100">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari instrumen..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value.trim().length >= 2 || e.target.value.trim().length === 0) {
                                            setSearchError('');
                                        }
                                    }}
                                    className={`w-full bg-gray-100 border-none rounded-full py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 ${
                                        searchError ? 'ring-2 ring-red-500/50' : ''
                                    }`}
                                />
                                {searchError && (
                                    <span className="absolute -bottom-4 left-4 text-[10px] text-red-500">
                                        {searchError}
                                    </span>
                                )}
                            </form>
                        </div>

                        <div className="p-3 flex-1 flex flex-col text-base font-medium text-gray-700">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg ${location.pathname === link.path ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {isAuthenticated && (
                                <>
                                    <div className="h-px bg-gray-100 my-3 mx-4"></div>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                        <User size={20} className="text-gray-400" /> Profil Saya
                                    </Link>
                                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                        <Package size={20} className="text-gray-400" /> Pesanan
                                    </Link>
                                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg">
                                        <Heart size={20} className="text-gray-400" /> Wishlist
                                    </Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated && (
                            <div className="p-5 border-t border-gray-100">
                                <button 
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 text-red-600 font-bold p-3 bg-red-50 rounded-lg"
                                >
                                    <LogOut size={18} /> Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
