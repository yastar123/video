import { query } from '@/lib/postgres'

export async function GET() {
  try {
    // Fetch all videos
    const videosResult = await query(`
      SELECT v.id, v.title, v.slug, v.created_at, v.updated_at,
             c.name as category, c.slug as category_slug
      FROM videos v
      LEFT JOIN video_categories vc ON v.id = vc.video_id
      LEFT JOIN categories c ON vc.category_id = c.id
      ORDER BY v.created_at DESC
    `)

    // Fetch all categories
    const categoriesResult = await query(`
      SELECT id, name, slug, created_at, updated_at
      FROM categories
      ORDER BY name
    `)

    const baseUrl = 'https://bokepindonesia.my.id'
    const currentDate = new Date().toISOString()

    // Create sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`

    // Homepage
    sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

    // Categories page
    sitemap += `
  <url>
    <loc>${baseUrl}/kategori</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`

    // Category pages
    const categories = categoriesResult.rows || []
    for (const category of categories) {
      sitemap += `
  <url>
    <loc>${baseUrl}/?category=${encodeURIComponent(category.slug || category.name)}</loc>
    <lastmod>${category.updated_at || category.created_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }

    // Video pages
    const videos = videosResult.rows || []
    for (const video of videos) {
      sitemap += `
  <url>
    <loc>${baseUrl}/video/${video.id}</loc>
    <lastmod>${video.updated_at || video.created_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}${video.thumbnail || '/placeholder.svg'}</image:loc>
      <image:title>${video.title}</image:title>
      <image:caption>${video.title}</image:caption>
    </image:image>
  </url>`
    }

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Return basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bokepindonesia.my.id</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(basicSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
