import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

// Premium SVG Fallback if 3D model fails/is missing
const PremiumFallback = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[var(--surface-secondary)] overflow-hidden rounded-[40px] md:rounded-[60px] border border-[var(--border-soft)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--glow-warm)] to-transparent opacity-20" />
        <svg viewBox="0 0 400 400" className="w-64 h-64 md:w-96 md:h-96" style={{ opacity: 0.8 }}>
            <circle cx="200" cy="200" r="160" fill="none" stroke="var(--accent-brass)" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_40s_linear_infinite]" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="var(--primary)" strokeWidth="2" opacity="0.3" className="animate-[spin_20s_linear_infinite_reverse]" />
            <circle cx="200" cy="200" r="80" fill="var(--primary)" opacity="0.1" />
            <path d="M190,120 L210,120 L220,280 L180,280 Z" fill="var(--accent-brass)" opacity="0.6" />
            <path d="M160,200 Q200,180 240,200 T320,200" fill="none" stroke="var(--text-primary)" strokeWidth="3" opacity="0.2" className="animate-pulse" />
        </svg>
        <div className="absolute bottom-12 text-center">
            <span className="font-ui text-xs tracking-widest text-[var(--text-muted)] uppercase">Sonic Atelier</span>
        </div>
    </div>
);

const GuitarModel = () => {
    // Attempt to load model
    const { scene } = useGLTF('/models/hero-guitar.glb');
    return (
        <PresentationControls 
            global 
            rotation={[0.13, 0.1, 0]} 
            polar={[-0.2, 0.2]} 
            azimuth={[-0.5, 0.5]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
        >
            <Float rotationIntensity={0.5} floatIntensity={0.5} speed={2}>
                <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
            </Float>
        </PresentationControls>
    );
};

export const HeroInstrumentStage = () => {
    return (
        <div className="w-full h-[600px] md:h-[800px] relative rounded-[40px] md:rounded-[60px] overflow-hidden hero-stage">
            <ErrorBoundary fallback={<PremiumFallback />}>
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-[var(--surface-secondary)] rounded-[40px] md:rounded-[60px]">
                        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
                    </div>
                }>
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <Environment preset="studio" />
                        <GuitarModel />
                    </Canvas>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

// Required for GLTF loading
useGLTF.preload('/models/hero-guitar.glb');
