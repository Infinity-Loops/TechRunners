import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Next.js 16 "proxy" (formerly middleware). Runs on the Node.js runtime.
 *
 * Gates every /admin route behind the signed session cookie. The login page and
 * the login/logout API routes are intentionally left reachable.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page must stay open so users can authenticate.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
