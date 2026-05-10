import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { queryClient } from '../lib/queryClient'
import { AppRoutes } from './routes'

import { useEffect } from 'react'
import { useThemeStore } from '../shared/stores/themeStore'

export function App() {
  const initTheme = useThemeStore(state => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
