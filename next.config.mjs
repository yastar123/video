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
  allowedDevOrigins: ["*"],
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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pl28722862.effectivegatecpm.com https://pl28722941.effectivegatecpm.com https://pl28722946.effectivegatecpm.com https://www.highperformanceformat.com; connect-src 'self' https: http:; style-src 'self' 'unsafe-inline'; frame-src 'self' https://www.highperformanceformat.com; img-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
