// components/sidebar/SidebarApp.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/sidebar";
import { sidebarNavigation } from "@/config/sidebar-nav";
import { Sidebar } from "../ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/common";

export default function SidebarApp() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const { user } = useUser();

  // Filter menu items based on user role
  const filteredNavigation = sidebarNavigation.filter(
    (item) =>
      !item.allowedRoles || item.allowedRoles.includes(user?.role as UserRole)
  );

  // Check if menu item is active
  const isMenuActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;

    if (item.subMenu) {
      return item.subMenu.some(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
      );
    }

    return false;
  };

  // Check if submenu item is active
  const isSubMenuActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Toggle submenu
  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Check if menu should be open (if submenu is active)
  const shouldMenuBeOpen = (item: MenuItem): boolean => {
    if (openMenus.includes(item.id)) return true;
    if (item.subMenu) {
      return item.subMenu.some((sub) => isSubMenuActive(sub.href));
    }
    return false;
  };

  return (
    <Sidebar className="fixed left-0 top-0 h-screen bg-[#0066FF] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0066FF] font-bold text-sm">QIA</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">QIA</h1>
            <h2 className="font-semibold text-base leading-tight">
              QUR&apos;AN INSIGHT ACADEMY
            </h2>
          </div>
        </div>
        <p className="text-xs text-white/70 ml-[52px]">Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;
            const isActive = isMenuActive(item);
            const isOpen = shouldMenuBeOpen(item);

            // Filter submenu based on user role
            const filteredSubMenu = item.subMenu?.filter(
              (sub) =>
                !sub.allowedRoles ||
                sub.allowedRoles.includes(user?.role as UserRole)
            );

            return (
              <li key={item.id}>
                {/* Main Menu Item */}
                {hasSubMenu ? (
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      "cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive &&
                        "bg-white/20 shadow-lg border-r-4 border-white",
                      !isActive && "hover:translate-x-1.5"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-6 text-center">
                        {item.badge}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-white/10",
                      isActive && "bg-white/20 shadow-lg"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-6 text-center">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </Link>
                )}

                {/* SubMenu */}
                {hasSubMenu && isOpen && filteredSubMenu && (
                  <ul className="mt-1 ml-4 space-y-1 pl-4">
                    {filteredSubMenu.map((subItem) => {
                      const isSubActive = isSubMenuActive(subItem.href);
                      return (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block py-2 px-3 rounded text-sm transition-all duration-200",
                              "hover:bg-white/10",
                              isSubActive && "bg-white/15 font-medium"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                              {subItem.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Guide Button
      <div className="p-4 border-t border-white/10">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm">
          USER GUIDE
        </button>
      </div> */}

      {/* Footer
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>© 2024 OILS Fleet System</span>
          <LogOut className="w-4 h-4" />
        </div>
      </div> */}
    </Sidebar>
  );
}
