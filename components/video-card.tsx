'use client'

import type { Video } from '@/lib/db'
import { Star, Eye, Clock } from 'lucide-react'

interface VideoCardProps {
  video: Video
  onClick?: () => void
  isLink?: boolean
}

export function VideoCard({ video, onClick, isLink }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}`
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
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
    <div
      onClick={onClick}
      className="group cursor-pointer space-y-3"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-md overflow-hidden border border-border bg-secondary transition-all group-hover:border-foreground/20">
        <img
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-background/90 text-[10px] font-bold px-1.5 py-0.5 rounded border border-border">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {video.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{new Date(video.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
