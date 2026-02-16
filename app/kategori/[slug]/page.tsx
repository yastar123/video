import { query } from '@/lib/postgres'
import { VideoCard } from '@/components/video-card'
import { Pagination } from '@/components/pagination'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: number
  created_at: string
  category: string
  description: string
  rating: number
  url: string
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function getVideosByCategory(slug: string, page: number = 1) {
  const limit = 12
  const offset = (page - 1) * limit
  
  try {
    // Fetch videos by category
    const { rows: videosData } = await query(`
      SELECT v.*, c.name as category 
      FROM videos v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE c.slug = $1
      ORDER BY v.created_at DESC 
      LIMIT $2 OFFSET $3
    `, [slug, limit, offset])

    // Get total count
    const { rows: countData } = await query(`
      SELECT COUNT(*) as total 
      FROM videos v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE c.slug = $1
    `, [slug])

    return {
      videos: videosData as Video[],
      pagination: {
        totalPages: Math.ceil(countData[0]?.total / limit || 1),
        total: countData[0]?.total || 0,
        currentPage: page
      }
    }
  } catch (error) {
    console.error('Error fetching videos:', error)
    return {
      videos: [],
      pagination: {
        totalPages: 0,
        total: 0,
        currentPage: page
      }
    }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<{ title: string; description: string }> {
  const { slug } = await params
  
  const { videos } = await getVideosByCategory(slug)
  
  if (videos.length === 0) {
    return {
      title: 'Kategori Tidak Ditemukan',
      description: 'Kategori yang Anda cari tidak ditemukan.'
    }
  }
  
  const categoryName = videos[0].category
  const title = `${categoryName} - Nonton Video Bokep Terbaru Gratis`
  const description = `Nonton streaming video ${categoryName} kualitas HD terbaru. Koleksi video ${categoryName} terlengkap hanya di BokepIndonesia.`
  
  return {
    title,
    description
  }
}

export default async function KategoriPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  
  // Validasi slug
  if (!slug || slug === 'null' || slug === 'undefined') {
    notFound()
  }
  
  const { videos, pagination } = await getVideosByCategory(slug, currentPage)
  
  if (videos.length === 0) {
    notFound()
  }
  
  const categoryName = videos[0].category

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{categoryName}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-white capitalize">
              Kategori: {categoryName}
            </h1>
            <div className="text-sm text-muted-foreground">
              {pagination.total} video
            </div>
          </div>
        </header>

        {/* Videos Grid */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`}>
                <VideoCard video={video} />
              </Link>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </section>

        {/* Native Banner - Paling Bawah */}
        <div className="mt-12 mb-8 flex justify-center">
          <div className="w-full max-w-[728px]">
            <div 
              dangerouslySetInnerHTML={{
                __html: `
                  <script async="async" data-cfasync="false" src="https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"></script>
                  <div id="container-c08de902b7930682919199d915646b97"></div>
                `
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
