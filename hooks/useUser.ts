"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import authInstance, { UserResponse } from "@/instances/auth.instance";

export function useUser() {
  const { user, setUser, clearUser } = useUserStore();
  const router = useRouter();

  const query = useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: () => authInstance.getCurrentUser(),
    enabled: !user,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.error) {
      const err: any = query.error;
      console.error("Failed to fetch user:", err);

      if (err?.response?.status === 401) {
        clearUser();
        router.replace("/login");
      }
    }
  }, [query.error, clearUser, router]);

  return {
    user: query.data?.data || user,
    loading: query.isLoading,
    error: (query.error as any)?.message || null,
    refetch: query.refetch,
  };
}
