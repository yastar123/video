import { query } from '@/lib/postgres'
import { Star, Eye, Clock, ArrowLeft } from 'lucide-react'
import { RandomVideos } from '@/components/random-videos'
import { VideoPlayerWrapper } from '@/components/video-player-wrapper'
import { BannerPlaceholder } from '@/components/banner-placeholder'
import AdScript from '@/components/ad-script'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateStaticParams() {
  try {
    const { rows } = await query('SELECT id FROM videos LIMIT 100') // Increased for better crawling
    return rows.map((video: any) => ({
      id: video.id.toString(),
    }))
  } catch (error) {
    console.warn('Database not available during build, skipping static generation')
    return []
  }
}

async function getVideo(id: string) {
  const { rows } = await query(`
    SELECT v.*, c.name as category, c.slug as category_slug 
    FROM videos v 
    LEFT JOIN categories c ON v.category_id = c.id 
    WHERE v.id = $1
  `, [id])
  return rows[0] || null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const video = await getVideo(id)
  
  if (!video) return {}

  const keywords = [
    'bokep', 'nonton bokep', 'video porno', 'film dewasa',
    video.category?.toLowerCase() || 'dewasa',
    'bokep indonesia', 'bokep jepang', 'bokep china',
    video.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')
  ].filter(Boolean).slice(0, 10).join(', ')

  const title = `${video.title} - Nonton Bokep Terbaru ${video.category || 'Dewasa'} Gratis`
  const description = `Nonton ${video.title} video bokep ${video.category || 'dewasa'} terbaru durasi ${formatDuration(video.duration || 0)}. Streaming bokep HD gratis Indonesia, Jepang, China dan lainnya.`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/video/${id}`
    },
    openGraph: {
      title,
      description,
      url: `https://yoursite.com/video/${id}`,
      type: 'video.movie',
      images: [video.thumbnail],
      videos: [{
        url: video.url,
        type: 'video/mp4'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [video.thumbnail]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

// Client component wrapper for views increment
function ViewsIncrement({ videoId }: { videoId: string }) {
  return null;
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

export default async function VideoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await getVideo(id)

  if (!video) {
    notFound()
  }

  return (
    <>
      <ViewsIncrement videoId={id} />
      
      <main className="min-h-screen bg-background">
        {/* Header with Breadcrumbs */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="py-4">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition">Home</Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                  <Link href={`/category/${video.category_slug}`} className="hover:text-primary transition capitalize">
                    {video.category}
                  </Link>
                </li>
                <li className="text-foreground font-medium truncate max-w-[300px] sm:max-w-none">
                  {video.title}
                </li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="w-full">
          {/* H1 + Primary Keywords */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <header className="mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-balance leading-tight text-center">
                Nonton <span className="text-primary">{video.title}</span> 
              </h1>
            </header>
          </div>

          {/* Ad Top */}
          <div className="max-w-7xl mx-auto px-4 mb-4">
             <AdScript adKey="c08de902b7930682919199d915646b97" format="js" />
          </div>

          {/* Video Player - Full Width Container */}
          <section className="w-full h-[5500px] bg-black border-y border-border/50 shadow-2xl overflow-hidden mb-6">
            <div className="max-w-7xl mx-auto">
              <div className="relative w-full aspect-video">
                <VideoPlayerWrapper url={video.url} thumbnail={video.thumbnail} />
                {/* Duration badge */}
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {/* Ad Middle */}
            <div className="mb-8">
              <AdScript adKey="4388c91d89682a21f68164b288c042f9" format="js" />
            </div>

            {/* Video Stats */}
            <section className="mb-8">
              <div className="bg-muted/30 p-5 sm:p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-primary leading-none">{formatViews(video.views)}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Tayangan</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold border border-primary/20">
                      #{video.category?.replace(/\s+/g, '').toLowerCase()}
                    </span>
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">
                      HD QUALITY
                    </span>
                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-500/20">
                      GRATIS
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <p>
                    Diunggah pada{' '}
                    <time dateTime={video.created_at} className="font-semibold text-foreground">
                      {new Date(video.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </p>
                </div>
              </div>
            </section>

            {/* Content Expansion - Secondary Keywords */}
            <section className="mb-12">
              <div className="prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
                <h2 className="text-2xl font-bold mb-4">Deskripsi Video {video.title}</h2>
                <p className="text-base leading-relaxed">
                  Nonton streaming <strong>{video.title}</strong> video{' '}
                  <strong>{video.category}</strong> kualitas HD tanpa sensor. 
                  Nikmati koleksi video terbaik di platform kami secara gratis.
                </p>
              </div>
            </section>

            {/* Ad Bottom */}
            <div className="mb-12">
              <AdScript adKey="4388c91d89682a21f68164b288c042f9" format="js" />
            </div>

            <section className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Video Terkait</h2>
                <Link href="/" className="text-primary text-sm font-semibold hover:underline">Lihat Semua</Link>
              </div>
              <RandomVideos />
            </section>
          </div>
        </div>
      </main>
    </>
  )
}