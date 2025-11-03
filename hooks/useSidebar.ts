// hooks/useSidebar.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  openMenus: string[];
  isCollapsed: boolean;
  toggleMenu: (menuId: string) => void;
  toggleCollapse: () => void;
  setOpenMenus: (menus: string[]) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      openMenus: [],
      isCollapsed: false,

      toggleMenu: (menuId: string) =>
        set((state) => ({
          openMenus: state.openMenus.includes(menuId)
            ? state.openMenus.filter((id) => id !== menuId)
            : [...state.openMenus, menuId],
        })),

      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setOpenMenus: (menus: string[]) => set({ openMenus: menus }),
    }),
    {
      name: "sidebar-storage",
    }
  )
);
