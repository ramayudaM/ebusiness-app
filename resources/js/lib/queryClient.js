import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Data dianggap fresh selama 5 menit
      retry: 1,                    // Coba ulang 1x jika request gagal
      refetchOnWindowFocus: false, // Jangan refetch saat user klik tab kembali
    },
    mutations: {
      retry: 0, // Jangan retry mutation — bisa menyebabkan order/payment dobel
    },
  },
})
