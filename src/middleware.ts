import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// The app's own top-level pages. Any other single-segment address is an
// organization's sign-up link (src/pages/[nonprofitCode].jsx).
const APP_PAGES = new Set([
  "about",
  "admins",
  "bog-portal",
  "create-account",
  "custom-home",
  "embed",
  "events",
  "events-summary",
  "history",
  "home",
  "login",
  "manage-waivers",
  "members",
  "organization-settings",
  "passwordreset",
  "profile",
  "registrations",
  "shift-calendar",
  "signin",
  "signup",
  "stats",
  "timesheets",
]);

// Links people open before they have (or can use) an account. AuthProvider
// already shows these pages to signed-out visitors.
const isPublicLink = (pathname: string) => {
  if (/^\/passwordreset\/[^/]+\/?$/.test(pathname)) return true; // reset email
  if (/^\/events\/[^/]+\/day-of-check-in\/?$/.test(pathname)) return true; // QR
  if (/^\/embed\/[^/]+\/?$/.test(pathname)) return true; // org website embed
  const segment = /^\/([^/]+)\/?$/.exec(pathname)?.[1];
  return segment !== undefined && !APP_PAGES.has(segment); // org sign-up link
};

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
  if (
    !token &&
    !allowedPathsForUnauthenticated.includes(pathname) &&
    !isPublicLink(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except for api, static files, and others.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
