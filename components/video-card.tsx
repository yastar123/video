'use client'

import type { Video } from '@/lib/db'
import { Star, Eye, Clock } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface VideoCardProps {
  video: Video
  onClick?: () => void
  isLink?: boolean
  priority?: boolean
}

export function VideoCard({ video, onClick, isLink, priority }: VideoCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

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
      ref={cardRef}
      onClick={onClick}
      className="group cursor-pointer space-y-3"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-md overflow-hidden border border-border bg-secondary transition-all group-hover:border-foreground/20">
        {isVisible ? (
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-secondary animate-pulse" />
        )}

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
