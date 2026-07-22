import type { NextConfig } from "next";

const cspValue = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdnjs.cloudflare.com blob:",
  "worker-src 'self' blob: https://cdnjs.cloudflare.com",
  "child-src 'self' blob: data: https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' blob: data: https://www.google-analytics.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdnjs.cloudflare.com",
  "frame-src 'self' blob: data: https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspValue,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.29.60",
    "localhost",
    "127.0.0.1",
    "*.hostinger.com",
    "*.hostinger.in",
    "*.hostinger.app",
    "*.hostinger.site",
    "*.hostinger.es",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
