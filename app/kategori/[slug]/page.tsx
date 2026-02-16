'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { VideoCard } from '@/components/video-card'
import { query } from '@/lib/postgres'
import { Pagination } from '@/components/pagination'
import { ChevronDown } from 'lucide-react'

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

export default function KategoriPage() {
  const router = useRouter()
  const params = useParams()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ totalPages: 0, total: 0 })
  const [categoryName, setCategoryName] = useState('')

  const slug = params.slug as string

  useEffect(() => {
    if (!slug) {
      router.replace('/')
      return
    }

    const fetchVideos = async () => {
      try {
        setLoading(true)
        const offset = (currentPage - 1) * 12
        
        // Fetch videos by category
        const { rows: videosData } = await query(`
          SELECT v.*, c.name as category 
          FROM videos v 
          LEFT JOIN categories c ON v.category_id = c.id 
          WHERE c.slug = $1
          ORDER BY v.created_at DESC 
          LIMIT 12 OFFSET $2
        `, [slug, offset])

        // Get total count
        const { rows: countData } = await query(`
          SELECT COUNT(*) as total 
          FROM videos v 
          LEFT JOIN categories c ON v.category_id = c.id 
          WHERE c.slug = $1
        `, [slug])

        setVideos(videosData)
        setPagination({
          totalPages: Math.ceil(countData[0]?.total / 12 || 1),
          total: countData[0]?.total || 0
        })
        
        if (videosData.length > 0) {
          setCategoryName(videosData[0].category)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        router.replace('/')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [slug, currentPage, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Kategori tidak ditemukan</h1>
          <button 
            onClick={() => router.replace('/')}
            className="text-primary hover:underline"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button 
              onClick={() => router.replace('/')}
              className="hover:text-primary transition"
            >
              Home
            </button>
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
              <div key={video.id} className="cursor-pointer" onClick={() => router.push(`/video/${video.id}`)}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
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
