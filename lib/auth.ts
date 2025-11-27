// lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { ApiErrorResponse, UserRole } from "@/types/common";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
}

export interface AuthResult {
  error: NextResponse<ApiErrorResponse> | null;
  user: AuthUser | null;
}

/**
 * Get authenticated user from request
 * Returns user object or null if not authenticated
 */
export async function getUserFromRequest(
  request: NextRequest
): Promise<AuthUser | null> {
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      username: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  });

  return user;
}

/**
 * Require authentication and optionally check user roles
 * Returns consistent error format with { success: false, error: string }
 *
 * @param request - NextRequest object
 * @param allowedRoles - Optional array of allowed roles
 * @returns Object with error (NextResponse) and user
 *
 * @example
 * const { error, user } = await requireAuth(request);
 * if (error) return error;
 *
 * @example
 * const { error, user } = await requireAuth(request, ["OWNER", "ACADEMIC"]);
 * if (error) return error;
 */
export async function requireAuth(
  request: NextRequest,
  allowedRoles?: UserRole[]
): Promise<AuthResult> {
  const user = await getUserFromRequest(request);

  // Check if user is authenticated
  if (!user) {
    return {
      error: NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: "Unauthorized - Silakan login terlebih dahulu",
        },
        { status: 401 }
      ),
      user: null,
    };
  }

  // Check role if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return {
        error: NextResponse.json<ApiErrorResponse>(
          {
            success: false,
            error: "Forbidden - Anda tidak memiliki akses ke resource ini",
          },
          { status: 403 }
        ),
        user: null,
      };
    }
  }

  // Authentication successful
  return {
    error: null,
    user,
  };
}

/**
 * Check if user has specific permission
 * Helper function for more granular permission checks
 */
export function hasPermission(
  user: AuthUser,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user is owner
 */
export function isOwner(user: AuthUser): boolean {
  return user.role === "OWNER";
}

/**
 * Check if user is academic staff
 */
export function isAcademicStaff(user: AuthUser): boolean {
  return user.role === "ACADEMIC" || user.role === "OWNER";
}

/**
 * Check if user is finance staff
 */
export function isFinanceStaff(user: AuthUser): boolean {
  return user.role === "FINANCE" || user.role === "OWNER";
}

/**
 * Check if user is HR staff
 */
export function isHRStaff(user: AuthUser): boolean {
  return user.role === "HR" || user.role === "OWNER";
}
