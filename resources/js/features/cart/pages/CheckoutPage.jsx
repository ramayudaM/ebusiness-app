import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useCartStore } from '@/shared/stores/cartStore';
import { useAddressStore } from '@/shared/stores/addressStore';
import {
    MapPin,
    Truck,
    ShieldCheck,
    ChevronRight,
    Plus,
    Info,
    CreditCard,
    CircleCheckBig,
    Loader2,
    ArrowLeft,
    ShoppingCart,
    X,
    Pencil,
    Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/shared/utils/api';

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, fetchItems, getSelectedTotalPrice, getSelectedTotalItems } = useCartStore();
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

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [availableServices, setAvailableServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notes, setNotes] = useState('');
    const [promoCode, setPromoCode] = useState('');

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
        fetchItems();
        fetchAddresses();
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
            setSelectedAddressId(defaultAddr.id);
        }
    }, [addresses]);

    useEffect(() => {
        if (selectedAddressId) {
            fetchShippingOptions();
        }
    }, [selectedAddressId]);

    const fetchShippingOptions = async () => {
        setIsCalculatingShipping(true);
        setSelectedService(null);
        setAvailableServices([]);

        try {
            const response = await api.post('/checkout/shipping-cost', {
                address_id: selectedAddressId
            });
            setAvailableServices(response.data);
        } catch (error) {
            console.error('Shipping calc error:', error);
            toast.error('Gagal mengambil pilihan pengiriman');
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const handleEditAddress = (addr) => {
        setIsEditing(true);
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
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Hapus alamat ini?')) {
            try {
                await deleteAddress(id);
                toast.success('Alamat dihapus');
                if (selectedAddressId === id) {
                    setSelectedAddressId(null);
                    setAvailableServices([]);
                }
            } catch (error) {
                toast.error('Gagal menghapus alamat');
            }
        }
    };

    const handleSaveAddress = async () => {
        try {
            if (isEditing) {
                await updateAddress(editingAddressId, addressForm);
                toast.success('Alamat diperbarui');
            } else {
                await addAddress(addressForm);
                toast.success('Alamat ditambahkan');
            }
            setShowAddressForm(false);
            setIsEditing(false);
            setEditingAddressId(null);
            setAddressForm({
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
        } catch (e) {
            toast.error(isEditing ? 'Gagal memperbarui alamat' : 'Gagal menambahkan alamat');
        }
    };

    const handleProcessCheckout = async () => {
        if (!selectedAddressId || !selectedService) {
            toast.error('Lengkapi alamat dan pilihan pengiriman');
            return;
        }

        if (getSelectedTotalItems() === 0) {
            toast.error('Pilih setidaknya satu produk untuk checkout');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await api.post('/checkout/process', {
                address_id: selectedAddressId,
                courier: selectedService.courier,
                service: selectedService.service,
                shipping_cost: selectedService.cost[0].value,
                notes: notes,
                promo_code: promoCode.trim().toUpperCase() || null
            });

            const { snap_token } = response.data;

            if (!window.snap || !snap_token) {
                toast.error('Layanan pembayaran belum siap. Periksa konfigurasi Midtrans.');
                return;
            }

            window.snap.pay(snap_token, {
                onSuccess: (result) => {
                    toast.success('Pembayaran berhasil!');
                    navigate('/account/orders');
                },
                onPending: (result) => {
                    toast.info('Menunggu pembayaran...');
                    navigate('/account/orders');
                },
                onError: (result) => {
                    toast.error('Pembayaran gagal');
                },
                onClose: () => {
                    toast.warning('Anda menutup pembayaran sebelum selesai');
                    navigate('/account/orders');
                }
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memproses checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    const getCourierLogo = (courier) => {
        const c = courier?.toLowerCase() || '';
        if (c.includes('jne')) return 'https://logo.clearbit.com/jne.co.id';
        if (c.includes('pos')) return 'https://logo.clearbit.com/posindonesia.co.id';
        if (c.includes('tiki')) return 'https://logo.clearbit.com/tiki.id';
        return null;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const subtotal = getSelectedTotalPrice();
    const shippingCost = selectedService ? selectedService.cost[0].value : 0;
    const grandTotal = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] transition-colors duration-500">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <Link to="/cart" className="w-10 h-10 flex items-center justify-center bg-[var(--surface-primary)] border border-[var(--border-premium)] hover:border-[var(--primary)] rounded-full transition-all text-[var(--text-secondary)] hover:text-[var(--primary)] shadow-[var(--shadow-subtle)]">
                        <ArrowLeft size={16} />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Tahap Akhir</span>
                        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] tracking-tight">Penyelesaian</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Address Section */}
                        <section className="bg-[var(--surface-primary)] rounded-[2rem] shadow-[var(--shadow-subtle)] border border-[var(--border-premium)] overflow-hidden">
                            <div className="px-8 py-6 border-b border-[var(--border-premium)] flex items-center justify-between bg-[var(--surface-secondary)]">
                                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                        <MapPin size={16} />
                                    </div>
                                    Alamat Ekspedisi
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setShowAddressForm(true);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:text-orange-400 flex items-center gap-2 transition-colors"
                                >
                                    <Plus size={14} /> Entri Baru
                                </button>
                            </div>

                            <div className="p-8 space-y-4">
                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`group p-5 rounded-2xl border cursor-pointer transition-all relative ${selectedAddressId === addr.id
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_15px_var(--glow-warm)]'
                                                    : 'border-[var(--border-premium)] bg-[var(--surface-primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-hover)]'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-1 rounded-md border border-[var(--border-soft)]">{addr.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        {addr.id === selectedAddressId && <CircleCheckBig size={16} className="text-[var(--primary)]" />}
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                                                className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-[var(--text-primary)] text-sm">{addr.receiver_name}</p>
                                                <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">{addr.phone_number}</p>
                                                <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed line-clamp-2">{addr.full_address}</p>
                                                <p className="text-xs font-bold text-[var(--text-muted)] mt-1">{addr.city_name}, {addr.province_name} {addr.postal_code}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border-premium)]">
                                            <MapPin size={24} className="text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-[var(--text-secondary)] font-medium mb-6">Anda belum memiliki profil alamat.</p>
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="btn-atelier-primary px-8 py-3 text-[10px]"
                                        >
                                            Buat Profil Alamat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 2. Pengiriman */}
                        <section className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden">
                            <div className="p-8 border-b border-[var(--border-premium)] flex items-center gap-3 bg-[var(--surface-secondary)]">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Truck size={16} />
                                </div>
                                <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">Ekspedisi Logistik</h2>
                            </div>

                            <div className="p-8">
                                {isCalculatingShipping ? (
                                    <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm font-medium py-4">
                                        <Loader2 className="animate-spin text-[var(--primary)]" size={16} /> Kalkulasi biaya pengiriman...
                                    </div>
                                ) : availableServices.length > 0 ? (
                                    <div className="space-y-4">
                                        {availableServices.map((service, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedService(service)}
                                                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedService?.service === service.service && selectedService?.courier === service.courier
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_15px_var(--glow-warm)]'
                                                    : 'border-[var(--border-premium)] bg-[var(--surface-primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-hover)]'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-1 rounded-md">
                                                            {service.courier}
                                                        </span>
                                                        <p className="font-bold text-[var(--text-primary)]">{service.service}</p>
                                                    </div>
                                                    <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">{service.description} (Estimasi {service.cost[0].etd} hari)</p>
                                                </div>
                                                <p className="font-black text-[var(--primary)] text-lg">{formatPrice(service.cost[0].value)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : selectedAddressId ? (
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex gap-4 text-red-500">
                                        <Info size={20} className="shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold">Layanan Ekspedisi Tidak Tersedia</p>
                                            <p className="text-xs mt-1 text-red-500/80 leading-relaxed">Coba gunakan profil alamat lain di kota besar atau pastikan berat karya valid.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-[var(--text-muted)] italic">Pilih profil alamat terlebih dahulu.</p>
                                )}
                            </div>
                        </section>

                        {/* 3. Produk Terpilih */}
                        <section className="bg-[var(--surface-primary)] rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)] overflow-hidden">
                            <div className="p-8 border-b border-[var(--border-premium)] flex items-center gap-3 bg-[var(--surface-secondary)]">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <ShoppingCart size={16} />
                                </div>
                                <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">Rincian Mahakarya</h2>
                            </div>
                            <div className="p-8 space-y-6">
                                {items.filter(i => i.isSelected).map((item) => (
                                    <div key={item.cartItemId} className="flex gap-5 items-center">
                                        <div className="w-20 h-20 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-soft)] overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[var(--text-primary)] line-clamp-1 text-lg">{item.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">{item.quantity} x {formatPrice(item.price)}</p>
                                        </div>
                                        <p className="font-black text-[var(--text-primary)] text-lg">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    {/* Right Column: Summary */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="bg-[var(--surface-primary)] p-8 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-elevated)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-amber-500"></div>

                            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8">Ringkasan</h3>

                            {/* Promo Code Section */}
                            <div className="mb-8">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Kode Privilese</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Masukkan kode promo"
                                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                    />
                                    {promoCode ? (
                                        <button
                                            onClick={() => setPromoCode('')}
                                            className="px-5 py-3.5 bg-[var(--surface-secondary)] text-[var(--text-secondary)] font-bold text-xs rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                                        >
                                            Batal
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { }}
                                            className="px-5 py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-xs rounded-xl hover:scale-105 transition-transform"
                                        >
                                            Gunakan
                                        </button>
                                    )}
                                </div>
                                {promoCode.trim().toUpperCase() === 'TESTPAY1' && (
                                    <p className="text-[10px] text-orange-500 mt-3 font-bold uppercase tracking-widest">
                                        Mode simulasi Sandbox — uji coba Rp1.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-5 mb-10">
                                <div className="flex justify-between text-[var(--text-secondary)]">
                                    <span className="text-sm font-medium">Investasi Mahakarya ({getSelectedTotalItems()})</span>
                                    <span className="font-bold text-[var(--text-primary)]">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[var(--text-secondary)]">
                                    <span className="text-sm font-medium">Ekspedisi Logistik</span>
                                    <span className="font-bold text-[var(--text-primary)]">{formatPrice(shippingCost)}</span>
                                </div>

                                <div className="h-px bg-[var(--border-premium)] my-6"></div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Total Investasi</p>
                                        <p className="font-display text-3xl font-bold text-[var(--primary)] mt-1 tracking-tight">{formatPrice(grandTotal)}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleProcessCheckout}
                                disabled={isProcessing || !selectedAddressId || !selectedService}
                                className="w-full btn-atelier-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Memproses...
                                    </>
                                ) : (
                                    <>
                                        Selesaikan Pembayaran
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} className="text-green-500" />
                                    </div>
                                    <span>Transaksi Aman Terenkripsi</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                        <CreditCard size={14} className="text-blue-500" />
                                    </div>
                                    <span>Berbagai Metode Eksekutif</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-[var(--surface-primary)] p-8 rounded-[2rem] border border-[var(--border-premium)] shadow-[var(--shadow-subtle)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">Instruksi Khusus (Opsional)</h4>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tambahkan catatan untuk kurator..."
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all min-h-[120px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Address Form Modal */}
            {showAddressForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-[var(--surface-primary)] rounded-[2rem] w-full max-w-2xl shadow-[var(--shadow-elevated)] overflow-hidden animate-in fade-in zoom-in duration-300 border border-[var(--border-premium)]">
                        <div className="px-8 py-6 border-b border-[var(--border-premium)] flex items-center justify-between bg-[var(--surface-secondary)]">
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                                {isEditing ? 'Edit Profil Alamat' : 'Buat Profil Alamat'}
                            </h3>
                            <button onClick={() => setShowAddressForm(false)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-hover)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border-premium)]">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Label Alamat</label>
                                    <input
                                        type="text"
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
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.receiver_name}
                                        onChange={(e) => setAddressForm({ ...addressForm, receiver_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Provinsi</label>
                                    <select
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all appearance-none"
                                        value={addressForm.province_id}
                                        onChange={(e) => {
                                            const prov = provinces.find(p => p.province_id == e.target.value);
                                            setAddressForm({ ...addressForm, province_id: e.target.value, province_name: prov?.province || '' });
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
                                    {!isLoadingCities && addressForm.province_id && cities.length === 0 && (
                                        <p className="text-[10px] text-red-500 font-medium">Gagal memuat kota. Coba pilih provinsi lain.</p>
                                    )}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Alamat Lengkap</label>
                                    <textarea
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all min-h-[100px]"
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest block">Kode Pos</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-xs font-bold focus:ring-1 focus:ring-[var(--primary)] outline-none text-[var(--text-primary)] transition-all"
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-3 md:col-span-2 pt-2">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${addressForm.is_default ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--text-muted)] hover:border-[var(--primary)]/50'}`}>
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={addressForm.is_default}
                                            onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                                            className="hidden"
                                        />
                                        {addressForm.is_default && <ShieldCheck size={14} className="text-[var(--bg-primary)]" />}
                                    </div>
                                    <label htmlFor="is_default" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] cursor-pointer">
                                        Tetapkan Sebagai Alamat Utama
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 bg-[var(--surface-secondary)] border-t border-[var(--border-premium)] flex gap-4">
                            <button
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1 bg-transparent border border-[var(--border-premium)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                className="flex-1 btn-atelier-primary py-4"
                            >
                                {isEditing ? 'Perbarui Profil' : 'Simpan Profil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};
