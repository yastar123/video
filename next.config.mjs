/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
  },
  allowedDevOrigins: ['*'],
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/serve?path=:path*',
      },
    ]
  },
}

export default nextConfig
