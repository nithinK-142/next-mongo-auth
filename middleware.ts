import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const encryptedTokenId = request.cookies.get("encryptedTokenId")?.value || "";
  const verifyToken = request.nextUrl.searchParams.get("verifyToken") || "";

  // If user has token (authenticated), allow request to proceed
  if (path === "/" && token) {
    return NextResponse.next();
  }

  // If user has no token (unauthenticated), allow request to proceed
  if (path === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // If user has token (authenticated) and path is /login or /register, redirect to /
  if ((token && path === "/login") || (token && path === "/register")) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If user doesn't have encryptedTokenId and path is /reset-password, redirect to /login
  if (path === "/reset-password" && !encryptedTokenId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // If user doesn't have encryptedTokenId or verifyToken and path is /reset-password/verify-token, redirect /login
  if (
    path === "/reset-password/verify-token" &&
    (!encryptedTokenId || !verifyToken)
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

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
