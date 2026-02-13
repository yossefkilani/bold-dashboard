import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm='Secure Area'",
        },
      });
    }

    const encoded = auth.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");

    if (
      user !== process.env.DASHBOARD_USER ||
      pass !== process.env.DASHBOARD_PASS
    ) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm='Secure Area'",
        },
      });
    }
  }

  return NextResponse.next();
}