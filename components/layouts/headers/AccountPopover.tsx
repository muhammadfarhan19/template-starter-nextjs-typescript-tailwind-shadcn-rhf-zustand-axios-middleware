// components/header/account-popover.tsx
"use client";

import { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

export function AccountPopover() {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout, loading } = useAuth();

  const { user } = useUser();

  const handleLogoutClick = () => {
    setOpen(false); // Tutup popover
    setShowLogoutDialog(true); // Buka dialog
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {user ? getInitials(user.username) : "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <div className="mb-2">
            <p className="font-medium text-gray-800">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.role || "Guest"}</p>
            {user?.email && (
              <p className="text-xs text-gray-400 mt-1">{user.email}</p>
            )}
          </div>
          <hr className="my-2" />
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">
              <User className="w-4 h-4" /> Profile
            </li>
            <li className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </li>
            <li
              onClick={handleLogoutClick}
              className="flex items-center gap-2 cursor-pointer p-2 rounded text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun ini? Anda perlu login
              kembali untuk mengakses sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Logging out..." : "Ya, Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
