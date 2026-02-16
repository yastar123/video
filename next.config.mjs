/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'video.seyiki.com',
      },
      {
        protocol: 'http',
        hostname: 'video.seyiki.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['https://63bdad56-18db-495f-b370-abff3119540f-00-39pflaohfh1vf.worf.replit.dev', 'http://63bdad56-18db-495f-b370-abff3119540f-00-39pflaohfh1vf.worf.replit.dev', 'https://*.replit.dev'],
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
