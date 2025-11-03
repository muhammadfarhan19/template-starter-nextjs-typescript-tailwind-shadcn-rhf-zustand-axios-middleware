// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Konstanta untuk nama cookie token
const TOKEN_COOKIE_NAME = "auth_token";

// Define public routes (routes yang bisa diakses tanpa login)
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Define auth routes (routes yang tidak boleh diakses kalau sudah login)
const authRoutes = ["/auth/login", "/auth/register"];

// Define protected routes (routes yang butuh authentication)
const protectedRoutes = ["/", "/dashboard", "/profile", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Check if user is authenticated
  const isAuthenticated = !!token;

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });

  // Jika user sudah login dan coba akses auth routes (login/register)
  // Redirect ke dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika user belum login dan coba akses protected routes
  // Redirect ke login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    // Simpan redirect URL untuk kembali setelah login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika user belum login dan coba akses root (/)
  // Redirect ke login
  if (!isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
