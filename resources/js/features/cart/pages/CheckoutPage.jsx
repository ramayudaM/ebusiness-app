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
    const { items, getSelectedTotalPrice, getSelectedTotalItems } = useCartStore();
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

        setIsProcessing(true);
        try {
            const response = await api.post('/checkout/process', {
                address_id: selectedAddressId,
                courier: selectedService.courier,
                service: selectedService.service,
                shipping_cost: selectedService.cost[0].value,
                notes: notes
            });

            const { snap_token } = response.data;

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/cart" className="hover:text-orange-600 flex items-center gap-1">
                        <ArrowLeft size={14} /> Kembali ke Keranjang
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 dark:text-white font-bold">Checkout</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                            {/* Address Section */}
                            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/50">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin size={20} className="text-orange-600" /> Alamat Pengiriman
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setIsEditing(false);
                                            setShowAddressForm(true);
                                        }}
                                        className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Tambah Baru
                                    </button>
                                </div>

                            <div className="p-6 space-y-4">
                                {addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <div 
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                                                    selectedAddressId === addr.id 
                                                    ? 'border-orange-600 bg-orange-50/30 dark:bg-orange-900/10' 
                                                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-950'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{addr.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        {addr.id === selectedAddressId && <CircleCheckBig size={16} className="text-orange-600" />}
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                                                className="p-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                                className="p-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-100 shadow-sm"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-900 dark:text-white">{addr.receiver_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addr.phone_number}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">{addr.full_address}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">{addr.city_name}, {addr.province_name} {addr.postal_code}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">Anda belum memiliki alamat pengiriman.</p>
                                        <button 
                                            onClick={() => setShowAddressForm(true)}
                                            className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold text-sm"
                                        >
                                            Tambah Alamat Baru
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 2. Pengiriman */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/50">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                                    <Truck size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pilihan Pengiriman</h2>
                            </div>
                            
                            <div className="p-6">
                                {isCalculatingShipping ? (
                                     <div className="flex items-center gap-2 text-gray-500 text-sm font-medium py-4">
                                         <Loader2 className="animate-spin" size={16} /> Mengambil pilihan pengiriman...
                                     </div>
                                 ) : availableServices.length > 0 ? (
                                     <div className="space-y-3">
                                         {availableServices.map((service, idx) => (
                                             <div 
                                                 key={idx}
                                                 onClick={() => setSelectedService(service)}
                                                 className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                                     selectedService?.service === service.service && selectedService?.courier === service.courier
                                                     ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/10' 
                                                     : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700 bg-white dark:bg-gray-950'
                                                 }`}
                                             >
                                                 <div>
                                                     <div className="flex items-center gap-3 mb-1">
                                                         {getCourierLogo(service.courier) ? (
                                                             <>
                                                                 <img 
                                                                     src={getCourierLogo(service.courier)} 
                                                                     alt={service.courier} 
                                                                     className="h-4 sm:h-5 object-contain"
                                                                     onError={(e) => {
                                                                         e.target.style.display = 'none';
                                                                         e.target.nextElementSibling.style.display = 'inline-block';
                                                                     }}
                                                                 />
                                                                 <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded hidden">
                                                                     {service.courier}
                                                                 </span>
                                                             </>
                                                         ) : (
                                                             <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">
                                                                 {service.courier}
                                                             </span>
                                                         )}
                                                         <p className="font-bold text-gray-900 dark:text-white">{service.service}</p>
                                                     </div>
                                                     <p className="text-xs text-gray-500 dark:text-gray-400">{service.description} ({service.cost[0].etd} hari)</p>
                                                 </div>
                                                 <p className="font-extrabold text-gray-900 dark:text-white">{formatPrice(service.cost[0].value)}</p>
                                             </div>
                                         ))}
                                     </div>
                                 ) : selectedAddressId ? (
                                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-4 flex gap-3 text-red-600 dark:text-red-400">
                                          <Info size={18} className="shrink-0 mt-0.5" />
                                          <div>
                                              <p className="text-sm font-bold">Tidak ada layanan pengiriman tersedia.</p>
                                              <p className="text-xs mt-1 text-red-500 dark:text-red-400/80">Coba gunakan alamat lain di kota-kota besar (seperti Jakarta, Surabaya, atau Bandung) atau pastikan berat produk valid.</p>
                                          </div>
                                      </div>
                                 ) : (
                                     <p className="text-sm text-gray-500 italic">Pilih alamat terlebih dahulu untuk melihat pilihan pengiriman.</p>
                                 )}
                            </div>
                        </section>

                        {/* 3. Produk Terpilih */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/50">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:purple-400">
                                    <ShoppingCart size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rincian Produk</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                 {items.filter(i => i.isSelected).map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.quantity} x {formatPrice(item.price)}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:sticky lg:top-[100px] space-y-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                            
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Ringkasan Pesanan</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span className="text-sm">Total Harga ({getSelectedTotalItems()} produk)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span className="text-sm">Total Ongkos Kirim</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(shippingCost)}</span>
                                </div>
                                
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                                        <p className="text-2xl font-black text-gray-950 dark:text-white mt-1">{formatPrice(grandTotal)}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleProcessCheckout}
                                disabled={isProcessing || !selectedAddressId || !selectedService}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed group shadow-lg shadow-orange-100 dark:shadow-none"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Memproses...
                                    </>
                                ) : (
                                    <>
                                        Bayar Sekarang
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-green-500" /> Transaksi Aman & Terenkripsi
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <CreditCard size={14} className="text-blue-500" /> Berbagai Metode Pembayaran
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-6">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Catatan Pesanan (Opsional)</h4>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tulis catatan untuk toko..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white dark:placeholder-gray-500 transition-all min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Address Form Modal */}
            {showAddressForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                            </h3>
                            <button onClick={() => setShowAddressForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Label Alamat</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Rumah, Kantor"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white dark:placeholder-gray-500"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Penerima</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white dark:placeholder-gray-500"
                                        value={addressForm.receiver_name}
                                        onChange={(e) => setAddressForm({...addressForm, receiver_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Telepon</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white dark:placeholder-gray-500"
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({...addressForm, phone_number: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Provinsi</label>
                                    <select 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white dark:placeholder-gray-500"
                                        value={addressForm.province_id}
                                        onChange={(e) => {
                                            const prov = provinces.find(p => p.province_id == e.target.value);
                                            setAddressForm({...addressForm, province_id: e.target.value, province_name: prov?.province || ''});
                                            fetchCities(e.target.value);
                                        }}
                                    >
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province}</option>)}
                                    </select>
                                </div>
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kota/Kabupaten</label>
                                    <select 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white disabled:opacity-50"
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
                                    {!isLoadingCities && addressForm.province_id && cities.length === 0 && (
                                        <p className="text-[10px] text-red-500 font-medium">Gagal memuat kota. Coba pilih provinsi lain atau tunggu sebentar.</p>
                                    )}
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
                                    <textarea 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white min-h-[100px] transition-all"
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({...addressForm, full_address: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kode Pos</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none dark:text-white dark:placeholder-gray-500"
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                                    />
                                </div>
                                <div className="flex items-center gap-2 md:col-span-2 pt-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_default"
                                        checked={addressForm.is_default}
                                        onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                                        className="accent-orange-600"
                                    />
                                    <label htmlFor="is_default" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Jadikan Alamat Utama</label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-950 flex gap-3 border-t dark:border-gray-800 transition-colors">
                            <button 
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSaveAddress}
                                className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100 dark:shadow-none"
                            >
                                Simpan Alamat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

