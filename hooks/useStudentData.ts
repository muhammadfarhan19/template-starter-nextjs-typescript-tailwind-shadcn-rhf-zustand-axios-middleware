"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import studentInstance from "@/instances/student.instance";
import { StudentType } from "@/types/student.type";
import { ApiErrorResponse } from "@/types/common";

export function useStudentData() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return useQuery<StudentType>({
    queryKey: ["student-detail", id],
    queryFn: async () => {
      const result = await studentInstance.getById({ id });

      if (!result.success) {
        const err = result as ApiErrorResponse;
        throw new Error(err.error || "Gagal mengambil data siswa");
      }

      // jangan bungkus ulang, langsung return result
      return result.data as StudentType;
    },
    enabled: !!id,
  });
}
