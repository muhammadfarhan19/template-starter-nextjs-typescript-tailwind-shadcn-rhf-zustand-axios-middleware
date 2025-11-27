import axiosInstance from "@/lib/axios";
import { UserType } from "@/stores/useAuthStore";
import { ApiSuccessResponse, ApiErrorResponse } from "@/types/common";

// Tipe untuk login input
export interface LoginPayload {
  username: string;
  password: string;
}

// Tipe untuk register input (opsional, bisa disesuaikan nanti)
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UserResponse {
  data: UserType;
}

// AUTH API instance
const authInstance = {
  // Login user
  async login(data: LoginPayload) {
    const response = await axiosInstance.post<
      ApiSuccessResponse<UserType> | ApiErrorResponse
    >("/auth/login", data, { withCredentials: true });

    return response.data;
  },

  // Register user
  async register(data: RegisterPayload) {
    const response = await axiosInstance.post<
      ApiSuccessResponse<UserType> | ApiErrorResponse
    >("/auth/register", data, { withCredentials: true });

    return response.data;
  },

  // Refresh token (bisa dipakai manual jika perlu)
  async refresh(refreshToken: string) {
    const response = await axiosInstance.post<{
      token: string;
      refreshToken?: string;
    }>("/auth/refresh", { refreshToken });

    return response.data;
  },

  // Logout user (hapus cookie token dari server)
  async logout() {
    const response = await axiosInstance.post<
      ApiSuccessResponse<{ message: string }> | ApiErrorResponse
    >("/auth/logout", {}, { withCredentials: true });

    return response.data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await axiosInstance.get<UserResponse>("/users/me", {
      withCredentials: true,
    });
    return res.data;
  },
};

export default authInstance;
