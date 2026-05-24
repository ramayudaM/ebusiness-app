import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useGSAPAnimations = (scopeRef, animationType) => {
    useGSAP(() => {
        if (!scopeRef.current || prefersReducedMotion()) return;

        if (animationType === 'hero-timeline') {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.hero-bg-layer', {
                opacity: 0,
                y: 40,
                duration: 1.5,
                stagger: 0.2
            })
            .from('.hero-eyebrow', {
                opacity: 0,
                x: -20,
                duration: 0.8
            }, "-=1.0")
            .from('.hero-title', {
                opacity: 0,
                y: 30,
                duration: 1,
                clipPath: 'inset(100% 0 0 0)'
            }, "-=0.6")
            .from('.hero-text, .hero-ctas, .hero-details', {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.1
            }, "-=0.6")
            .from('.hero-stage', {
                opacity: 0,
                scale: 0.95,
                x: 30,
                duration: 1.5,
                ease: 'power2.out'
            }, "-=1.2")
            .from('.hero-scroll', {
                opacity: 0,
                duration: 1
            }, "-=0.5");

        } else if (animationType === 'scroll-reveal') {
            const elements = gsap.utils.toArray('.gsap-reveal');
            
            elements.forEach((el) => {
                gsap.fromTo(el, 
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }
    }, { scope: scopeRef });
};
