'use client'

import { useEffect, useState } from 'react'
import { VideoCard } from '@/components/video-card'
import type { Video } from '@/lib/db'
import Link from 'next/link'
import { BannerPlaceholder } from '@/components/banner-placeholder'

export function RandomVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos?limit=20')
      .then((res) => res.json())
      .then((data) => {
        // Handle both old format and paginated format
        const videoList = data.videos || data
        // Get 8 random videos
        const shuffled = videoList.sort(() => 0.5 - Math.random()).slice(0, 8)
        setVideos(shuffled)
        setLoading(false)
      })
      .catch((error) => {
        console.error('[v0] Failed to fetch random videos:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-balance">
        More Videos to Watch
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <VideoCard video={video} />
          </Link>
        ))}
      </div>
      
      {/* Ad Placeholders */}
      <div className="mt-8 space-y-4">
        <BannerPlaceholder width="full" height="medium" text="Banner 468x60" />
        <BannerPlaceholder width="full" height="medium" text="Banner 468x60" />
        <BannerPlaceholder width="full" height="medium" text="Banner 468x60" />
      </div>
    </div>
  )
}
