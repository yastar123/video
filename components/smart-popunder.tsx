'use client'

import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface SmartPopunderProps {
  enabled?: boolean
}

// Storage keys untuk tracking
const STORAGE_KEYS = {
  LAST_POPUNDER_TIME: 'last_popunder_time',
  PLAY_CLICK_COUNT: 'play_click_count',
  THUMBNAIL_CLICK_COUNT: 'thumbnail_click_count',
  FIRST_VISIT: 'first_visit'
}

function SmartPopunderInner({ enabled = true }: SmartPopunderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!enabled || hasTriggered.current) return

    const checkAndTriggerPopunder = () => {
      // Cek apakah sudah 12-24 jam sejak last popunder
      const lastPopunderTime = localStorage.getItem(STORAGE_KEYS.LAST_POPUNDER_TIME)
      const now = Date.now()
      const hoursSinceLastPopunder = lastPopunderTime ? 
        (now - parseInt(lastPopunderTime)) / (1000 * 60 * 60) : 24

      // Reset counter jika sudah 24 jam
      if (hoursSinceLastPopunder >= 24) {
        localStorage.setItem(STORAGE_KEYS.PLAY_CLICK_COUNT, '0')
        localStorage.setItem(STORAGE_KEYS.THUMBNAIL_CLICK_COUNT, '0')
        localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'false')
      }

      // Cek kondisi untuk trigger popunder
      const shouldTrigger = checkTriggerConditions(hoursSinceLastPopunder)
      
      if (shouldTrigger) {
        triggerPopunder()
        hasTriggered.current = true
      }
    }

    // Delay sedikit untuk memastikan page loaded
    const timer = setTimeout(checkAndTriggerPopunder, 2000)
    return () => clearTimeout(timer)
  }, [pathname, enabled])

  const checkTriggerConditions = (hoursSinceLastPopunder: number): boolean => {
    // 1. First visit user (1x per 12-24 jam)
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT) === 'true'
    if (!firstVisit && hoursSinceLastPopunder >= 12) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'true')
      return true
    }

    // 2. Klik tombol Play
    const playClickCount = parseInt(localStorage.getItem(STORAGE_KEYS.PLAY_CLICK_COUNT) || '0')
    if (playClickCount >= 1) {
      return true
    }

    // 3. Klik thumbnail video (halaman list)
    const thumbnailClickCount = parseInt(localStorage.getItem(STORAGE_KEYS.THUMBNAIL_CLICK_COUNT) || '0')
    if (thumbnailClickCount >= 1) {
      return true
    }

    return false
  }

  const triggerPopunder = () => {
    try {
      // Load popunder script
      const script = document.createElement('script')
      script.src = 'https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js'
      script.async = true
      
      // Add error handling
      script.onerror = () => {
        console.log('Popunder script failed to load')
      }
      
      script.onload = () => {
        console.log('Popunder triggered successfully')
        // Update last trigger time
        localStorage.setItem(STORAGE_KEYS.LAST_POPUNDER_TIME, Date.now().toString())
      }
      
      document.head.appendChild(script)
    } catch (error) {
      console.log('Error triggering popunder:', error)
    }
  }

  // Setup event listeners untuk tracking clicks
  useEffect(() => {
    if (!enabled) return

    const handlePlayClick = () => {
      const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.PLAY_CLICK_COUNT) || '0')
      localStorage.setItem(STORAGE_KEYS.PLAY_CLICK_COUNT, (currentCount + 1).toString())
    }

    const handleThumbnailClick = () => {
      const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.THUMBNAIL_CLICK_COUNT) || '0')
      localStorage.setItem(STORAGE_KEYS.THUMBNAIL_CLICK_COUNT, (currentCount + 1).toString())
    }

    // Track play button clicks
    const playButtons = document.querySelectorAll('[data-play-button], .play-button, .video-play, [class*="play"]')
    playButtons.forEach((button: Element) => {
      button.addEventListener('click', handlePlayClick)
    })

    // Track thumbnail clicks di halaman list
    let thumbnailElements: NodeListOf<Element> = document.querySelectorAll('')
    if (pathname === '/' || pathname.includes('/category/')) {
      thumbnailElements = document.querySelectorAll('[data-video-card], .video-card, [href*="/video/"]')
      thumbnailElements.forEach((thumb: Element) => {
        thumb.addEventListener('click', handleThumbnailClick)
      })
    }

    // Cleanup
    return () => {
      playButtons.forEach((button: Element) => {
        button.removeEventListener('click', handlePlayClick)
      })
      thumbnailElements.forEach((thumb: Element) => {
        thumb.removeEventListener('click', handleThumbnailClick)
      })
    }
  }, [pathname, enabled])

  // Component tidak render apa-apa (invisible)
  return null
}

export function SmartPopunder(props: SmartPopunderProps) {
  return (
    <Suspense fallback={null}>
      <SmartPopunderInner {...props} />
    </Suspense>
  )
}
