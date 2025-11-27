"use client";

import { create } from "zustand";

export type UserType = {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
} | null;

type AuthState = {
  user: UserType;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
