'use client'

import { useEffect, useState } from 'react'

interface UseViewTrackerProps {
  videoId: string
  incrementOnMount?: boolean
  autoIncrement?: boolean
  incrementDelay?: number
}

export function useViewTracker({ 
  videoId, 
  incrementOnMount = true,
  autoIncrement = true,
  incrementDelay = 5000 // 5 detik setelah video dimulai
}: UseViewTrackerProps) {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hasIncremented, setHasIncremented] = useState<boolean>(false)
  const [isTracking, setIsTracking] = useState<boolean>(false)

  // Get current view count
  const getViewCount = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/videos/${videoId}/views`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch view count')
      }
      
      const data = await response.json()
      setViews(data.views || 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching view count:', err)
    } finally {
      setLoading(false)
    }
  }

  // Increment view count
  const incrementView = async () => {
    if (hasIncremented || isTracking) return

    try {
      setIsTracking(true)
      const response = await fetch(`/api/videos/${videoId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to increment view count')
      }
      
      const data = await response.json()
      setViews(data.views || 0)
      setHasIncremented(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error incrementing view count:', err)
    } finally {
      setIsTracking(false)
    }
  }

  // Auto increment after delay (untuk video player)
  const startAutoIncrement = () => {
    if (!autoIncrement || hasIncremented) return

    const timer = setTimeout(() => {
      incrementView()
    }, incrementDelay)

    return () => clearTimeout(timer)
  }

  // Get initial view count
  useEffect(() => {
    if (videoId) {
      getViewCount()
    }
  }, [videoId])

  // Increment on mount (if enabled)
  useEffect(() => {
    if (incrementOnMount && videoId && !hasIncremented) {
      // Delay sedikit untuk menghindari double count
      const timer = setTimeout(() => {
        incrementView()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [videoId, incrementOnMount, hasIncremented])

  return {
    views,
    loading,
    error,
    hasIncremented,
    isTracking,
    incrementView,
    getViewCount,
    startAutoIncrement,
    refetch: getViewCount
  }
}
