// providers/index.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"; // Jika pakai shadcn toast

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 menit
            gcTime: 5 * 60 * 1000, // 5 menit
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
            // Global error handler untuk mutations
            onError: (error: any) => {
              console.error("Mutation error:", error);
              // Bisa tambahkan toast notification di sini
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Uncomment jika pakai Theme Provider untuk dark mode */}
      {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
      {children}
      {/* Toast notifications (jika pakai shadcn) */}
      <Toaster />
      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
