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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / User Card */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-28">
                            <div className="h-24 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                            <div className="px-6 pb-8 -mt-12 text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 overflow-hidden mx-auto shadow-lg">
                                        <img 
                                            src={user?.avatar || FALLBACK_AVATAR} 
                                            alt={user?.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = FALLBACK_AVATAR}
                                        />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-500 hover:text-orange-600 border border-gray-100 dark:border-gray-700 transition-colors">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white truncate">{user?.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                                <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                                    <Shield size={12} />
                                    Verified Member
                                </div>
                            </div>
                            
                            <nav className="p-3 border-t border-gray-50 dark:border-gray-800">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === 'profile' 
                                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' 
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <User size={18} /> Informasi Profil
                                </button>
                                <button 
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === 'addresses' 
                                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' 
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <MapPin size={18} /> Daftar Alamat
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-50 cursor-not-allowed">
                                    <Settings size={18} /> Keamanan
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'profile' ? (
                            <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Profil Saya</h3>
                                    {!isEditingProfile && (
                                        <button 
                                            onClick={() => setIsEditingProfile(true)}
                                            className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 dark:border-gray-700 transition-all"
                                        >
                                            <Pencil size={16} /> Edit
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <User size={14} /> Nama Lengkap
                                            </label>
                                            <input 
                                                type="text" 
                                                disabled={!isEditingProfile}
                                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-70 dark:text-white transition-all"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Mail size={14} /> Email
                                            </label>
                                            <input 
                                                type="email" 
                                                disabled
                                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none opacity-50 cursor-not-allowed dark:text-white transition-all"
                                                value={profileForm.email}
                                            />
                                            <p className="text-[10px] text-gray-400">Email tidak dapat diubah.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Phone size={14} /> Nomor Telepon
                                            </label>
                                            <input 
                                                type="text" 
                                                disabled={!isEditingProfile}
                                                placeholder="Belum ada nomor telepon"
                                                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-70 dark:text-white transition-all"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {isEditingProfile && (
                                        <div className="flex gap-3 pt-6 border-t border-gray-50 dark:border-gray-800">
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
                                                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                            >
                                                Batal
                                            </button>
                                            <button 
                                                type="submit"
                                                disabled={isSavingProfile}
                                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100 dark:shadow-none"
                                            >
                                                {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                Simpan Perubahan
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </section>
                        ) : (
                            <section className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Daftar Alamat</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola alamat pengiriman pesananmu.</p>
                                        </div>
                                        <button 
                                            onClick={handleOpenAddAddress}
                                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 dark:shadow-none transition-all"
                                        >
                                            <Plus size={18} /> Tambah
                                        </button>
                                    </div>

                                    {isAddressLoading ? (
                                        <div className="flex justify-center py-20">
                                            <Loader2 size={32} className="animate-spin text-orange-600" />
                                        </div>
                                    ) : addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {addresses.map((addr) => (
                                                <div 
                                                    key={addr.id} 
                                                    className={`p-6 rounded-2xl border transition-all ${
                                                        addr.is_default 
                                                        ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-900/10' 
                                                        : 'border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded">
                                                                {addr.label}
                                                            </span>
                                                            {addr.is_default && (
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded">
                                                                    Utama
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleOpenEditAddress(addr)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{addr.receiver_name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{addr.phone_number}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                                                        {addr.full_address}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {addr.city_name}, {addr.province_name} {addr.postal_code}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-950 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <MapPin size={32} className="text-gray-300" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Belum ada alamat</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Tambahkan alamat pengiriman untuk mempermudah checkout.</p>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                {isEditingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                            </h3>
                            <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveAddress} className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Label Alamat</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Contoh: Rumah, Kantor, Kost"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Penerima</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                                        value={addressForm.receiver_name}
                                        onChange={(e) => setAddressForm({...addressForm, receiver_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomor Telepon</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({...addressForm, phone_number: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Provinsi</label>
                                    <select 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white appearance-none transition-all"
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
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kota/Kabupaten</label>
                                    <select 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white disabled:opacity-50 appearance-none transition-all"
                                        disabled={!addressForm.province_id || isLoadingCities}
                                        value={addressForm.city_id}
                                        onChange={(e) => {
                                            const city = cities.find(c => String(c.city_id) === String(e.target.value));
                                            setAddressForm({...addressForm, city_id: e.target.value, city_name: city?.city_name || ''});
                                        }}
                                    >
                                        <option value="">{isLoadingCities ? 'Memuat daftar kota...' : 'Pilih Kota'}</option>
                                        {!isLoadingCities && cities.map(c => (
                                            <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Alamat Lengkap</label>
                                    <textarea 
                                        required
                                        placeholder="Nama jalan, nomor rumah, RT/RW, dsb."
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white min-h-[100px] transition-all resize-none"
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({...addressForm, full_address: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kode Pos</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                                    />
                                </div>
                                <div className="flex items-center gap-3 md:col-span-2 pt-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_default_profile"
                                        checked={addressForm.is_default}
                                        onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                                        className="w-5 h-5 accent-orange-600 rounded-lg cursor-pointer"
                                    />
                                    <label htmlFor="is_default_profile" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">Jadikan Alamat Utama</label>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-10">
                                <button 
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 dark:shadow-none"
                                >
                                    Simpan Alamat
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
