"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface DelayConfig {
  enabled: boolean
  popunderScript: string
  maxPerHour: number
  maxPerSession: number
  fallbackMode: 'delay' | 'immediate' | 'hybrid'
  mobileOptimized: boolean
}

interface DelayPopunderProps {
  config?: Partial<DelayConfig>
  className?: string
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

export function DelayPopunder({ 
  config = {}, 
  className = "" 
}: DelayPopunderProps) {
  const [sessionCount, setSessionCount] = useState(0)
  const [hourlyCount, setHourlyCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const { trackClick } = useSmartlinkAnalytics()
  
  const configRef = useRef<DelayConfig>({
    enabled: true,
    popunderScript: POPUNDER_SCRIPT,
    maxPerHour: 80,
    maxPerSession: 150,
    fallbackMode: 'hybrid',
    mobileOptimized: true,
    ...config
  })

  // Load session data
  useEffect(() => {
    const stored = localStorage.getItem('delay_popunder_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setSessionCount(data.sessionCount || 0)
        setHourlyCount(data.hourlyCount || 0)
        setLastTriggered(data.lastTriggered || null)
      } catch (e) {
        console.warn('Failed to parse session data')
      }
    }
  }, [])

  // Save session data
  const saveSessionData = useCallback(() => {
    const data = {
      sessionCount,
      hourlyCount,
      lastTriggered,
      lastHourReset: Date.now()
    }
    localStorage.setItem('delay_popunder_data', JSON.stringify(data))
  }, [sessionCount, hourlyCount, lastTriggered])

  // Load popunder script
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const script = document.createElement('script')
    script.src = configRef.current.popunderScript
    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'
    
    script.onload = () => {
      setIsScriptLoaded(true)
      console.log('Delay popunder script loaded')
    }
    
    script.onerror = () => {
      console.error('Failed to load popunder script, trying fallback')
      if (configRef.current.fallbackMode !== 'delay') {
        setIsScriptLoaded(true) // Enable immediate fallback
      }
    }
    
    document.head.appendChild(script)
  }, [configRef.current.enabled, isScriptLoaded])

  // Check if can trigger
  const canTrigger = useCallback(() => {
    if (!configRef.current.enabled) return false
    if (sessionCount >= configRef.current.maxPerSession) return false
    if (hourlyCount >= configRef.current.maxPerHour) return false
    
    const now = Date.now()
    if (lastTriggered && now - lastTriggered < 2000) return false // 2 second cooldown
    
    return true
  }, [sessionCount, hourlyCount, lastTriggered])

  // Execute popunder
  const executePopunder = useCallback(() => {
    const now = Date.now()
    const newSessionCount = sessionCount + 1
    const newHourlyCount = hourlyCount + 1
    
    setSessionCount(newSessionCount)
    setHourlyCount(newHourlyCount)
    setLastTriggered(now)
    
    saveSessionData()
    
    // Track analytics
    trackClick('delay_popunder', configRef.current.popunderScript)
    
    // Multiple trigger techniques
    const techniques = [
      () => {
        // Technique 1: Standard window.open
        const popunder = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999,scrollbars=no,toolbar=no,location=no,status=no,menubar=no')
        if (popunder) {
          popunder.document.write(`
            <html>
              <head><script>window.location.href="${configRef.current.popunderScript}";</script></head>
              <body></body>
            </html>
          `)
          popunder.blur()
          window.focus()
          return true
        }
        return false
      },
      () => {
        // Technique 2: Form submission
        try {
          const form = document.createElement('form')
          form.method = 'GET'
          form.action = configRef.current.popunderScript
          form.target = '_blank'
          form.style.display = 'none'
          document.body.appendChild(form)
          form.submit()
          document.body.removeChild(form)
          return true
        } catch (e) {
          return false
        }
      },
      () => {
        // Technique 3: Link simulation
        try {
          const link = document.createElement('a')
          link.href = configRef.current.popunderScript
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          return true
        } catch (e) {
          return false
        }
      }
    ]
    
    // Try techniques until one succeeds
    for (const technique of techniques) {
      if (technique()) {
        console.log('Popunder executed successfully')
        return true
      }
    }
    
    console.warn('All popunder techniques failed')
    return false
  }, [sessionCount, hourlyCount, lastTriggered, saveSessionData, trackClick])

  // Trigger popunder with delay
  const triggerDelayedPopunder = useCallback((delay: number = 0) => {
    if (!canTrigger()) return false
    
    if (delay > 0) {
      setTimeout(() => {
        executePopunder()
      }, delay * 1000)
      return true
    } else {
      return executePopunder()
    }
  }, [canTrigger, executePopunder])

  // Event handlers
  useEffect(() => {
    if (!configRef.current.enabled) return

    const handleTrigger = () => {
      triggerDelayedPopunder(2) // 2 second delay
    }

    // High-priority events
    const events = [
      { event: 'click', handler: handleTrigger },
      { event: 'dblclick', handler: handleTrigger },
      { event: 'contextmenu', handler: (e: MouseEvent) => { e.preventDefault(); handleTrigger() } },
      { event: 'touchstart', handler: handleTrigger },
      { event: 'touchend', handler: handleTrigger },
      { event: 'scroll', handler: () => { 
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        if (scrollPercent > 25) handleTrigger() 
      }},
      { event: 'wheel', handler: handleTrigger },
      { event: 'focus', handler: handleTrigger },
      { event: 'blur', handler: handleTrigger },
      { event: 'play', handler: handleTrigger },
      { event: 'ended', handler: handleTrigger },
      { event: 'beforeunload', handler: handleTrigger },
      { event: 'pagehide', handler: handleTrigger }
    ]

    events.forEach(({ event, handler }) => {
      const element = ['beforeunload', 'pagehide', 'focus', 'blur'].includes(event) ? window : document
      element.addEventListener(event, handler as EventListener, { passive: true })
    })

    return () => {
      events.forEach(({ event, handler }) => {
        const element = ['beforeunload', 'pagehide', 'focus', 'blur'].includes(event) ? window : document
        element.removeEventListener(event, handler as EventListener)
      })
    }
  }, [canTrigger, triggerDelayedPopunder])

  // Debug panel
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-md z-50 ${className}`}>
      <h4 className="font-bold mb-2 text-orange-400">Delay Popunder Manager</h4>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>Session: {sessionCount}/{configRef.current.maxPerSession}</p>
        <p>Hourly: {hourlyCount}/{configRef.current.maxPerHour}</p>
        {lastTriggered && (
          <p>Last Trigger: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => triggerDelayedPopunder(0)}
          className="bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs"
        >
          Immediate Trigger
        </button>
        <button
          onClick={() => triggerDelayedPopunder(5)}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          5s Delay
        </button>
        <button
          onClick={() => {
            setSessionCount(0)
            setHourlyCount(0)
            setLastTriggered(null)
            localStorage.removeItem('delay_popunder_data')
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
