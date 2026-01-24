import { query } from '@/lib/postgres'
import { Star, Eye, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { RandomVideos } from '@/components/random-videos'
import { VideoPlayerWrapper } from '@/components/video-player-wrapper'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const { rows } = await query('SELECT id FROM videos LIMIT 100') // Increased for better crawling
  return rows.map((video: any) => ({
    id: video.id.toString(),
  }))
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
      video: {
        url: video.url,
        type: 'video/mp4'
      }
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
  return (
    <script dangerouslySetInnerHTML={{
      __html: `
        setTimeout(() => {
          fetch('/api/videos/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId: ${videoId} })
          }).catch(console.error);
        }, 2000);
      `
    }} />
  )
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* H1 + Primary Keywords */}
          <header className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-balance leading-tight">
              Nonton <span className="text-primary">{video.title}</span> 
            </h1>
          </header>

          {/* Video Player - Above the fold */}
          <section className="mb-6 sm:mb-10">
            <div className="relative w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden border sm:border-2 border-border/50 shadow-2xl min-h-[200px] sm:min-h-[400px] md:min-h-[500px]">
              <VideoPlayerWrapper url={video.url} thumbnail={video.thumbnail} />
              {/* Duration badge */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/80 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium z-10">
                <Clock size={10} className="inline mr-1 sm:size-3" />
                {formatDuration(video.duration || 0)}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div id="container-586a60b68a94327ff3f7f814e59c6837"></div>
            </div>
          </section>

          {/* Video Stats */}
          <section className="mb-8 sm:mb-10">
            <div className="bg-muted/30 p-4 sm:p-6 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-primary">{formatViews(video.views)}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Tayangan</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                  #{video.category?.replace(/\s+/g, '').toLowerCase()}
                </span>
                <span className="bg-accent/10 text-accent px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                  HD Quality
                </span>
                <span className="bg-destructive/10 text-destructive px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                  Gratis
                </span>
              </div>

              <p className="text-[10px] sm:text-xs text-muted-foreground">
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
          <section className="mb-10 sm:mb-12">
            <div className="prose prose-headings:text-lg sm:prose-headings:text-xl prose-headings:font-bold prose-p:text-sm sm:prose-p:text-base max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Video Description {video.title}</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
                Enjoy streaming <strong>{video.title}</strong> video{' '}
                <strong>{video.category}</strong> with HD quality. 
              </p>
            </div>
          </section>

          <section className="relative">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Videos</h2>
            <RandomVideos />
            <div className="mt-8 flex justify-center">
              <div id="container-586a60b68a94327ff3f7f814e59c6837"></div>
            </div>
          </section>
        </div>
      </main>

      {/* Sticky share widget */}
      <div className="lg:block hidden fixed right-8 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur border rounded-2xl p-4 shadow-2xl w-16">
        <div className="flex flex-col items-center gap-4">
          <button className="p-2 bg-primary/20 hover:bg-primary text-primary rounded-xl transition-all w-full">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </>
  )
}