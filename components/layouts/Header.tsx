"use client";

import { useState } from "react";
import dayjs from "dayjs";
import {
  User,
  Wifi,
  ChevronDown,
  LogOut,
  Settings,
  Search,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const togglePopover = (key: string) => {
    setOpenPopover((prev) => (prev === key ? null : key));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left: Logo + Info */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <div>
          <h1 className="font-semibold text-gray-800 text-sm">UNI CARSINDO</h1>
          <p className="text-xs text-gray-500 -mt-0.5">
            Fleet Management Portal
          </p>
        </div>

        <div className="h-5 w-px bg-gray-300 mx-2" />

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Joni Talang Branch</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 mx-12">
        <div className="relative w-full">
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
            <Search className="size-4" />
            <span className="sr-only">User</span>
          </div>
          <Input
            id={"search-header"}
            type="text"
            placeholder="Search vehicles, routes, drivers..."
            className="peer pl-9"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Status */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Wifi className="w-4 h-4 text-green-500" />
          <span>Online</span>
          <span>• {dayjs().format("HH:mm")}</span>
        </div>

        {/* Account */}
        <Popover
          open={openPopover === "account"}
          onOpenChange={() => togglePopover("account")}
        >
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 p-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                JT
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="mb-2">
              <p className="font-medium text-gray-800">Joni Talang</p>
              <p className="text-xs text-gray-500">Fleet Manager</p>
            </div>
            <hr className="my-2" />
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                <User className="w-4 h-4" /> Profile
              </li>
              <li className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                <Settings className="w-4 h-4" /> Settings
              </li>
              <li className="flex items-center gap-2 cursor-pointer p-2 rounded text-red-600 hover:bg-gray-100">
                <LogOut className="w-4 h-4" /> Logout
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
