// app/dashboard/layout.tsx

import HeaderApp from "@/components/layouts/headers/HeaderApp";
import SidebarApp from "@/components/layouts/SidebarApp";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarApp />

      <main className="min-h-screen w-full">
        <HeaderApp />

        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
