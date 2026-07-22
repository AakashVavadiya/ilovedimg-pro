import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const forwardedHost = req.headers.get("x-forwarded-host");
  const origin = req.headers.get("origin");
  const proto = req.headers.get("x-forwarded-proto");

  // 1. Force HTTPS redirect in production environments (except for direct IP access)
  if (process.env.NODE_ENV === "production" && proto === "http") {
    const rawHostname = (forwardedHost || host).split(":")[0];
    const isIp = /^[0-9.]+$/.test(rawHostname) || rawHostname.includes(":");
    if (!isIp && rawHostname) {
      return NextResponse.redirect(`https://${rawHostname}${req.nextUrl.pathname}${req.nextUrl.search}`);
    }
  }

  // 2. CORS check & header injection for API routes
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.hostname;

      const hostHeader = (forwardedHost || host).split(":")[0];
      const nextHost = req.nextUrl.hostname;

      // Check if origin matches current host, forwarded host, localhost, or private/local IP range
      const isAllowedOrigin =
        originHost === hostHeader ||
        originHost === nextHost ||
        originHost === "localhost" ||
        originHost === "127.0.0.1" ||
        originHost.startsWith("192.168.") ||
        originHost.startsWith("10.") ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(originHost);

      if (!isAllowedOrigin) {
        return new Response("CORS blocked: Origin not allowed", { status: 403 });
      }

      // Handle preflight OPTIONS request
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      return response;
    } catch (e) {
      return new Response("Invalid origin header", { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
