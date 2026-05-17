import React, { useEffect, useState } from 'react';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { useCartStore } from '@/shared/stores/cartStore';
import { useAddressStore } from '@/shared/stores/addressStore';
import { motion } from 'framer-motion';
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

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

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
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col text-white transition-colors duration-300 relative z-0 overflow-x-hidden selection:bg-orange-500/30">
            {/* Global Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-orange-600/5 blur-[150px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-orange-700/5 blur-[150px] mix-blend-screen"></div>
            </div>

            <Navbar />
            
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="w-full flex flex-col"
                >
                    <motion.div variants={fadeIn} className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                        <Link to="/cart" className="hover:text-orange-500 flex items-center gap-1 transition-colors">
                            <ArrowLeft size={14} /> Kembali ke Keranjang
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-zinc-300 font-bold">Checkout</span>
                    </motion.div>

                    <motion.div variants={fadeIn} className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight py-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 leading-tight">
                            Selesaikan Pesanan Anda
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base mt-2">
                            Satu langkah lagi untuk memiliki instrumen impian dan melahirkan karya terbaik Anda.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: Details */}
                        <motion.div variants={fadeIn} className="lg:col-span-2 space-y-8">
                            {/* Address Section */}
                            <section className="bg-[#0A0A0A] border border-zinc-900/80 rounded-[2rem] overflow-hidden shadow-2xl relative group p-[1px] bg-gradient-to-b from-zinc-800 to-zinc-900/10">
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"></div>
                                <div className="relative bg-[#0A0A0A] rounded-[calc(2rem-1px)] overflow-hidden">
                                    <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/40">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <MapPin size={20} className="text-orange-500" /> Alamat Pengiriman
                                        </h2>
                                        <button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setShowAddressForm(true);
                                            }}
                                            className="text-sm font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
                                        >
                                            <Plus size={16} /> Tambah Baru
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {addresses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {addresses.map((addr) => (
                                                    <div 
                                                        key={addr.id}
                                                        onClick={() => setSelectedAddressId(addr.id)}
                                                        className={`group/addr p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                                                            selectedAddressId === addr.id 
                                                            ? 'border-orange-500/50 bg-orange-950/10 shadow-[0_0_30px_rgba(234,88,12,0.1)]' 
                                                            : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/20'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">{addr.label}</span>
                                                            <div className="flex items-center gap-2">
                                                                {addr.id === selectedAddressId && <CircleCheckBig size={16} className="text-orange-500" />}
                                                                <div className="flex gap-1.5 md:opacity-0 group-hover/addr:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                                                        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500 hover:border-orange-500/30 transition-colors shadow-md"
                                                                    >
                                                                        <Pencil size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                                        className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-colors shadow-md"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-white">{addr.receiver_name}</p>
                                                        <p className="text-xs text-zinc-400 mt-1">{addr.phone_number}</p>
                                                        <p className="text-xs text-zinc-500 mt-3 line-clamp-2 leading-relaxed">{addr.full_address}</p>
                                                        <p className="text-xs text-zinc-500 mt-0.5">{addr.city_name}, {addr.province_name} {addr.postal_code}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 bg-zinc-900/10 rounded-2xl border border-zinc-900/80 border-dashed">
                                                <MapPin className="mx-auto text-zinc-650 mb-3" size={32} />
                                                <p className="text-zinc-400 mb-4 text-sm">Anda belum memiliki alamat pengiriman.</p>
                                                <button 
                                                    onClick={() => setShowAddressForm(true)}
                                                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:scale-105"
                                                >
                                                    Tambah Alamat Baru
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* 2. Pengiriman */}
                            <section className="bg-[#0A0A0A] border border-zinc-900/80 rounded-[2rem] overflow-hidden shadow-2xl relative group p-[1px] bg-gradient-to-b from-zinc-800 to-zinc-900/10">
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"></div>
                                <div className="relative bg-[#0A0A0A] rounded-[calc(2rem-1px)] overflow-hidden">
                                    <div className="px-6 py-5 border-b border-zinc-900 flex items-center gap-3 bg-zinc-950/40">
                                        <div className="w-10 h-10 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                                            <Truck size={20} />
                                        </div>
                                        <h2 className="text-lg font-bold text-white">Pilihan Pengiriman</h2>
                                    </div>
                                    
                                    <div className="p-6">
                                        {isCalculatingShipping ? (
                                             <div className="flex items-center gap-3 text-zinc-400 text-sm font-medium py-6 justify-center">
                                                 <Loader2 className="animate-spin text-orange-500" size={20} /> Sedang menghitung ongkos kirim...
                                             </div>
                                         ) : availableServices.length > 0 ? (
                                             <div className="space-y-3">
                                                 {availableServices.map((service, idx) => (
                                                     <div 
                                                         key={idx}
                                                         onClick={() => setSelectedService(service)}
                                                         className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                             selectedService?.service === service.service && selectedService?.courier === service.courier
                                                             ? 'border-orange-500 bg-orange-950/10 shadow-[0_0_20px_rgba(234,88,12,0.1)]' 
                                                             : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/20'
                                                         }`}
                                                     >
                                                         <div className="flex flex-col gap-1">
                                                             <div className="flex items-center gap-3">
                                                                 {getCourierLogo(service.courier) ? (
                                                                     <>
                                                                         <img 
                                                                             src={getCourierLogo(service.courier)} 
                                                                             alt={service.courier} 
                                                                             className="h-4 sm:h-5 object-contain filter brightness-95"
                                                                             onError={(e) => {
                                                                                 e.target.style.display = 'none';
                                                                                 e.target.nextElementSibling.style.display = 'inline-block';
                                                                             }}
                                                                         />
                                                                         <span className="text-[10px] font-black uppercase bg-orange-600/20 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded hidden">
                                                                             {service.courier}
                                                                         </span>
                                                                     </>
                                                                 ) : (
                                                                     <span className="text-[10px] font-black uppercase bg-orange-600/20 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded">
                                                                         {service.courier}
                                                                     </span>
                                                                 )}
                                                                 <p className="font-bold text-white">{service.service}</p>
                                                             </div>
                                                             <p className="text-xs text-zinc-400">{service.description} ({service.cost[0].etd} hari)</p>
                                                         </div>
                                                         <p className="font-extrabold text-orange-500 text-lg">{formatPrice(service.cost[0].value)}</p>
                                                     </div>
                                                 ))}
                                             </div>
                                         ) : selectedAddressId ? (
                                              <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-5 flex gap-4 text-red-400">
                                                  <Info size={24} className="shrink-0 text-red-500" />
                                                  <div>
                                                      <p className="text-sm font-bold text-white">Tidak ada layanan pengiriman tersedia.</p>
                                                      <p className="text-xs mt-1.5 text-red-400/80 leading-relaxed">Coba gunakan alamat lain di kota-kota besar (seperti Jakarta, Surabaya, atau Bandung) atau hubungi CS kami.</p>
                                                  </div>
                                              </div>
                                         ) : (
                                             <div className="text-center py-6 text-zinc-500 text-sm italic">
                                                 Pilih alamat terlebih dahulu untuk melihat pilihan pengiriman yang tersedia.
                                             </div>
                                         )}
                                    </div>
                                </div>
                            </section>

                            {/* 3. Produk Terpilih */}
                            <section className="bg-[#0A0A0A] border border-zinc-900/80 rounded-[2rem] overflow-hidden shadow-2xl relative group p-[1px] bg-gradient-to-b from-zinc-800 to-zinc-900/10">
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"></div>
                                <div className="relative bg-[#0A0A0A] rounded-[calc(2rem-1px)] overflow-hidden">
                                    <div className="px-6 py-5 border-b border-zinc-900 flex items-center gap-3 bg-zinc-950/40">
                                        <div className="w-10 h-10 bg-orange-600/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                                            <ShoppingCart size={20} />
                                        </div>
                                        <h2 className="text-lg font-bold text-white">Rincian Produk</h2>
                                    </div>
                                    <div className="p-6 divide-y divide-zinc-900/80 space-y-4">
                                         {items.filter(i => i.isSelected).map((item, idx) => (
                                            <div key={item.cartItemId} className={`flex gap-4 ${idx > 0 ? 'pt-4' : ''}`}>
                                                <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="font-bold text-white line-clamp-1 text-sm">{item.name}</p>
                                                    <p className="text-xs text-zinc-400 mt-1">{item.quantity} x {formatPrice(item.price)}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="font-bold text-white text-sm">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </motion.div>

                        {/* Right Column: Summary */}
                        <motion.div variants={fadeIn} className="lg:sticky lg:top-[100px] space-y-6">
                            <div className="bg-[#0A0A0A] p-6 rounded-[2rem] border border-zinc-900 shadow-2xl relative overflow-hidden group/summary">
                                {/* Accent card top border glow */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"></div>
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/5 blur-[50px] pointer-events-none transition-all group-hover/summary:bg-orange-500/10"></div>
                                
                                <h3 className="text-xl font-extrabold text-white mb-6">Ringkasan Pesanan</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-zinc-400">
                                        <span className="text-sm">Total Harga ({getSelectedTotalItems()} produk)</span>
                                        <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span className="text-sm">Total Ongkos Kirim</span>
                                        <span className="font-bold text-white">{formatPrice(shippingCost)}</span>
                                    </div>
                                    
                                    <div className="h-px bg-zinc-900 my-4"></div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Pembayaran</p>
                                            <p className="text-2xl font-black text-white mt-1 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400">{formatPrice(grandTotal)}</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleProcessCheckout}
                                    disabled={isProcessing || !selectedAddressId || !selectedService}
                                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:bg-zinc-900 disabled:text-zinc-650 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:shadow-none border border-transparent disabled:border-zinc-850"
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
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-green-500" /> Transaksi Aman & Terenkripsi
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        <CreditCard size={14} className="text-orange-500" /> Berbagai Metode Pembayaran
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-[#0A0A0A] p-6 rounded-[2rem] border border-zinc-900 shadow-2xl relative">
                                <h4 className="text-sm font-bold text-white mb-3">Catatan Pesanan (Opsional)</h4>
                                <textarea 
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tulis catatan untuk toko..."
                                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-white placeholder-zinc-650 transition-all min-h-[100px] resize-none"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Address Form Modal */}
            {showAddressForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                            </h3>
                            <button onClick={() => setShowAddressForm(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Label Alamat</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Rumah, Kantor"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-zinc-650"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nama Penerima</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-zinc-650"
                                        value={addressForm.receiver_name}
                                        onChange={(e) => setAddressForm({...addressForm, receiver_name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nomor Telepon</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-zinc-650"
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({...addressForm, phone_number: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Provinsi</label>
                                    <select 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-zinc-650"
                                        value={addressForm.province_id}
                                        onChange={(e) => {
                                            const prov = provinces.find(p => p.province_id == e.target.value);
                                            setAddressForm({...addressForm, province_id: e.target.value, province_name: prov?.province || ''});
                                            fetchCities(e.target.value);
                                        }}
                                    >
                                        <option value="" className="bg-[#0A0A0A] text-white">Pilih Provinsi</option>
                                        {provinces.map(p => <option key={p.province_id} value={p.province_id} className="bg-[#0A0A0A] text-white">{p.province}</option>)}
                                    </select>
                                </div>
                                 <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kota/Kabupaten</label>
                                    <select 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white disabled:opacity-50"
                                        disabled={!addressForm.province_id || isLoadingCities}
                                        value={addressForm.city_id}
                                        onChange={(e) => {
                                            const city = cities.find(c => String(c.city_id) === String(e.target.value));
                                            setAddressForm({...addressForm, city_id: e.target.value, city_name: city?.city_name || ''});
                                        }}
                                    >
                                        <option value="" className="bg-[#0A0A0A] text-white">{isLoadingCities ? 'Memuat daftar kota...' : 'Pilih Kota'}</option>
                                        {!isLoadingCities && cities.map(c => (
                                            <option key={c.city_id} value={c.city_id} className="bg-[#0A0A0A] text-white">{c.city_name}</option>
                                        ))}
                                    </select>
                                    {!isLoadingCities && addressForm.province_id && cities.length === 0 && (
                                        <p className="text-[10px] text-red-500 font-medium">Gagal memuat kota. Coba pilih provinsi lain atau tunggu sebentar.</p>
                                    )}
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Alamat Lengkap</label>
                                    <textarea 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white min-h-[100px] transition-all"
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({...addressForm, full_address: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kode Pos</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none text-white placeholder-zinc-650"
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
                                        className="accent-orange-500"
                                    />
                                    <label htmlFor="is_default" className="text-sm font-medium text-zinc-300 cursor-pointer">Jadikan Alamat Utama</label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-zinc-950 flex gap-3 border-t border-zinc-900 transition-colors">
                            <button 
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1 bg-zinc-900 border border-zinc-850 text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSaveAddress}
                                className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-950/20"
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

