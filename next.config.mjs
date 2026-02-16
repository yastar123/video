/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tambahkan ini
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/serve?path=:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.effectivegatecpm.com https://*.highperformanceformat.com https://*.adsterra.com https://*.adsterratechnology.com https://*.googlesyndication.com https://*.popads.net https://*.proads.tech https://*.m8v9n2k5.com",
              "connect-src 'self' https: http: ws: wss:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https: http: data:",
              "img-src 'self' data: https: http: blob:",
              "media-src 'self' https: http: blob: data:",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
