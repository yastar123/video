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
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.kirk.replit.dev',
    'https://*.spock.replit.dev',
    'https://*.janeway.replit.dev',
    'https://*.riker.replit.dev',
    'https://*.worf.replit.dev',
    'https://*.picard.replit.dev',
    'http://127.0.0.1',
    'http://localhost',
    'video.seyiki.com',
  ],
}

export default nextConfig
