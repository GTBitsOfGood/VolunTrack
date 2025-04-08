import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const secret = process.env.SECRET;
  const token = await getToken({
    req,
    secret,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  // If token exists and the user is trying to access auth pages, redirect to home.
  if (
    token &&
    ["/login", "/signin", "/signup", "/create-account"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const allowedPathsForUnauthenticated = [
    "/",
    "/login",
    "/signin",
    "/signup",
    "/create-account",
  ];

  // If no token exists and the user is not on an auth page, redirect them to /login.
  if (!token && !allowedPathsForUnauthenticated.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except for api, static files, and others.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
