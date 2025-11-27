// components/header/header.tsx
"use client";

import dayjs from "dayjs";
import { Wifi } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AccountPopover } from "./AccountPopover";
import { BreadcrumbComponent } from "../BreadcrumbComponent";

export default function HeaderApp() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Info */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />

          {/* Status */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Wifi className="w-4 h-4 text-green-500" />
            <span>Online</span>
            <span>• {dayjs().format("HH:mm")}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <AccountPopover />
        </div>
      </div>

      <BreadcrumbComponent />
    </header>
  );
}
