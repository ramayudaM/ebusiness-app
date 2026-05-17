import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '@/shared/stores/notificationStore';
import { useThemeStore } from '@/shared/stores/themeStore';
import useAuthStore from '@/features/auth/authStore';
import { useCartStore } from '@/shared/stores/cartStore';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { Search, ShoppingCart, Bell, LogOut, Menu, X, User, Heart, Package, Clock, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


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

    const getIcon = (type) => {
        switch (type) {
            case 'cart': return <ShoppingCart size={16} className="text-blue-400" />;
            case 'promo': return <Zap size={16} className="text-amber-400" />;
            case 'wishlist': return <Heart size={16} className="text-red-400" />;
            default: return <Bell size={16} className="text-zinc-400" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'cart': return 'bg-blue-950/30 border border-blue-900/20';
            case 'promo': return 'bg-amber-950/30 border border-amber-900/20';
            case 'wishlist': return 'bg-red-950/30 border border-red-900/20';
            default: return 'bg-zinc-900/50 border border-zinc-800/60';
        }
    };

    return (
        <>
            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        {/* Backdrop with fade animation */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 cursor-default"
                            onClick={() => setIsLogoutModalOpen(false)}
                        ></motion.div>
                        
                        {/* Modal Container with scale and fade animation */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 350 } }}
                            exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.15 } }}
                            className="relative bg-[#0A0A0A] border border-zinc-800/80 w-full max-w-sm rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden group p-6 md:p-8"
                        >
                            {/* Subtle Ambient Glow */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600/5 blur-[35px] pointer-events-none transition-all group-hover:bg-red-500/10"></div>
                            
                            <div className="text-center relative z-10">
                                <div className="w-14 h-14 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500">
                                    <LogOut size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400">
                                    Konfirmasi Keluar
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                    Apakah Anda yakin ingin keluar dari akun Anda?
                                </p>
                            </div>
                            
                            <div className="flex gap-3 relative z-10">
                                <button 
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmLogout}
                                    className="flex-1 bg-red-600 text-white font-extrabold py-3 rounded-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-950/20 text-sm"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <header className="bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-900 fixed top-0 left-0 right-0 w-full z-50 h-[72px] transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
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
                                location.pathname === link.path ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
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
                                className={`w-full pl-12 pr-4 py-2.5 bg-[#0A0A0A] border border-zinc-800 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-zinc-500 text-white transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] ${
                                    searchError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
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
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="text-zinc-400 hover:text-orange-500 relative transition-colors">
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
                                    className="text-zinc-400 hover:text-orange-500 relative transition-colors focus:outline-none"
                                >
                                    <Bell size={22} className="md:w-6 md:h-6" />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute top-0.5 right-0.5 bg-orange-600 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-950"></span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
                                            <h3 className="font-black text-white text-base tracking-tight">Notifikasi</h3>
                                            {unreadNotifications > 0 && (
                                                <button 
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-bold text-orange-400 hover:text-orange-350 transition-colors"
                                                >
                                                    Tandai semua dibaca
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                <div className="divide-y divide-zinc-900/50">
                                                    {notifications.map((n) => (
                                                        <div 
                                                            key={n.id} 
                                                            onClick={() => markAsRead(n.id)}
                                                            className={`p-4 hover:bg-zinc-900/30 cursor-pointer transition-colors relative ${!n.read ? 'bg-orange-950/5' : ''}`}
                                                        >
                                                            {!n.read && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
                                                            )}
                                                            <div className="flex gap-3">
                                                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getIconBg(n.type)}`}>
                                                                    {getIcon(n.type)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm mb-0.5 truncate pr-2 ${!n.read ? 'font-black text-white' : 'font-semibold text-zinc-300'}`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <p className={`text-xs line-clamp-2 leading-relaxed ${!n.read ? 'text-zinc-100 font-medium' : 'text-zinc-400'}`}>
                                                                        {n.message}
                                                                    </p>
                                                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-450 bg-[#050505]/40 border border-zinc-800/60 px-2 py-0.5 rounded-md w-fit">
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
                                                    <div className="w-16 h-16 bg-[#050505] border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Bell size={24} className="text-zinc-650" />
                                                    </div>
                                                    <p className="text-sm text-zinc-450 font-medium">Belum ada notifikasi baru untuk Anda.</p>
                                                </div>
                                            )}
                                        </div>
                                        <Link 
                                            to="/notifications" 
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="block p-3 text-center text-xs font-bold text-zinc-450 hover:text-white bg-zinc-900/40 hover:bg-zinc-900/60 border-t border-zinc-900 transition-all"
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
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-zinc-800 hover:border-orange-500 transition-all bg-zinc-900 shrink-0 object-cover shadow-sm">
                                        <img 
                                            src={user?.avatar || FALLBACK_AVATAR} 
                                            alt="Avatar" 
                                            onError={(e) => { e.target.src = FALLBACK_AVATAR }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 py-2 z-50 overflow-hidden rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-5 py-4 border-b border-zinc-900 bg-zinc-900/20">
                                            <p className="text-sm font-black text-white truncate">{user?.name || 'Customer'}</p>
                                            <p className="text-xs text-zinc-450 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link to="/account/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900/40 hover:text-orange-450 transition-colors font-medium">
                                                <User size={18} /> Profil Saya
                                            </Link>
                                            <Link to="/account/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900/40 hover:text-orange-450 transition-colors font-medium">
                                                <Package size={18} /> Pesanan Saya
                                            </Link>
                                            <Link to="/account/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900/40 hover:text-orange-450 transition-colors font-medium">
                                                <Heart size={18} /> Wishlist 
                                                {wishlistCount > 0 && (
                                                    <span className="ml-auto bg-orange-950/40 border border-orange-900/30 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        {wishlistCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </div>
                                        <div className="py-2 border-t border-zinc-900">
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-red-400 hover:bg-red-950/20 font-bold transition-colors"
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
                        className="lg:hidden text-zinc-400 hover:text-white focus:outline-none ml-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>
        </header>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-[72px] bg-black/60 backdrop-blur-md z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-zinc-900 shadow-2xl overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-zinc-900 bg-[#050505]">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                                        <img src={user?.avatar || FALLBACK_AVATAR} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_AVATAR }} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-base font-bold text-white truncate">{user?.name || 'Customer'}</p>
                                        <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-zinc-400">Selamat datang di NadaKita!</p>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-orange-600 hover:bg-orange-500 text-white text-center text-sm font-bold py-2.5 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all"
                                    >
                                        Masuk atau Daftar
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-b border-zinc-900 transition-colors">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
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
                                    className={`w-full bg-[#050505] border border-zinc-800 rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-600 transition-all ${
                                        searchError ? 'border-red-500 focus:ring-red-500' : ''
                                    }`}
                                />
                                {searchError && (
                                    <span className="absolute -bottom-4 left-4 text-[10px] text-red-500">
                                        {searchError}
                                    </span>
                                )}
                            </form>
                        </div>

                        <div className="p-3 flex-1 flex flex-col text-base font-medium text-zinc-400">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl transition-colors ${
                                        location.pathname === link.path 
                                            ? 'bg-orange-600/10 text-orange-500 font-bold border-l-2 border-orange-600 pl-3.5' 
                                            : 'hover:bg-zinc-900/50 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {isAuthenticated && (
                                <>
                                    <div className="h-px bg-zinc-900 my-3 mx-4"></div>
                                    <Link to="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/50 rounded-xl transition-colors hover:text-white">
                                        <User size={20} className="text-zinc-500" /> Profil Saya
                                    </Link>
                                    <Link to="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/50 rounded-xl transition-colors hover:text-white">
                                        <Package size={20} className="text-zinc-500" /> Pesanan
                                    </Link>
                                    <Link to="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/50 rounded-xl transition-colors hover:text-white">
                                        <Heart size={20} className="text-zinc-500" /> Wishlist
                                    </Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated && (
                            <div className="p-5 border-t border-zinc-900 transition-colors">
                                <button 
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 text-red-400 font-bold p-3 bg-red-950/20 border border-red-900/20 rounded-xl hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut size={18} /> Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
    </>
);
};
