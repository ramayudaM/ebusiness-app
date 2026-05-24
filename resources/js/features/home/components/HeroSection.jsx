import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HeroInstrumentStage } from './HeroInstrumentStage';
import { useGSAPAnimations } from '../hooks/useGSAPAnimations';

export const HeroSection = () => {
    const containerRef = useRef(null);
    useGSAPAnimations(containerRef, 'hero-timeline');

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden bg-[var(--bg-primary)]">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="hero-bg-layer absolute top-0 right-0 w-[60vw] h-[100vh] bg-[var(--surface-secondary)] rounded-bl-[100px] opacity-50" />
                <div className="hero-bg-layer absolute -bottom-40 -left-40 w-[80vw] h-[80vw] bg-[var(--glow-warm)] rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="container-page relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Copy Content */}
                    <div className="pt-8 lg:pt-0 z-20">
                        <div className="hero-eyebrow flex items-center gap-3 mb-6">
                            <span className="w-12 h-px bg-[var(--accent-brass)]" />
                            <span className="font-ui text-eyebrow text-[var(--accent-brass)]">NadaKita Official</span>
                        </div>
                        
                        <h1 className="hero-title font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] tracking-tight text-[var(--text-primary)] mb-6">
                            Simfoni
                            <br />
                            <span className="italic text-[var(--primary)]">Sempurna</span>
                            <br />
                            Menanti Anda
                        </h1>
                        
                        <p className="hero-text font-ui text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-md leading-relaxed">
                            Eksplorasi koleksi instrumen premium yang dikurasi khusus untuk menghidupkan setiap inspirasi musikal Anda.
                        </p>
                        
                        <div className="hero-ctas flex flex-col sm:flex-row items-center gap-4 mb-12">
                            <Link to="/explore" className="btn-atelier-primary w-full sm:w-auto">
                                Eksplorasi Katalog
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/about" className="font-ui text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-premium)] pb-1 hover:text-[var(--primary)] transition-colors">
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                        
                        <div className="hero-details flex items-center gap-8">
                            <div>
                                <p className="font-display text-3xl text-[var(--text-primary)]">100+</p>
                                <p className="font-ui text-xs text-[var(--text-muted)] uppercase tracking-wider">Instrumen</p>
                            </div>
                            <div className="w-px h-10 bg-[var(--border-soft)]" />
                            <div>
                                <p className="font-display text-3xl text-[var(--text-primary)]">Premium</p>
                                <p className="font-ui text-xs text-[var(--text-muted)] uppercase tracking-wider">Kualitas</p>
                            </div>
                        </div>
                    </div>

                    {/* Right 3D Stage */}
                    <div className="relative w-full h-full min-h-[500px] flex justify-end z-10">
                        <HeroInstrumentStage />
                    </div>
                    
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]">
                <span className="font-ui text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <ChevronDown size={16} className="animate-bounce" />
            </div>
        </section>
    );
};
