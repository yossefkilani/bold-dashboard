import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {

    const auth = request.headers.get("authorization");

    const username = process.env.DASH_USER;
    const password = process.env.DASH_PASS;

    const valid =
      auth ===
      "Basic " +
        Buffer.from(`${username}:${password}`).toString("base64");

    if (!valid) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm=\"Dashboard\"",
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};