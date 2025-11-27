// providers/index.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"; // Jika pakai shadcn toast
import { queryClient } from "@/lib/react-query";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
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
