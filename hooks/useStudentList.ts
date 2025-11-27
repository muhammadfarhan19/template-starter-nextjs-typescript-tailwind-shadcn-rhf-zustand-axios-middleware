"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import studentInstance, {
  StudentQueryParams,
} from "@/instances/student.instance";
import { StudentListItem } from "@/types/student.type";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/common";

export function useStudentList(params?: StudentQueryParams) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || undefined;

  const mergedParams = {
    ...params,
    search: q,
  };

  return useQuery<ApiSuccessResponse<StudentListItem[]>>({
    queryKey: ["students", mergedParams],
    queryFn: async () => {
      const result = await studentInstance.getAll(mergedParams);

      if (!result.success) {
        const err = result as ApiErrorResponse;
        throw new Error(err.error || "Gagal mengambil data siswa");
      }

      return {
        data: result.data as StudentListItem[],
        total: result.total || 0,
        page: result.page || 1,
        limit: result.limit || 10,
      };
    },
    // refetch otomatis saat query string berubah
    enabled: true,
  });
}
