// config/sidebar-nav.tsx

import { Home, CheckCircleIcon, BookAIcon } from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const sidebarNavigation: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    allowedRoles: ["OWNER", "ACADEMIC", "FINANCE", "HR"],
  },
  {
    id: "students",
    label: "Master Data Santri",
    icon: BookAIcon,
    allowedRoles: ["OWNER", "ACADEMIC", "HR"],
    subMenu: [
      {
        id: "students-list",
        label: "Daftar Santri",
        href: "/students/list",
        allowedRoles: ["OWNER", "ACADEMIC", "HR"],
      },
      {
        id: "students-registration",
        label: "Formulir",
        href: "/students/formulir",
        allowedRoles: ["OWNER", "ACADEMIC", "HR"],
      },
    ],
  },
  {
    id: "presence",
    label: "Kehadiran",
    icon: CheckCircleIcon,
    allowedRoles: ["OWNER", "ACADEMIC", "HR"],
    subMenu: [
      {
        id: "presence-student",
        label: "Kehadiran Santri",
        href: "/presence/students",
        allowedRoles: ["OWNER", "ACADEMIC", "HR"],
      },
      {
        id: "presence-teacher",
        label: "Kehadiran Pengajar",
        href: "/presence/teachers",
        allowedRoles: ["OWNER", "ACADEMIC", "HR"],
      },
    ],
  },
  // {
  //   id: "document-upload",
  //   label: "Upload Dokumen",
  //   icon: Upload,
  //   badge: 12,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "spp-document",
  //       label: "Dokumen SPP",
  //       href: "/documents/spp-document",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "vehicle-data-master",
  //   label: "Master Data Kendaraan",
  //   icon: Users,
  //   badge: 20,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "vehicle-mt",
  //       label: "Kendaraan MT",
  //       href: "/vehicle/mt",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "vehicle-krp",
  //       label: "Kendaraan KRP",
  //       href: "/vehicle/krp",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "personel-data-master",
  //   label: "Master Data Personel",
  //   icon: User,
  //   badge: 20,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "personel-mt",
  //       label: "Master Data AMT",
  //       href: "/personel/amt",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "personel-krp",
  //       label: "Master Data Driver",
  //       href: "/personel/krp",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "maintenance-workflow",
  //   label: "Workflow Maintenance",
  //   icon: Book,
  //   badge: 20,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "workflow-maintenance-mt",
  //       label: "Workflow Maintenance MT",
  //       href: "/maintenance/mt",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "workflow-maintenance-krp",
  //       label: "Workflow Maintenance Mobil KRP",
  //       href: "/maintenance/krp",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "wheel-workshop",
  //   label: "Workshop Ban",
  //   icon: Box,
  //   badge: 20,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "wheel-workshop-mt",
  //       label: "Jadwal Pemasangan MT",
  //       href: "/wheel/mt",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "wheel-workshop-krp",
  //       label: "Jadwal Pemasangan KRP",
  //       href: "/wheel/krp",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "dispatcher",
  //   label: "Dispatcher",
  //   icon: Calendar,
  //   badge: 20,
  //   allowedRoles: ["OWNER", "ACADEMIC"],
  //   subMenu: [
  //     {
  //       id: "dispatcher-scheduling",
  //       label: "Dispatcher Scheduling",
  //       href: "/dispatcher/scheduling",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "dispatcher-change-unit-form",
  //       label: "Form Unit Ganti Sewa",
  //       href: "/dispatcher/change-unit-form",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //     {
  //       id: "dispatcher-vehicle-inspection",
  //       label: "Inspection Kendaraan",
  //       href: "/dispatcher/vehicle-inspection",
  //       allowedRoles: ["OWNER", "ACADEMIC"],
  //     },
  //   ],
  // },
  // {
  //   id: "reports-analytics",
  //   label: "Reports & Analytics",
  //   href: "/reports-analytics",
  //   icon: BarChart3,
  //   allowedRoles: ["OWNER", "ACADEMIC", "HR"],
  // },
  // {
  //   id: "system-settings",
  //   label: "System Settings",
  //   href: "/system-settings",
  //   icon: Settings,
  //   allowedRoles: ["OWNER", "ACADEMIC", "HR"],
  // },
];
