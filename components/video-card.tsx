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
      className="group cursor-pointer space-y-4"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-secondary transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
        {isVisible ? (
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-secondary animate-pulse" />
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/30">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 text-white shadow-lg">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 px-1">
        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {video.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <Eye size={12} />
            {formatViews(video.views)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}
