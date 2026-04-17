import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const base_path = "/v1";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const isProtectedPage =
    req.nextUrl.pathname === `${base_path}/upload` || req.nextUrl.pathname ===  `${base_path}/query`;

  // 🚫 Not logged in → block protected routes
  if (!token && isProtectedPage) {
    return NextResponse.json({"message": "Not authorised. Please log in again.", "type": "auth_error"});
  }

  return NextResponse.next();
}

export const config = {
  matcher: [`${base_path}/upload`, `${base_path}/query`],
};