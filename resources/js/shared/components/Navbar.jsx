import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '@/shared/stores/notificationStore';
import { useThemeStore } from '@/shared/stores/themeStore';
import useAuthStore from '@/features/auth/authStore';
import { useCartStore } from '@/shared/stores/cartStore';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { Search, ShoppingCart, Bell, LogOut, Menu, X, User, Heart, Package, Clock, Check, Zap, Moon, Sun } from 'lucide-react';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    // Store Hooks
    const cartCount = useCartStore(state => state.getTotalItems());
    const wishlistCount = useWishlistStore(state => state.items.length);
    const { 
        notifications, 
        getUnreadCount, 
        markAsRead, 
        markAllAsRead,
        fetchNotifications 
    } = useNotificationStore();
    
    const { theme, toggleTheme } = useThemeStore();
    
    const fetchCart = useCartStore(state => state.fetchItems);
    const fetchWishlist = useWishlistStore(state => state.fetchItems);

    const unreadNotifications = getUnreadCount();

    // Fetch initial data on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
            fetchNotifications();
        }
    }, [isAuthenticated]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    const profileDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);

    // Initial search sync from URL query
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get('search') || queryParams.get('q');
        if (q) setSearchQuery(q);
    }, [location.search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
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

    const clearWishlist = useWishlistStore(state => state.clearWishlist);
    const resetCart = useCartStore(state => state.resetCart);
    const resetNotifications = useNotificationStore(state => state.resetNotifications);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const confirmLogout = () => {
        clearAuth();
        clearWishlist();
        resetCart();
        resetNotifications();
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Beranda', path: '/' },
        { name: 'Eksplorasi', path: '/explore' },
        { name: 'Bantuan', path: '/help' },
    ];

    return (
        <>
            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsLogoutModalOpen(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <LogOut size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Konfirmasi Keluar</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                Apakah Anda yakin ingin keluar dari akun Anda?
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-gray-800">
                            <button 
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 px-6 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmLogout}
                                className="flex-1 px-6 py-4 text-sm font-extrabold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-100 dark:border-gray-800"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 sticky top-0 z-50 h-[72px] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white tracking-tight">
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
                        <div className="relative group w-full">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari instrumen idaman Anda..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.trim().length >= 2 || e.target.value.trim().length === 0) {
                                        setSearchError('');
                                    }
                                }}
                                className={`w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white transition-all shadow-inner ${
                                    searchError ? 'ring-2 ring-red-500' : ''
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
                <div className="flex items-center gap-2 md:gap-5 shrink-0">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all focus:outline-none"
                        aria-label="Toggle Dark Mode"
                        title={theme === 'light' ? 'Ganti ke Mode Gelap' : 'Ganti ke Mode Terang'}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 relative transition-colors">
                                <ShoppingCart size={22} className="md:w-6 md:h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center font-bold border border-white dark:border-gray-950">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Notifications Dropdown */}
                            <div className="relative hidden sm:block" ref={notificationDropdownRef}>
                                <button 
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 relative transition-colors focus:outline-none"
                                >
                                    <Bell size={22} className="md:w-6 md:h-6" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-0.5 right-0.5 bg-orange-600 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-950"></span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/50">
                                            <h3 className="font-extrabold text-gray-900 dark:text-white">Notifikasi</h3>
                                            {unreadNotifications > 0 && (
                                                <button 
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                                                >
                                                    Tandai semua dibaca
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                                    {notifications.map((n) => (
                                                        <div 
                                                            key={n.id} 
                                                            onClick={() => markAsRead(n.id)}
                                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${!n.read ? 'bg-orange-50/30' : ''}`}
                                                        >
                                                            {!n.read && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600"></div>
                                                            )}
                                                            <div className="flex gap-3">
                                                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                                                    n.type === 'promo' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                    {n.type === 'promo' ? <Zap size={18} /> : <Bell size={18} />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm mb-0.5 ${!n.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                                        {n.message}
                                                                    </p>
                                                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                                                        <Clock size={10} />
                                                                        {new Date(n.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 px-6 text-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Bell size={24} className="text-gray-300" />
                                                    </div>
                                                    <p className="text-sm text-gray-500">Belum ada notifikasi baru untuk Anda.</p>
                                                </div>
                                            )}
                                        </div>
                                        <Link 
                                            to="/notifications" 
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="block p-3 text-center text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 border-t border-gray-50"
                                        >
                                            Lihat Semua Notifikasi
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="relative hidden md:block" ref={profileDropdownRef}>
                                <button 
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-orange-200 transition-all bg-gray-100 shrink-0 object-cover shadow-sm">
                                        <img 
                                            src={user?.avatar || FALLBACK_AVATAR} 
                                            alt="Avatar" 
                                            onError={(e) => { e.target.src = FALLBACK_AVATAR }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                                            <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{user?.name || 'Customer'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link to="/account/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-colors">
                                                <User size={18} /> Profil Saya
                                            </Link>
                                            <Link to="/account/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-colors">
                                                <Package size={18} /> Pesanan Saya
                                            </Link>
                                            <Link to="/account/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-600 transition-colors">
                                                <Heart size={18} /> Wishlist 
                                                {wishlistCount > 0 && (
                                                    <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                        {wishlistCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </div>
                                        <div className="py-2 border-t border-gray-100 dark:border-gray-800">
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
                                            >
                                                <LogOut size={18} /> Keluar
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
                                className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm hover:shadow-md"
                            >
                                Masuk
                            </Link>
                        </div>
                    )}
                    
                    <button 
                        className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none ml-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[72px] bg-black/20 dark:bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-800">
                                        <img src={user?.avatar || FALLBACK_AVATAR} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_AVATAR }} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-base font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Customer'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
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

                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 transition-colors">
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
                                    className={`w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${
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

                        <div className="p-3 flex-1 flex flex-col text-base font-medium text-gray-700 dark:text-gray-300">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {isAuthenticated && (
                                <>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-3 mx-4"></div>
                                    <Link to="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <User size={20} className="text-gray-400" /> Profil Saya
                                    </Link>
                                    <Link to="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <Package size={20} className="text-gray-400" /> Pesanan
                                    </Link>
                                    <Link to="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <Heart size={20} className="text-gray-400" /> Wishlist
                                    </Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated && (
                            <div className="p-5 border-t border-gray-100 dark:border-gray-800 transition-colors">
                                <button 
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 text-red-600 font-bold p-3 bg-red-50 dark:bg-red-950/30 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} /> Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    </>
);
};
