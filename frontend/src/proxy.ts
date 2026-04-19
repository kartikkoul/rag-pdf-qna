import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const base_path = "/api/v1";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const isProtectedPage =
    req.nextUrl.pathname === `${base_path}/upload` || req.nextUrl.pathname ===  `${base_path}/query`;

  // 🚫 Not logged in → block protected routes
  if (!token && isProtectedPage) {
    return NextResponse.json({"message": "Not authorised. Please log in again.", "type": "auth_error"}, {status:401});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/:path"]
};