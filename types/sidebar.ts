// types/sidebar.ts

import { LucideIcon } from "lucide-react";
import { UserRole } from "./common";

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  allowedRoles?: UserRole[];
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  subMenu?: SubMenuItem[];
  allowedRoles?: UserRole[];
}

export interface SidebarSection {
  items: MenuItem[];
}
