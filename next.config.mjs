/** @type {import('next').NextConfig} */
const nextConfig = {
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
  allowedDevOrigins: ["https://7d8313b7-5954-4e09-877e-a98f8dfb77db-00-libtjn5fy05i.janeway.replit.dev", "https://*.replit.dev"],
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
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.effectivegatecpm.com https://*.highperformanceformat.com https://*.adsterra.com https://*.adsterratechnology.com https://*.googlesyndication.com; connect-src 'self' https: http:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.highperformanceformat.com https://*.effectivegatecpm.com; img-src 'self' data: https: http:; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
