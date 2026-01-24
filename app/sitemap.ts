import { query } from '@/lib/postgres'

export async function generateSitemap() {
  const baseUrl = 'https://ruangmalam.com'

  try {
    // Get all videos
    const { rows: videos } = await query('SELECT id, updated_at FROM videos')
    const videoUrls = videos.map((v: any) => ({
      url: `${baseUrl}/video/${v.id}`,
      lastModified: v.updated_at,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Get all categories
    const { rows: categories } = await query('SELECT id, name FROM categories')
    const categoryUrls = categories.map((c: any) => ({
      url: `${baseUrl}/kategori/${c.name.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/kategori`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...categoryUrls,
      ...videoUrls,
    ]
  } catch (error) {
    console.warn('Database not available during build, returning basic sitemap')
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/kategori`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }
}

export default async function sitemap() {
  return generateSitemap()
}
