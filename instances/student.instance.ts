import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { StudentListItem, StudentType } from "@/types/student.type";

export interface StudentQueryParams {
  status?: string;
  grade?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const studentInstance = {
  // Ambil daftar siswa
  async getAll(params?: StudentQueryParams) {
    const response = await axiosInstance.get<ApiResponse<StudentListItem[]>>(
      "/students",
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  },
  async getById({ id }: { id: string | null }) {
    const response = await axiosInstance.get<ApiResponse<StudentType>>(
      `/students/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async create(body: Partial<StudentType>) {
    const response = await axiosInstance.post<ApiResponse<StudentType>>(
      "/students",
      body,
      { withCredentials: true }
    );
    return response.data;
  },

  async update(body: Partial<StudentType>, id: string) {
    const response = await axiosInstance.patch<ApiResponse<StudentType>>(
      `/students/${id}`,
      body,
      { withCredentials: true }
    );
    return response.data;
  },
};

export default studentInstance;
