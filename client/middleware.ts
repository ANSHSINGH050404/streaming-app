import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is logged in and tries to access login/otp pages, redirect to dashboard
  if (token && (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/otp"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply only to relevant routes
export const config = {
  matcher: ["/", "/otp/:path*", "/dashboard/:path*"],
};
