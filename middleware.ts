import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminCookieName,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  const isAdminPage = pathname.startsWith("/sstadmin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/sstadmin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if ((isAdminPage || isAdminApi) && !isLoginPage && !isLoginApi) {
    if (!isAdminAuthConfigured()) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Admin credentials are not configured." },
          { status: 503 },
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/sstadmin/login";
      url.searchParams.set("setup", "1");
      return NextResponse.redirect(url);
    }

    const token = request.cookies.get(getAdminCookieName())?.value;
    const valid = await verifyAdminSessionToken(token);
    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/sstadmin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/sstadmin", "/sstadmin/:path*", "/api/admin/:path*"],
};
