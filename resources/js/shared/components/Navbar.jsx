import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotificationStore } from '@/shared/stores/notificationStore';
import { useThemeStore } from '@/shared/stores/themeStore';
import useAuthStore from '@/features/auth/authStore';
import { useCartStore } from '@/shared/stores/cartStore';
import { useWishlistStore } from '@/shared/stores/wishlistStore';
import { Search, ShoppingCart, Bell, LogOut, Menu, X, User, Heart, Package, Clock, Zap, Moon, Sun, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get('search') || queryParams.get('q');
        if (q) setSearchQuery(q);
    }, [location.search]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { name: 'Atelier', path: '/' },
        { name: 'Koleksi', path: '/explore' },
        { name: 'Layanan', path: '/help' },
    ];

    return (
        <>
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsLogoutModalOpen(false)}
                        ></motion.div>

                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-[var(--surface-primary)] w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--border-premium)]"
                        >
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                                    <LogOut size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-2xl font-display font-black text-[var(--text-primary)] mb-3">Tinggalkan Atelier?</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    Sesi Anda akan diakhiri. Koleksi dan wishlist Anda tetap aman.
                                </p>
                            </div>
                            <div className="flex border-t border-[var(--border-premium)]">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                                >
                                    BATAL
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-6 py-5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-l border-[var(--border-premium)]"
                                >
                                    YA, KELUAR
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Glass Navbar */}
            <div className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-500 ${isScrolled ? 'pt-2 md:pt-4' : 'pt-4 md:pt-8'}`}>
                <header className={`max-w-7xl mx-auto rounded-full border transition-all duration-500 flex items-center justify-between gap-4 md:gap-8 px-6 md:px-8 h-16 md:h-[72px] shadow-lg ${
                    isScrolled 
                        ? 'bg-[var(--surface-primary)]/80 backdrop-blur-2xl border-[var(--border-premium)] shadow-[var(--shadow-elevated)]' 
                        : 'bg-[var(--surface-primary)]/40 backdrop-blur-md border-[var(--border-soft)] shadow-[var(--shadow-subtle)]'
                }`}>
                    
                    {/* Logo */}
                    <div className="flex items-center shrink-0 w-1/4">
                        <Link to="/" className="text-xl md:text-2xl font-display font-black text-[var(--text-primary)] tracking-wide hover:text-[var(--primary)] transition-colors">
                            NadaKita.
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group shrink-0 ${
                                    location.pathname === link.path 
                                        ? 'text-[var(--text-primary)]' 
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-1/2 w-1 h-1 rounded-full bg-[var(--primary)] transition-all -translate-x-1/2 ${
                                    location.pathname === link.path ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                                }`}></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6 shrink-0 lg:flex-1">
                        {/* Premium Compact Search (Desktop) */}
                        <div className="hidden md:block w-64 lg:w-96 xl:w-[28rem]">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <div className="relative group w-full overflow-hidden rounded-full p-px transition-all duration-300 focus-within:shadow-[0_0_20px_var(--glow-warm)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent translate-x-[-100%] group-focus-within:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                                    <div className="relative flex items-center bg-[var(--surface-primary)] border border-[var(--border-premium)] rounded-full group-focus-within:border-[var(--primary)] transition-colors">
                                        <Search size={14} className="absolute left-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors z-10" />
                                        <input
                                            type="text"
                                            placeholder="Cari mahakarya..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSearchError('');
                                            }}
                                            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none rounded-full text-xs focus:ring-0 placeholder-[var(--text-muted)] text-[var(--text-primary)] font-bold outline-none z-10 relative"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all"
                            title="Ganti Suasana"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all relative">
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-1 right-1 bg-[var(--primary)] text-[var(--bg-primary)] text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="relative hidden sm:block" ref={notificationDropdownRef}>
                                    <button
                                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all relative"
                                    >
                                        <Bell size={18} />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border border-[var(--surface-primary)]"></span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-80 md:w-96 bg-[var(--surface-primary)] rounded-[2rem] shadow-[var(--shadow-elevated)] border border-[var(--border-premium)] overflow-hidden z-50"
                                            >
                                                <div className="p-6 border-b border-[var(--border-premium)] flex items-center justify-between bg-[var(--surface-secondary)]">
                                                    <h3 className="font-display font-black text-xl">Notifikasi</h3>
                                                    {unreadNotifications > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
                                                        >
                                                            Tandai Dibaca
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                    {notifications.length > 0 ? (
                                                        <div className="divide-y divide-[var(--border-soft)]">
                                                            {notifications.map((n) => (
                                                                <div
                                                                    key={n.id}
                                                                    onClick={() => markAsRead(n.id)}
                                                                    className={`p-5 hover:bg-[var(--surface-hover)] cursor-pointer transition-colors relative ${!n.read ? 'bg-[var(--primary)]/5' : ''}`}
                                                                >
                                                                    {!n.read && (
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)]"></div>
                                                                    )}
                                                                    <div className="flex gap-4">
                                                                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border border-[var(--border-soft)] ${n.type === 'promo' ? 'bg-purple-500/10 text-purple-500' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                                                                            {n.type === 'promo' ? <Zap size={16} /> : <Bell size={16} />}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-sm mb-1 ${!n.read ? 'font-black text-[var(--text-primary)]' : 'font-bold text-[var(--text-secondary)]'}`}>
                                                                                {n.title}
                                                                            </p>
                                                                            <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                                                                                {n.message}
                                                                            </p>
                                                                            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                                                <Clock size={10} />
                                                                                {new Date(n.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-16 px-6 text-center">
                                                            <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border-premium)]">
                                                                <Bell size={24} className="text-[var(--text-muted)]" />
                                                            </div>
                                                            <p className="text-sm font-bold text-[var(--text-secondary)]">Belum ada kabar baru.</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    to="/notifications"
                                                    onClick={() => setIsNotificationOpen(false)}
                                                    className="block p-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] border-t border-[var(--border-premium)] transition-colors"
                                                >
                                                    LIHAT SEMUA
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative hidden md:block" ref={profileDropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-[var(--border-premium)] hover:border-[var(--primary)] transition-all focus:outline-none"
                                    >
                                        <span className="text-xs font-bold pl-2 text-[var(--text-primary)] truncate max-w-[80px]">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--surface-secondary)] shrink-0 object-cover">
                                            <img
                                                src={user?.avatar || FALLBACK_AVATAR}
                                                alt="Avatar"
                                                onError={(e) => { e.target.src = FALLBACK_AVATAR }}
                                                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                                            />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-64 bg-[var(--surface-primary)] rounded-[2rem] shadow-[var(--shadow-elevated)] border border-[var(--border-premium)] py-2 z-50 overflow-hidden"
                                            >
                                                <div className="px-6 py-5 border-b border-[var(--border-premium)] bg-[var(--surface-secondary)]">
                                                    <p className="text-sm font-black text-[var(--text-primary)] truncate mb-1">{user?.name || 'Kolektor'}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">{user?.email}</p>
                                                </div>
                                                <div className="py-2">
                                                    <Link to="/account/profile" className="flex items-center gap-4 px-6 py-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors">
                                                        <User size={16} /> Profil Saya
                                                    </Link>
                                                    <Link to="/account/orders" className="flex items-center gap-4 px-6 py-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors">
                                                        <Package size={16} /> Histori Transaksi
                                                    </Link>
                                                    <Link to="/account/wishlist" className="flex items-center gap-4 px-6 py-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors">
                                                        <Heart size={16} /> Wishlist
                                                        {wishlistCount > 0 && (
                                                            <span className="ml-auto bg-[var(--primary)] text-[var(--bg-primary)] text-[9px] px-2 py-0.5 rounded-full font-black">
                                                                {wishlistCount}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </div>
                                                <div className="py-2 border-t border-[var(--border-premium)]">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center gap-4 px-6 py-3 text-xs text-red-500 hover:bg-red-500/10 font-bold transition-colors"
                                                    >
                                                        <LogOut size={16} /> Tinggalkan Atelier
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center">
                                <Link
                                    to="/login"
                                    className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--primary)] px-6 py-3 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:scale-105 transition-transform"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        <button
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-secondary)] focus:outline-none bg-[var(--surface-hover)] ml-1"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </header>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-xl" 
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[var(--surface-primary)] shadow-2xl overflow-y-auto flex flex-col border-l border-[var(--border-premium)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-[var(--border-premium)] bg-[var(--surface-secondary)]">
                                <div className="flex justify-between items-start mb-8">
                                    <h2 className="font-display font-black text-2xl">Menu</h2>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 bg-[var(--surface-primary)] rounded-full flex items-center justify-center border border-[var(--border-premium)]">
                                        <X size={16} />
                                    </button>
                                </div>
                                {isAuthenticated ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-premium)] shrink-0 p-1">
                                            <img src={user?.avatar || FALLBACK_AVATAR} alt="" className="w-full h-full object-cover rounded-full mix-blend-multiply dark:mix-blend-normal" onError={(e) => { e.target.src = FALLBACK_AVATAR }} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-lg font-black text-[var(--text-primary)] truncate mb-1">{user?.name || 'Customer'}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-xs text-[var(--text-secondary)] font-bold">Selamat datang di Atelier NadaKita.</p>
                                        <div className="flex gap-3">
                                            <Link
                                                to="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex-1 border border-[var(--border-premium)] text-[var(--text-primary)] text-center text-[10px] font-black uppercase tracking-widest py-4 rounded-xl"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-center text-[10px] font-black uppercase tracking-widest py-4 rounded-xl"
                                            >
                                                Daftar
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-b border-[var(--border-premium)]">
                                <form onSubmit={handleSearch} className="relative w-full">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Cari instrumen..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setSearchError('');
                                        }}
                                        className="w-full bg-[var(--surface-hover)] border border-transparent rounded-xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-[var(--primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
                                    />
                                </form>
                            </div>

                            <div className="p-4 flex-1 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-6 py-4 rounded-xl text-sm font-bold transition-colors ${location.pathname === link.path ? 'bg-[var(--surface-secondary)] text-[var(--primary)]' : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <div className="h-px bg-[var(--border-premium)] my-4 mx-6"></div>
                                        <Link to="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors">
                                            <User size={18} className="text-[var(--primary)]" /> Profil Saya
                                        </Link>
                                        <Link to="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors">
                                            <Package size={18} className="text-[var(--primary)]" /> Histori Transaksi
                                        </Link>
                                        <Link to="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors">
                                            <Heart size={18} className="text-[var(--primary)]" /> Wishlist
                                        </Link>
                                    </>
                                )}
                            </div>

                            {isAuthenticated && (
                                <div className="p-8 border-t border-[var(--border-premium)]">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-center gap-3 text-red-500 font-bold text-xs p-4 bg-red-500/10 rounded-xl transition-colors"
                                    >
                                        <LogOut size={16} /> TINGGALKAN ATELIER
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
