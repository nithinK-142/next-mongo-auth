import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/register";
  const token = request.cookies.get("token")?.value || "";
  const verifyToken = request.nextUrl.searchParams.get("verifyToken") || "";

  // Allow access ONLY for unauthenticated users (no token)
  // if (path === "/reset-password/generate-token" && !token) {
  //   return NextResponse.next();
  // }

  // // Allow access ONLY for unauthenticated users (no token) and if they have a verifyToken
  // if (path === "/reset-password/verify-token" && !token && verifyToken) {
  //   return NextResponse.next();
  // }

  // // Deny access for all users
  // if (path === "/reset-password") {
  //   return NextResponse.redirect(new URL("/", request.nextUrl));
  // }

  // // If isPublicPath and user is authenticated (has a token), redirect to root (/)
  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL("/", request.nextUrl));
  // }

  // // If isPublicPath and user is unauthenticated (no token), redirect to login (/login)
  // if (!isPublicPath && !token &&
  //   path !== "/reset-password/generate-token" &&
  //   path !== "/reset-password/verify-token"
  // ) {
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }

  // If none of the above, allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/reset-password/generate-token",
    "/reset-password/verify-token",
  ],
};
