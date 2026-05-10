import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store to manage light/dark mode.
 */
export const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'light',
            
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });
                get().applyTheme(newTheme);
            },

            applyTheme: (theme) => {
                const root = window.document.documentElement;
                if (theme === 'dark') {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                } else {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                }
            },

            initTheme: () => {
                const theme = get().theme;
                get().applyTheme(theme);
            }
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
