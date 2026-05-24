import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGSAPAnimations } from '../hooks/useGSAPAnimations';

export const CategoryShowcase = ({ categories = [] }) => {
    const sectionRef = useRef(null);
    useGSAPAnimations(sectionRef, 'scroll-reveal');

    // Default categories if API fails
    const displayCategories = categories.length > 0 ? categories.slice(0, 3) : [
        { id: 1, name: 'Gitar & Bass', slug: 'gitar-bass', image_url: '/storage/categories/default.jpg' },
        { id: 2, name: 'Keyboard & Piano', slug: 'keyboard-piano', image_url: '/storage/categories/default.jpg' },
        { id: 3, name: 'Drum & Perkusi', slug: 'drum-perkusi', image_url: '/storage/categories/default.jpg' },
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-[var(--bg-primary)]">
            <div className="container-page">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gsap-reveal">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[1px] bg-[var(--accent-brass)]" />
                            <span className="font-ui text-eyebrow text-[var(--accent-brass)]">
                                KATEGORI INSTRUMEN
                            </span>
                        </div>
                        <h2 className="font-display text-section-title text-[var(--text-primary)]">
                            Eksplorasi <span className="italic text-[var(--primary)]">Suara</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-reveal">
                    {displayCategories.map((cat, i) => (
                        <Link 
                            key={cat.id} 
                            to={`/explore?category=${cat.slug}`}
                            className={`group relative overflow-hidden rounded-[32px] block ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[16/9]' : 'aspect-square'}`}
                            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-soft)' }}
                        >
                            <img 
                                src={cat.image_url} 
                                alt={cat.name}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' }}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-overlay)] via-[rgba(0,0,0,0.2)] to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
                                <div>
                                    <h3 className="font-display text-3xl text-white mb-2 group-hover:text-[var(--accent-brass)] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <span className="font-ui text-sm text-white/70 flex items-center gap-2">
                                        Eksplorasi Koleksi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
