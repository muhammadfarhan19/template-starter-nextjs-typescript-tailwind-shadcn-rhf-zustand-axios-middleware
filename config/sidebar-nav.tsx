// config/sidebar-nav.tsx

import {
  FileText,
  Upload,
  Users,
  Workflow,
  BarChart3,
  Settings,
  Home,
  User,
  Book,
  Box,
  Calendar,
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const sidebarNavigation: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    allowedRoles: ["admin", "fleet_manager", "driver", "viewer"],
    subMenu: [
      {
        id: "dashboard-mt",
        label: "Dashboard MT",
        href: "/dashboard/mt",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "dashboard-krp",
        label: "Dashboard KRP",
        href: "/dashboard/krp",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "daily-report",
    label: "Laporan Harian",
    icon: FileText,
    allowedRoles: ["admin", "fleet_manager", "driver"],
    subMenu: [
      {
        id: "operational-data",
        label: "Data Operasional",
        href: "/report/operational-data",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "daily-checklist",
        label: "Checklist Harian",
        href: "/report/daily-checklist",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "document-upload",
    label: "Upload Dokumen",
    icon: Upload,
    badge: 12,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "spp-document",
        label: "Dokumen SPP",
        href: "/documents/spp-document",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "vehicle-data-master",
    label: "Master Data Kendaraan",
    icon: Users,
    badge: 20,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "vehicle-mt",
        label: "Kendaraan MT",
        href: "/vehicle/mt",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "vehicle-krp",
        label: "Kendaraan KRP",
        href: "/vehicle/krp",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "personel-data-master",
    label: "Master Data Personel",
    icon: User,
    badge: 20,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "personel-mt",
        label: "Master Data AMT",
        href: "/personel/amt",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "personel-krp",
        label: "Master Data Driver",
        href: "/personel/driver",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "maintenance-workflow",
    label: "Workflow Maintenance",
    icon: Book,
    badge: 20,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "workflow-maintenance-mt",
        label: "Workflow Maintenance MT",
        href: "/maintenance/mt",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "workflow-maintenance-krp",
        label: "Workflow Maintenance Mobil KRP",
        href: "/maintenance/krp",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "wheel-workshop",
    label: "Workshop Ban",
    icon: Box,
    badge: 20,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "wheel-workshop-mt",
        label: "Jadwal Pemasangan MT",
        href: "/wheel/mt",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "wheel-workshop-krp",
        label: "Jadwal Pemasangan KRP",
        href: "/wheel/krp",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "dispatcher",
    label: "Dispatcher",
    icon: Calendar,
    badge: 20,
    allowedRoles: ["admin", "fleet_manager"],
    subMenu: [
      {
        id: "dispatcher-scheduling",
        label: "Dispatcher Scheduling",
        href: "/dispatcher/scheduling",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "dispatcher-change-unit-form",
        label: "Form Unit Ganti Sewa",
        href: "/dispatcher/change-unit-form",
        allowedRoles: ["admin", "fleet_manager"],
      },
      {
        id: "dispatcher-vehicle-inspection",
        label: "Inspection Kendaraan",
        href: "/dispatcher/vehicle-inspection",
        allowedRoles: ["admin", "fleet_manager"],
      },
    ],
  },
  {
    id: "reports-analytics",
    label: "Reports & Analytics",
    href: "/reports-analytics",
    icon: BarChart3,
    allowedRoles: ["admin", "fleet_manager", "viewer"],
  },
  {
    id: "system-settings",
    label: "System Settings",
    href: "/system-settings",
    icon: Settings,
    allowedRoles: ["admin", "fleet_manager", "viewer"],
  },
];
