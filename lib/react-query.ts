import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // biar gak refetch tiap pindah tab
      retry: 1, // retry sekali kalau error
      staleTime: 1000 * 60 * 5, // cache 5 menit
    },
  },
});
