'use client'

import { useEffect, useRef } from 'react'
import { PopunderStorage } from '@/lib/popunder-storage'

interface AggressivePopunderProps {
  enabled?: boolean
  delay?: number
  cooldown?: number // seconds between triggers
}

export function AggressivePopunder({ 
  enabled = true, 
  delay = 1000, 
  cooldown = 5 // 5 seconds cooldown
}: AggressivePopunderProps) {
  const scriptLoadedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Load and execute popunder script
    const loadPopunder = () => {
      if (scriptLoadedRef.current) return

      try {
        // Create script element
        const script = document.createElement('script')
        script.src = 'https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js'
        script.async = true
        script.setAttribute('data-cfasync', 'false')
        
        // Add error handling
        script.onerror = (error) => {
          console.error('Aggressive popunder script failed to load:', error)
        }
        
        script.onload = () => {
          scriptLoadedRef.current = true
          console.log('Aggressive popunder loaded successfully')
        }
        
        // Inject script
        document.head.appendChild(script)
        
      } catch (error) {
        console.error('Error loading aggressive popunder:', error)
      }
    }

    // Trigger popunder
    const triggerPopunder = () => {
      if (!PopunderStorage.isCooldownPassed(cooldown)) {
        const timeUntilNext = PopunderStorage.getTimeUntilNextTrigger(cooldown)
        console.log(`Popunder cooldown active. Next trigger in ${timeUntilNext.toFixed(1)}s`)
        return
      }
      
      try {
        if (typeof window !== 'undefined' && (window as any).adsterra_popunder) {
          (window as any).adsterra_popunder()
          PopunderStorage.setLastTrigger()
          console.log('Popunder triggered successfully')
        }
      } catch (error) {
        console.error('Error triggering popunder:', error)
      }
    }

    // Load script immediately
    loadPopunder()

    // Add global click handler for every click
    const handleGlobalClick = (e: Event) => {
      e.stopPropagation()
      triggerPopunder()
    }

    // Add multiple event listeners for maximum coverage
    const events = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend']
    
    events.forEach(event => {
      document.addEventListener(event, handleGlobalClick as EventListener, true)
    })

    // Also trigger on page load after delay
    const pageLoadTimer = setTimeout(() => {
      triggerPopunder()
    }, delay)

    // Trigger on scroll
    const handleScroll = () => {
      triggerPopunder()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Trigger on keyboard interaction
    const handleKeydown = () => {
      triggerPopunder()
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      clearTimeout(pageLoadTimer)
      events.forEach(event => {
        document.removeEventListener(event, handleGlobalClick as EventListener, true)
      })
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [enabled, delay, cooldown])

  return null
}
