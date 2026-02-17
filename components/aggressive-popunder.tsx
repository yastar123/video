'use client'

import { useEffect, useRef } from 'react'

interface AggressivePopunderProps {
  enabled?: boolean
  delay?: number
  frequency?: number // minutes between triggers
}

export function AggressivePopunder({ 
  enabled = true, 
  delay = 2000, 
  frequency = 5 
}: AggressivePopunderProps) {
  const lastTriggerRef = useRef<number>(0)
  const scriptLoadedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Check frequency limit
    const now = Date.now()
    const timeSinceLastTrigger = (now - lastTriggerRef.current) / (1000 * 60) // minutes
    if (timeSinceLastTrigger < frequency) return

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
          lastTriggerRef.current = Date.now()
          console.log('Aggressive popunder loaded successfully')
        }
        
        // Inject script
        document.head.appendChild(script)
        
        // Trigger additional popunder events
        setTimeout(() => {
          triggerAggressiveEvents()
        }, delay)
        
      } catch (error) {
        console.error('Error loading aggressive popunder:', error)
      }
    }

    // Load after delay
    const timer = setTimeout(loadPopunder, delay)
    
    // Also trigger on user interactions
    const interactions = ['click', 'scroll', 'keydown', 'mousemove']
    const handleInteraction = () => {
      if (!scriptLoadedRef.current) {
        loadPopunder()
      }
    }
    
    interactions.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true })
    })

    return () => {
      clearTimeout(timer)
      interactions.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [enabled, delay, frequency])

  const triggerAggressiveEvents = () => {
    // Trigger additional popunder events
    try {
      // Click trigger
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(clickEvent)
      
      // Double click trigger
      setTimeout(() => {
        const doubleClickEvent = new MouseEvent('dblclick', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        document.dispatchEvent(doubleClickEvent)
      }, 500)
      
      // Touch trigger for mobile
      if ('ontouchstart' in window) {
        setTimeout(() => {
          const touchEvent = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
          })
          document.dispatchEvent(touchEvent)
        }, 1000)
      }
    } catch (error) {
      console.error('Error triggering aggressive events:', error)
    }
  }

  return null
}
