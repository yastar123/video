import { query } from '@/lib/postgres'

export async function GET() {
  try {
    // Fetch all video IDs for sitemap reference
    const videosResult = await query('SELECT id FROM videos ORDER BY created_at DESC LIMIT 1000')
    const videoIds = videosResult.rows?.map((v: any) => v.id) || []

    const baseUrl = 'https://bokepindonesia.my.id'
    
    let robots = `# Robots.txt for BokepIndonesia
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Allow important pages
Allow: /$
Allow: /kategori
Allow: /video/
Allow: /assets/
Allow: /favicon.ico

# Allow search engines to crawl video content
Allow: /*.mp4
Allow: /*.m3u8
Allow: /*.mpd

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Disallow temporary files
Disallow: /uploads/temp/
Disallow: /*.tmp
Disallow: /*.log

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional, be nice to server)
Crawl-delay: 1

# Additional rules for specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Video-specific crawlers
User-agent: Googlebot-Video
Allow: /

User-agent: Bingbot-Video
Allow: /
`

    return new Response(robots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('Robots.txt generation error:', error)
    
    // Return basic robots.txt on error
    const basicRobots = `# Basic Robots.txt for BokepIndonesia
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://bokepindonesia.my.id/sitemap.xml`

    return new Response(basicRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  }
}
