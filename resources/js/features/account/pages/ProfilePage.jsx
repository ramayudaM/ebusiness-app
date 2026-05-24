import React, { useState, useEffect } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import useAuthStore from '@/features/auth/authStore';
import { useAddressStore } from '@/shared/stores/addressStore';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Plus,
    Pencil,
    Trash2,
    X,
    Check,
    Loader2,
    Building2,
    Settings,
    Shield,
    Camera,
    ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/shared/utils/api';
import { FALLBACK_AVATAR } from '@/shared/utils/placeholders';

export const ProfilePage = () => {
    const { user, updateUser } = useAuthStore();
    const {
        addresses,
        fetchAddresses,
        isLoading: isAddressLoading,
        provinces,
        cities,
        isLoadingCities,
        fetchProvinces,
        fetchCities,
        addAddress,
        updateAddress,
        deleteAddress
    } = useAddressStore();

    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'addresses'

    // Profile Form State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        label: 'Rumah',
        receiver_name: '',
        phone_number: '',
        province_id: '',
        province_name: '',
        city_id: '',
        city_name: '',
        full_address: '',
        postal_code: '',
        is_default: false
    });
    const fileInputRef = React.useRef(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi ukuran (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 2MB');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setIsUploadingAvatar(true);
        try {
            const response = await api.post('/user/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            updateUser(response.data.data);
            toast.success('Foto profil berhasil diperbarui');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mengunggah foto profil');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'addresses') {
            fetchAddresses();
            fetchProvinces();
        }
    }, [activeTab]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const response = await api.put('/user/profile', {
                name: profileForm.name,
                phone: profileForm.phone
            });
            // Update auth store with new user data
            updateUser(response.data.data);
            setIsEditingProfile(false);
            toast.success('Profil berhasil diperbarui');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleOpenAddAddress = () => {
        setIsEditingAddress(false);
        setAddressForm({
            label: 'Rumah',
            receiver_name: user?.name || '',
            phone_number: user?.profile?.phone || '',
            province_id: '',
            province_name: '',
            city_id: '',
            city_name: '',
            full_address: '',
            postal_code: '',
            is_default: addresses.length === 0
        });
        setShowAddressModal(true);
    };

    const handleOpenEditAddress = (addr) => {
        setIsEditingAddress(true);
        setEditingAddressId(addr.id);
        setAddressForm({
            label: addr.label,
            receiver_name: addr.receiver_name,
            phone_number: addr.phone_number,
            province_id: addr.province_id,
            province_name: addr.province_name,
            city_id: addr.city_id,
            city_name: addr.city_name,
            full_address: addr.full_address,
            postal_code: addr.postal_code,
            is_default: addr.is_default
        });
        fetchCities(addr.province_id);
        setShowAddressModal(true);
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Hapus alamat ini?')) {
            try {
                await deleteAddress(id);
                toast.success('Alamat dihapus');
            } catch (error) {
                toast.error('Gagal menghapus alamat');
            }
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            if (isEditingAddress) {
                await updateAddress(editingAddressId, addressForm);
                toast.success('Alamat diperbarui');
            } else {
                await addAddress(addressForm);
                toast.success('Alamat ditambahkan');
            }
            setShowAddressModal(false);
        } catch (error) {
            toast.error('Gagal menyimpan alamat');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-16 relative">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    {/* Sidebar / User Card */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden sticky top-32">
                            <div className="h-32 bg-[var(--surface-secondary)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--primary)]/30 blur-2xl rounded-full"></div>
                            </div>
                            <div className="px-8 pb-8 -mt-16 text-center relative z-10">
                                <div className="relative inline-block mb-4">
                                    <div className={`w-32 h-32 rounded-full border-[6px] border-[var(--surface-primary)] bg-[var(--surface-secondary)] overflow-hidden mx-auto shadow-xl relative ${isUploadingAvatar ? 'opacity-50' : ''}`}>
                                        <img
                                            src={user?.avatar || FALLBACK_AVATAR}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = FALLBACK_AVATAR}
                                        />
                                        {isUploadingAvatar && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                                <Loader2 size={24} className="animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                        className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-[var(--text-primary)] rounded-full shadow-lg text-[var(--bg-primary)] hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <Camera size={18} />
                                    </button>
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] truncate">{user?.name}</h2>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{user?.email}</p>
                                <div className="mt-5 inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[var(--primary)]/20">
                                    <Shield size={12} />
                                    Kurator Terverifikasi
                                </div>
                            </div>

                            <nav className="p-4 border-t border-[var(--border-premium)] flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile'
                                        ? 'bg-[var(--primary)] text-[var(--bg-primary)] shadow-lg shadow-[var(--primary)]/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <User size={16} /> Profil Pribadi
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'addresses'
                                        ? 'bg-[var(--primary)] text-[var(--bg-primary)] shadow-lg shadow-[var(--primary)]/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <MapPin size={16} /> Titik Ekspedisi
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'profile' ? (
                            <section className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] p-8 md:p-12 transition-all">
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border-premium)]">
                                    <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">Identitas Profil</h3>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="inline-flex items-center gap-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--border-premium)] transition-all"
                                        >
                                            <Pencil size={14} /> Edit Data
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                                <User size={14} /> Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isEditingProfile}
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-5 py-4 text-sm font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all disabled:opacity-60 disabled:bg-[var(--surface-secondary)]"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                                <Mail size={14} /> Alamat Surel
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                className="w-full bg-[var(--surface-secondary)] border border-[var(--border-soft)] rounded-xl px-5 py-4 text-sm font-bold outline-none opacity-60 cursor-not-allowed text-[var(--text-primary)] transition-all"
                                                value={profileForm.email}
                                            />
                                            <p className="text-[10px] text-[var(--text-muted)] font-medium">Alamat surel bersifat permanen demi keamanan.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                                <Phone size={14} /> Kontak Pribadi
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isEditingProfile}
                                                placeholder="Tambahkan nomor kontak"
                                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-5 py-4 text-sm font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all disabled:opacity-60 disabled:bg-[var(--surface-secondary)]"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {isEditingProfile && (
                                        <div className="flex gap-4 pt-10 mt-10 border-t border-[var(--border-premium)]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingProfile(false);
                                                    setProfileForm({
                                                        name: user?.name || '',
                                                        email: user?.email || '',
                                                        phone: user?.profile?.phone || '',
                                                    });
                                                }}
                                                className="px-8 py-4 bg-transparent border border-[var(--border-premium)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                                            >
                                                Batalkan
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSavingProfile}
                                                className="flex-1 btn-atelier-primary flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                Perbarui Identitas
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </section>
                        ) : (
                            <section className="space-y-8">
                                <div className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] p-8 md:p-12">
                                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--border-premium)]">
                                        <div>
                                            <h3 className="font-display text-3xl font-bold text-[var(--text-primary)]">Titik Ekspedisi</h3>
                                            <p className="text-sm font-medium text-[var(--text-secondary)] mt-2">Atur destinasi pengiriman untuk pesanan Anda.</p>
                                        </div>
                                        <button
                                            onClick={handleOpenAddAddress}
                                            className="inline-flex items-center gap-2 btn-atelier-primary px-6 py-3 text-[10px]"
                                        >
                                            <Plus size={14} /> Titik Baru
                                        </button>
                                    </div>

                                    {isAddressLoading ? (
                                        <div className="flex justify-center py-20">
                                            <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
                                        </div>
                                    ) : addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-5">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    className={`p-8 rounded-2xl border transition-all ${addr.is_default
                                                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_15px_var(--glow-warm)]'
                                                        : 'border-[var(--border-premium)] bg-[var(--surface-secondary)] hover:border-[var(--primary)]/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-5">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-md">
                                                                {addr.label}
                                                            </span>
                                                            {addr.is_default && (
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--bg-primary)] bg-[var(--primary)] px-3 py-1 rounded-md shadow-[0_0_10px_var(--glow-warm)]">
                                                                    Utama
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleOpenEditAddress(addr)}
                                                                className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-[var(--text-primary)] text-xl">{addr.receiver_name}</h4>
                                                    <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">{addr.phone_number}</p>
                                                    <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed max-w-2xl">
                                                        {addr.full_address}
                                                    </p>
                                                    <p className="text-sm font-bold text-[var(--text-muted)] mt-2">
                                                        {addr.city_name}, {addr.province_name} {addr.postal_code}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-24 bg-[var(--surface-secondary)] rounded-3xl border border-[var(--border-premium)]">
                                            <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border-soft)]">
                                                <MapPin size={32} className="text-[var(--text-muted)]" />
                                            </div>
                                            <h4 className="font-display text-xl font-bold text-[var(--text-primary)]">Belum Ada Titik Ekspedisi</h4>
                                            <p className="text-sm text-[var(--text-secondary)] mt-3">Tambahkan profil alamat pengiriman untuk mempermudah transaksi.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[var(--surface-primary)] rounded-[2rem] w-full max-w-2xl shadow-[var(--shadow-elevated)] overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border border-[var(--border-premium)]">
                        <div className="px-8 py-6 border-b border-[var(--border-premium)] flex items-center justify-between bg-[var(--surface-secondary)]">
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                                {isEditingAddress ? 'Edit Profil Alamat' : 'Buat Profil Alamat'}
                            </h3>
                            <button onClick={() => setShowAddressModal(false)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-hover)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border-premium)]">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Label Alamat</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Studio, Rumah, Galeri"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Nama Penerima</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.receiver_name}
                                        onChange={(e) => setAddressForm({ ...addressForm, receiver_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Provinsi</label>
                                    <select
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all appearance-none"
                                        value={addressForm.province_id}
                                        onChange={(e) => {
                                            const prov = provinces.find(p => String(p.province_id) === String(e.target.value));
                                            setAddressForm({
                                                ...addressForm,
                                                province_id: e.target.value,
                                                province_name: prov?.province || '',
                                                city_id: '',
                                                city_name: ''
                                            });
                                            fetchCities(e.target.value);
                                        }}
                                    >
                                        <option value="" className="text-[var(--text-muted)]">Pilih Provinsi</option>
                                        {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Kota/Kabupaten</label>
                                    <select
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all appearance-none disabled:opacity-50"
                                        disabled={!addressForm.province_id || isLoadingCities}
                                        value={addressForm.city_id}
                                        onChange={(e) => {
                                            const city = cities.find(c => String(c.city_id) === String(e.target.value));
                                            setAddressForm({ ...addressForm, city_id: e.target.value, city_name: city?.city_name || '' });
                                        }}
                                    >
                                        <option value="">{isLoadingCities ? 'Memuat data wilayah...' : 'Pilih Kota/Kabupaten'}</option>
                                        {!isLoadingCities && cities.map(c => (
                                            <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Alamat Lengkap</label>
                                    <textarea
                                        required
                                        placeholder="Nama jalan, nomor rumah, detail, dll."
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] min-h-[100px] transition-all"
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Kode Pos</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-3 md:col-span-2 pt-2">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${addressForm.is_default ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)] hover:border-[var(--primary)]/50'}`}>
                                        <input
                                            type="checkbox"
                                            id="is_default_profile"
                                            checked={addressForm.is_default}
                                            onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                                            className="hidden"
                                        />
                                        {addressForm.is_default && <Shield size={14} className="text-[var(--bg-primary)]" />}
                                    </div>
                                    <label htmlFor="is_default_profile" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] cursor-pointer">
                                        Tetapkan Sebagai Alamat Utama
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-10 mt-10 border-t border-[var(--border-premium)]">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="px-8 py-4 bg-transparent border border-[var(--border-premium)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    Batalkan
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-atelier-primary py-4"
                                >
                                    {isEditingAddress ? 'Perbarui Profil' : 'Simpan Profil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};
