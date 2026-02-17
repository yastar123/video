'use client'

import { Eye, Users, TrendingUp } from 'lucide-react'
import { useViewTracker } from '@/hooks/use-view-tracker'

interface ViewCounterProps {
  videoId: string
  showIcon?: boolean
  showTrending?: boolean
  className?: string
  autoIncrement?: boolean
  incrementOnMount?: boolean
}

export function ViewCounter({ 
  videoId, 
  showIcon = true,
  showTrending = false,
  className = "",
  autoIncrement = true,
  incrementOnMount = true
}: ViewCounterProps) {
  const { views, loading, error } = useViewTracker({
    videoId,
    autoIncrement,
    incrementOnMount
  })

  const formatViews = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getViewLabel = (count: number): string => {
    if (count === 0) return 'Belum ada yang menonton'
    if (count === 1) return '1 orang menonton'
    return `${formatViews(count)} orang menonton`
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        {showIcon && <Eye size={16} />}
        <span className="text-sm">View tidak tersedia</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        {showIcon && <Eye size={16} />}
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className="relative">
          <Eye size={16} className="text-blue-400" />
          {showTrending && views > 100 && (
            <TrendingUp size={10} className="absolute -top-1 -right-1 text-green-400" />
          )}
        </div>
      )}
      <span className="text-sm text-gray-300 font-medium">
        {getViewLabel(views)}
      </span>
      {views > 0 && (
        <span className="text-xs text-gray-500">
          ({views.toLocaleString('id-ID')} views)
        </span>
      )}
    </div>
  )
}

// Compact version untuk card
export function CompactViewCounter({ 
  videoId, 
  className = "" 
}: { 
  videoId: string
  className?: string 
}) {
  const { views, loading } = useViewTracker({
    videoId,
    autoIncrement: false, // Jangan auto increment di card
    incrementOnMount: false // Jangan increment saat mount
  })

  const formatViews = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
        <Eye size={14} />
        <span className="text-xs">-</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
      <Eye size={14} />
      <span className="text-xs">
        {formatViews(views)}
      </span>
    </div>
  )
}

// Large version untuk detail page
export function DetailedViewCounter({ 
  videoId, 
  className = "" 
}: { 
  videoId: string
  className?: string 
}) {
  const { views, loading, error } = useViewTracker({
    videoId,
    autoIncrement: true,
    incrementOnMount: true
  })

  if (error) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <Users size={32} className="text-gray-500" />
        <span className="text-gray-400">View tidak tersedia</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="animate-pulse">
          <Users size={32} className="text-gray-600" />
        </div>
        <span className="text-gray-400">Loading...</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <Users size={32} className="text-blue-400" />
        {views > 1000 && (
          <TrendingUp size={16} className="absolute -top-2 -right-2 text-green-400" />
        )}
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">
          {views.toLocaleString('id-ID')}
        </div>
        <div className="text-sm text-gray-400">
          {views === 0 ? 'Belum ada yang menonton' : 
           views === 1 ? '1 orang menonton' : 
           'Orang menonton'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Total Views
        </div>
      </div>
    </div>
  )
}
