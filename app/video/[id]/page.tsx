import { query } from '@/lib/postgres'
import { Star, Eye, Clock, ArrowLeft } from 'lucide-react'
import { RandomVideos } from '@/components/random-videos'
import { VideoPlayerWrapper } from '@/components/video-player-wrapper'
import { BannerPlaceholder } from '@/components/banner-placeholder'
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
          {/* H1 + Primary Keywords */}
          <header className="mb-3 sm:mb-5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-balance leading-tight text-center">
              Nonton <span className="text-primary">{video.title}</span> 
            </h1>
          </header>

          {/* Video Player - Above the fold */}
          <section className="mb-5 sm:mb-8">
            <div className="relative w-full aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden border sm:border border-border/50 shadow-2xl">
              <VideoPlayerWrapper url={video.url} thumbnail={video.thumbnail} />
              {/* Duration badge */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 text-white px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium z-10">
                <Clock size={9} className="inline mr-1 sm:size-2.5" />
                {formatDuration(video.duration || 0)}
              </div>
            </div>
          </section>

          {/* Video Stats */}
          <section className="mb-6 sm:mb-8">
            <div className="bg-muted/20 p-3 sm:p-5 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-primary/10 p-1.5 rounded">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-primary leading-none">{formatViews(video.views)}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Tayangan</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border border-primary/10">
                  #{video.category?.replace(/\s+/g, '').toLowerCase()}
                </span>
                <span className="bg-accent/5 text-accent px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border border-accent/10">
                  HD Quality
                </span>
                <span className="bg-destructive/5 text-destructive px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border border-destructive/10">
                  Gratis
                </span>
              </div>

              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                Diunggah pada{' '}
                <time dateTime={video.created_at}>
                  {new Date(video.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
            </div>
          </section>

          {/* Content Expansion - Secondary Keywords */}
          <section className="mb-8 sm:mb-10">
            <div className="prose prose-headings:text-base sm:prose-headings:text-lg prose-headings:font-bold prose-p:text-[13px] sm:prose-p:text-sm max-w-none">
              <h2 className="text-lg sm:text-xl font-bold mb-2">Video Description {video.title}</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">
                Enjoy streaming <strong>{video.title}</strong> video{' '}
                <strong>{video.category}</strong> with HD quality. 
              </p>
            </div>
          </section>

          <section className="relative">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5">Related Videos</h2>
            <RandomVideos />
          </section>
        </div>
      </main>
    </>
  )
}