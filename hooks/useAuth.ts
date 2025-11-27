// hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import authInstance, { LoginPayload } from "@/instances/auth.instance";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, setUser, clearUser } = useAuthStore();

  // Login
  const login = async (data: LoginPayload) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authInstance.login(data);

      if (!result.success) {
        throw new Error(result.error || "Login gagal");
      }

      setUser(result.data);
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat login";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await authInstance.logout();

      if (!result.success) {
        throw new Error(result.error || "Logout gagal");
      }

      clearUser();
      router.push("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat logout";
      setError(message);
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
