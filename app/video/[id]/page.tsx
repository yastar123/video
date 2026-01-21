'use client'

import { useEffect, useState } from 'react'
import { videos } from '@/lib/db'
import type { Video } from '@/lib/db'
import { Star, Eye, Clock, ArrowLeft } from 'lucide-react'
import { RandomVideos } from '@/components/random-videos'
import { AdBanner } from '@/components/ad-banner'
import Link from 'next/link'

export default function VideoDetail({ params }: { params: Promise<{ id: string }> }) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const { id } = await params
        const foundVideo = videos.find((v) => v.id === id)
        setVideo(foundVideo || null)
      } catch (error) {
        console.error('[v0] Error resolving params:', error)
        setVideo(null)
      } finally {
        setLoading(false)
      }
    }
    resolveParams()
  }, [params])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
      </div>
    )
  }

  if (!video) {
    return (
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition w-fit">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Video not found</p>
        </div>
      </main>
    )
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition w-fit">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player */}
        <section className="mb-8">
          <div className="relative w-full bg-black rounded-lg overflow-hidden border border-border">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {video.url ? (
                <video 
                  src={video.url} 
                  controls 
                  className="w-full h-full"
                  poster={video.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center">
                  <div className="mb-4 text-6xl opacity-20">▶</div>
                  <p className="text-muted-foreground">Video URL not provided</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Video Info */}
        <section className="mb-12 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {video.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Eye size={16} />
                Views
              </div>
              <p className="text-2xl font-bold">{formatViews(video.views)}</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Star size={16} />
                Rating
              </div>
              <p className="text-2xl font-bold">{video.rating.toFixed(1)}/5</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock size={16} />
                Duration
              </div>
              <p className="text-2xl font-bold">{formatDuration(video.duration)}</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Category</div>
              <p className="text-2xl font-bold">{video.category}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-border pt-4 text-sm text-muted-foreground">
            <p>
              Uploaded on{' '}
              {new Date(video.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="my-8">
          <AdBanner position="bottom" />
        </section>

        {/* Random Videos Section */}
        <section>
          <RandomVideos />
        </section>

        {/* Bottom Advertisement Banner */}
        <section className="mt-8">
          <AdBanner position="bottom" />
        </section>
      </div>
    </main>
  )
}
