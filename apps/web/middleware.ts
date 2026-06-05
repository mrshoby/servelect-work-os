import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "servelect_emp_session";

const PUBLIC_PREFIXES = [
  "/login",
  "/unauthorized",
  "/api/v1/auth/login",
  "/api/v1/auth/logout",
  "/api/v1/auth/session",
  "/api/v1/health",
  "/_next",
  "/favicon.ico"
];

function isPublicPath(pathname: string) {
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|map|txt|xml)$/i.test(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const requireAuth = process.env.SERVELECT_REQUIRE_AUTH === "true";
  const { pathname, search } = request.nextUrl;

  if (!requireAuth || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
