import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t py-12 text-sm text-gray-600">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">NadaKita</h3>
                    <p className="mb-4 text-xs font-medium text-gray-500">
                        Pusat kurasi instrumen musik digital nomor satu di Indonesia. Kami mendukung setiap langkah perjalanan musikal Anda.
                    </p>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">ig</div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">tw</div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">yt</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Belanja</h4>
                    <ul className="space-y-3">
                        <li><Link to="/category/gitar-bass" className="hover:text-orange-600 transition-colors">Gitar & Bass</Link></li>
                        <li><Link to="/category/piano" className="hover:text-orange-600 transition-colors">Piano & Keyboard</Link></li>
                        <li><Link to="/category/recording" className="hover:text-orange-600 transition-colors">Recording & Audio</Link></li>
                        <li><Link to="/promo" className="hover:text-orange-600 transition-colors">Promo Terbatas</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Layanan</h4>
                    <ul className="space-y-3">
                        <li><Link to="/about" className="hover:text-orange-600 transition-colors">Tentang Kami</Link></li>
                        <li><Link to="/return" className="hover:text-orange-600 transition-colors">Kebijakan Pengembalian</Link></li>
                        <li><Link to="/track" className="hover:text-orange-600 transition-colors">Lacak Pesanan</Link></li>
                        <li><Link to="/contact" className="hover:text-orange-600 transition-colors">Hubungi Ahli</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Metode Pembayaran</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-white border rounded px-3 py-1 font-bold text-[10px] text-blue-800">VISA</div>
                        <div className="bg-white border rounded px-3 py-1 font-bold text-[10px] text-red-600">Mastercard</div>
                        <div className="bg-white border rounded px-3 py-1 font-bold text-[10px] text-red-500">QRIS</div>
                    </div>
                    <p className="text-[10px] text-gray-400">
                        NadaKita telah terverifikasi oleh badan otoritas transaksi digital nasional.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-xs">
                <p>&copy; 2024 NadaKita Digital Experience. Kurasi Instrumen Terpilih.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-orange-600 transition-colors">Syarat & Ketentuan</Link>
                    <Link to="/privacy" className="hover:text-orange-600 transition-colors">Kebijakan Privasi</Link>
                </div>
            </div>
        </footer>
    );
};
