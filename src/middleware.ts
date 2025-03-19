import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const secret = process.env.SECRET;
  const token = await getToken({ req, secret });

  if (token && (req.nextUrl.pathname == "/login" || req.nextUrl.pathname == "/signin" || req.nextUrl.pathname == "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // If no token is present and not already on /login, redirect to /login.
  if (!token && (req.nextUrl.pathname !== "/login" || req.nextUrl.pathname !== "/signin" || req.nextUrl.pathname !== "/signup")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // routes that middleware applies to, exclude api, static, raw files, etc.
  matcher: "/((?!api|static|.*\\..*|_next|.*\\/raw).*)",
};
