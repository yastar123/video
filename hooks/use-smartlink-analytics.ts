"use client"

import { useCallback } from 'react'

interface SmartlinkAnalytics {
  linkId: string
  url: string
  timestamp: number
  userAgent?: string
  referrer?: string
}

export function useSmartlinkAnalytics() {
  const trackClick = useCallback((linkId: string, url: string) => {
    // Simpan analytics ke localStorage atau kirim ke server
    const analytics: SmartlinkAnalytics = {
      linkId,
      url,
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined
    }

    // Simpan ke localStorage untuk tracking sederhana
    if (typeof window !== 'undefined') {
      const existingData = localStorage.getItem('smartlink_analytics')
      const analyticsArray = existingData ? JSON.parse(existingData) : []
      analyticsArray.push(analytics)
      
      // Hanya simpan 100 data terakhir untuk menghemat space
      if (analyticsArray.length > 100) {
        analyticsArray.splice(0, analyticsArray.length - 100)
      }
      
      localStorage.setItem('smartlink_analytics', JSON.stringify(analyticsArray))
    }

    // Log untuk debugging
    console.log('Smartlink clicked:', analytics)
    
    // Bisa juga kirim ke server untuk tracking lebih advanced
    // fetch('/api/analytics/smartlink', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(analytics)
    // })
  }, [])

  const getAnalytics = useCallback((): SmartlinkAnalytics[] => {
    if (typeof window === 'undefined') return []
    
    const data = localStorage.getItem('smartlink_analytics')
    return data ? JSON.parse(data) : []
  }, [])

  const clearAnalytics = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smartlink_analytics')
    }
  }, [])

  const getClickStats = useCallback(() => {
    const analytics = getAnalytics()
    const stats: Record<string, number> = {}
    
    analytics.forEach(item => {
      stats[item.linkId] = (stats[item.linkId] || 0) + 1
    })
    
    return stats
  }, [getAnalytics])

  return {
    trackClick,
    getAnalytics,
    clearAnalytics,
    getClickStats
  }
}
