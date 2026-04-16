import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/events");
  const isAdminRoute = pathname === "/events";

  // If trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access an admin-only route without admin role
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is logged in and tries to access login/otp pages, redirect to dashboard
  if (token && (pathname === "/" || pathname.startsWith("/otp"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply only to relevant routes
export const config = {
  matcher: ["/", "/otp/:path*", "/dashboard/:path*", "/events/:path*"],
};
