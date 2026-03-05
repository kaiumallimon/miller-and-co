import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isLogin = pathname === LOGIN_PATH;

  // No session → redirect protected routes to login
  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  // Has session → redirect login page to admin dashboard
  if (isLogin && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
