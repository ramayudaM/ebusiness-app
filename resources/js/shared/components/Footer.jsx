import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-[#0A0A0A] border-t border-zinc-900 py-16 text-sm text-zinc-400 relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[100px] bg-orange-600/5 blur-[80px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                        </div>
                        NadaKita
                    </h3>
                    <p className="mb-6 text-xs font-medium text-zinc-500 leading-relaxed">
                        Pusat kurasi instrumen musik digital nomor satu di Indonesia. Kami mendukung setiap langkah perjalanan musikal Anda.
                    </p>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-orange-500 transition-all rounded-full flex items-center justify-center text-zinc-500 cursor-pointer shadow-sm">IG</div>
                        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-orange-500 transition-all rounded-full flex items-center justify-center text-zinc-500 cursor-pointer shadow-sm">TW</div>
                        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-orange-500 transition-all rounded-full flex items-center justify-center text-zinc-500 cursor-pointer shadow-sm">YT</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Belanja</h4>
                    <ul className="space-y-3">
                        <li><Link to="/explore?category=gitar" className="hover:text-orange-500 transition-colors">Gitar</Link></li>
                        <li><Link to="/explore?category=bass" className="hover:text-orange-500 transition-colors">Bass</Link></li>
                        <li><Link to="/explore?category=keyboard-piano" className="hover:text-orange-500 transition-colors">Keyboard & Piano</Link></li>
                        <li><Link to="/explore?category=drum-perkusi" className="hover:text-orange-500 transition-colors">Drum & Perkusi</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Layanan</h4>
                    <ul className="space-y-3">
                        <li><Link to="/help" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
                        <li><Link to="/help" className="hover:text-orange-500 transition-colors">Kebijakan Pengembalian</Link></li>
                        <li><Link to="/account/orders" className="hover:text-orange-500 transition-colors">Lacak Pesanan</Link></li>
                        <li><Link to="/help" className="hover:text-orange-500 transition-colors">Hubungi Ahli</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Metode Pembayaran</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 font-bold text-[10px] text-zinc-300">VISA</div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 font-bold text-[10px] text-zinc-300">Mastercard</div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 font-bold text-[10px] text-zinc-300">QRIS</div>
                    </div>
                    <p className="text-[10px] text-zinc-600">
                        NadaKita telah terverifikasi oleh badan otoritas transaksi digital nasional.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs relative z-10">
                <p>&copy; 2026 NadaKita. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link to="/help" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                    <Link to="/help" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                </div>
            </div>
        </footer>
    );
};
