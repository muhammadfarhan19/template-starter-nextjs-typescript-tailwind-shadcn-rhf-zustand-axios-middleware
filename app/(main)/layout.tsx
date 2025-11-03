// app/dashboard/layout.tsx

import { BreadcrumbComponent } from "@/components/layouts/BreadcrumbComponent";
import Header from "@/components/layouts/Header";
import SidebarApp from "@/components/layouts/SidebarApp";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = {
    role: "fleet_manager" as const,
    name: "Joni Talang",
    position: "Fleet Manager",
  };

  return (
    <SidebarProvider>
      <SidebarApp
        userRole={userData.role}
        userName={userData.name}
        userPosition={userData.position}
      />

      <main className="min-h-screen w-full">
        <Header />
        <BreadcrumbComponent />
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
