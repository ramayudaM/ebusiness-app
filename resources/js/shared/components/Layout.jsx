import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans text-gray-900 dark:text-white border-x border-gray-100 dark:border-gray-800 max-w-[1920px] mx-auto transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
        </div>
    );
};
