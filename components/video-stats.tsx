'use client'

import { useState, useEffect } from 'react'
import { Eye, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'
import { query } from '@/lib/postgres'

interface ViewStats {
  totalViews: number
  todayViews: number
  weeklyViews: number
  monthlyViews: number
  topVideos: Array<{
    id: string
    title: string
    views: number
  }>
}

interface VideoStatsProps {
  videoId?: string
  showDetailed?: boolean
  className?: string
}

export function VideoStats({ videoId, showDetailed = false, className = "" }: VideoStatsProps) {
  const [stats, setStats] = useState<ViewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/stats/views')
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (showDetailed) {
      fetchStats()
    }
  }, [showDetailed])

  const formatViews = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (!showDetailed) {
    return null
  }

  if (loading) {
    return (
      <div className={`bg-muted/30 p-6 rounded-xl border border-border/50 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-500/10 border border-red-500/20 p-6 rounded-xl ${className}`}>
        <div className="flex items-center gap-2 text-red-400">
          <BarChart3 size={20} />
          <span>Statistik tidak tersedia</span>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className={`bg-muted/30 p-6 rounded-xl border border-border/50 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={20} className="text-primary" />
        <h3 className="text-lg font-bold text-foreground">Statistik Tayangan</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background/50 p-4 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-blue-400" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatViews(stats.totalViews)}
          </div>
        </div>

        <div className="bg-background/50 p-4 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-green-400" />
            <span className="text-xs text-muted-foreground">Hari Ini</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatViews(stats.todayViews)}
          </div>
        </div>

        <div className="bg-background/50 p-4 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-yellow-400" />
            <span className="text-xs text-muted-foreground">Minggu Ini</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatViews(stats.weeklyViews)}
          </div>
        </div>

        <div className="bg-background/50 p-4 rounded-lg border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-purple-400" />
            <span className="text-xs text-muted-foreground">Bulan Ini</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatViews(stats.monthlyViews)}
          </div>
        </div>
      </div>

      {stats.topVideos && stats.topVideos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Video Populer</h4>
          <div className="space-y-2">
            {stats.topVideos.slice(0, 5).map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-2 bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">#{index + 1}</span>
                  <span className="text-sm text-foreground truncate max-w-[200px]">
                    {video.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} className="text-blue-400" />
                  <span className="text-xs text-muted-foreground">
                    {formatViews(video.views)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
