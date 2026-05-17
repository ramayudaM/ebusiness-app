import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-white border-x border-zinc-900 max-w-[1920px] mx-auto transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full pt-[72px]">
                {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" theme="dark" richColors closeButton />
        </div>
    );
};
