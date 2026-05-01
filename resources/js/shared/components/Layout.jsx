import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 border-x border-gray-100 max-w-[1920px] mx-auto">
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden">
                {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
        </div>
    );
};
