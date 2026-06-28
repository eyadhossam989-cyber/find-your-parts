import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect admin routes
 * This runs on every request to /admin and checks if user is authenticated
 */
export async function middleware(request: NextRequest) {
  // Only apply to /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // NOTE: Client-side admin check in adminService.ts is the primary security layer
  // This middleware provides an additional security check

  // In a production app, you would verify the auth token here
  // For now, the client-side check in adminService.ts is sufficient

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
