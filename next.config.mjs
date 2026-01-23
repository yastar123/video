/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.janeway.replit.dev',
    'http://127.0.0.1',
    'http://localhost',
  ],
}

export default nextConfig
