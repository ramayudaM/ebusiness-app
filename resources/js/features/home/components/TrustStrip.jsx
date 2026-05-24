import React from 'react';
import { Shield, Truck, Clock, Sparkles } from 'lucide-react';

export const TrustStrip = () => {
    const features = [
        {
            icon: <Shield size={20} />,
            title: "Garansi Resmi",
            desc: "1 Tahun Proteksi"
        },
        {
            icon: <Truck size={20} />,
            title: "Pengiriman Aman",
            desc: "Asuransi Penuh"
        },
        {
            icon: <Clock size={20} />,
            title: "Dukungan 24/7",
            desc: "Layanan Eksklusif"
        },
        {
            icon: <Sparkles size={20} />,
            title: "Kurasi Ketat",
            desc: "Kualitas Premium"
        }
    ];

    return (
        <section className="border-y border-[var(--border-soft)] bg-[var(--surface-secondary)] py-8 relative overflow-hidden">
            <div className="container-page relative z-10">
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-8 md:gap-4">
                    {features.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group flex-1 min-w-[200px]">
                            <div className="w-12 h-12 rounded-full bg-[var(--surface-primary)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-brass)] group-hover:scale-110 group-hover:bg-[var(--accent-brass-soft)] transition-all duration-300">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-ui font-bold text-sm text-[var(--text-primary)] mb-0.5">{item.title}</h4>
                                <p className="font-ui text-xs text-[var(--text-muted)]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
