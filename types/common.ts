export type UserRole = "OWNER" | "ACADEMIC" | "FINANCE" | "HR";

/**
 * API Response types
 */
export interface ApiSuccessResponse<T> {
  success?: true;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  fields?: Record<string, string>;
  validValues?: string[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
