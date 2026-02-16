"use client"

import { useEffect, useState, useRef } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface PopunderConfig {
  enabled: boolean
  frequency: number // dalam menit
  maxPerSession: number
  delay: number // dalam detik
  triggerOn: 'click' | 'scroll' | 'exit' | 'timer' | 'multiple'
}

interface PopunderManagerProps {
  config?: Partial<PopunderConfig>
  className?: string
}

const DEFAULT_CONFIG: PopunderConfig = {
  enabled: true,
  frequency: 5, // 5 menit
  maxPerSession: 10, // maksimal 10 popunder per session
  delay: 3, // 3 detik delay
  triggerOn: 'multiple' // multiple trigger
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

export function PopunderManager({ 
  config = {}, 
  className = "" 
}: PopunderManagerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const { trackClick } = useSmartlinkAnalytics()
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const configRef = useRef<PopunderConfig>({ ...DEFAULT_CONFIG, ...config })

  // Load popunder script
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const script = document.createElement('script')
    script.src = POPUNDER_SCRIPT
    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'
    
    script.onload = () => {
      setIsScriptLoaded(true)
      console.log('Popunder script loaded successfully')
    }
    
    script.onerror = () => {
      console.error('Failed to load popunder script')
    }
    
    document.head.appendChild(script)
    scriptRef.current = script

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [isScriptLoaded])

  // Load session data dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem('popunder_session_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setSessionCount(data.count || 0)
        setLastTriggered(data.lastTriggered || null)
      } catch (e) {
        console.warn('Failed to parse popunder session data')
      }
    }
  }, [])

  // Save session data ke localStorage
  const saveSessionData = (count: number, lastTime: number | null) => {
    const data = {
      count,
      lastTriggered: lastTime,
      sessionStart: Date.now()
    }
    localStorage.setItem('popunder_session_data', JSON.stringify(data))
  }

  // Check apakah popunder bisa di-trigger
  const canTrigger = (): boolean => {
    if (!isScriptLoaded || !configRef.current.enabled) return false
    
    // Check max per session
    if (sessionCount >= configRef.current.maxPerSession) return false
    
    // Check frequency
    if (lastTriggered) {
      const timeSinceLast = Date.now() - lastTriggered
      const minInterval = configRef.current.frequency * 60 * 1000 // convert to ms
      if (timeSinceLast < minInterval) return false
    }
    
    return true
  }

  // Trigger popunder
  const triggerPopunder = () => {
    if (!canTrigger()) return

    const newCount = sessionCount + 1
    const now = Date.now()
    
    setSessionCount(newCount)
    setLastTriggered(now)
    saveSessionData(newCount, now)
    
    // Track analytics
    trackClick('popunder_trigger', POPUNDER_SCRIPT)
    
    // Trigger popunder (script akan otomatis handle)
    console.log(`Popunder triggered (${newCount}/${configRef.current.maxPerSession})`)
    
    // Custom trigger jika diperlukan
    if (window.open && !window.open('', '_blank')) {
      // Fallback jika popunder diblokir
      console.log('Popunder blocked, showing fallback')
    }
  }

  // Event handlers untuk berbagai trigger
  useEffect(() => {
    if (!isScriptLoaded) return

    const config = configRef.current
    let clickCount = 0
    let scrollPercentage = 0
    let timerTriggered = false

    // Click trigger
    const handleClick = (e: MouseEvent) => {
      if (config.triggerOn === 'click' || config.triggerOn === 'multiple') {
        clickCount++
        if (clickCount % 2 === 0) { // Setiap 2 klik
          setTimeout(() => triggerPopunder(), config.delay * 1000)
        }
      }
    }

    // Scroll trigger
    const handleScroll = () => {
      if (config.triggerOn === 'scroll' || config.triggerOn === 'multiple') {
        const winHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100
        
        if (scrollPercent > 50 && scrollPercentage <= 50) {
          setTimeout(() => triggerPopunder(), config.delay * 1000)
        }
        scrollPercentage = scrollPercent
      }
    }

    // Exit intent trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (config.triggerOn === 'exit' || config.triggerOn === 'multiple') {
        if (e.clientY <= 0) {
          setTimeout(() => triggerPopunder(), config.delay * 1000)
        }
      }
    }

    // Timer trigger
    const handleTimer = () => {
      if ((config.triggerOn === 'timer' || config.triggerOn === 'multiple') && !timerTriggered) {
        setTimeout(() => {
          triggerPopunder()
          timerTriggered = true
        }, 30000) // 30 detik setelah load
      }
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    
    if (config.triggerOn === 'timer' || config.triggerOn === 'multiple') {
      handleTimer()
    }

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isScriptLoaded, sessionCount, lastTriggered, triggerPopunder, trackClick])

  // Debug panel (hanya di development)
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null // Component tidak visible di production
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50 ${className}`}>
      <h4 className="font-bold mb-2">Popunder Manager Debug</h4>
      <div className="space-y-1">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>Session Count: {sessionCount}/{configRef.current.maxPerSession}</p>
        <p>Can Trigger: {canTrigger() ? '✅' : '❌'}</p>
        <p>Frequency: {configRef.current.frequency} menit</p>
        <p>Trigger Mode: {configRef.current.triggerOn}</p>
        {lastTriggered && (
          <p>Last Triggered: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      <button
        onClick={() => triggerPopunder()}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
      >
        Test Trigger
      </button>
      <button
        onClick={() => {
          setSessionCount(0)
          setLastTriggered(null)
          localStorage.removeItem('popunder_session_data')
        }}
        className="mt-2 ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
      >
        Reset
      </button>
    </div>
  )
}

// Hook untuk mengontrol popunder secara manual
export function usePopunderControl() {
  const triggerManual = () => {
    // Manual trigger untuk special cases
    const event = new MouseEvent('click', { bubbles: true })
    document.dispatchEvent(event)
  }

  const resetSession = () => {
    localStorage.removeItem('popunder_session_data')
    window.location.reload()
  }

  const getStats = () => {
    const stored = localStorage.getItem('popunder_session_data')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return null
      }
    }
    return null
  }

  return {
    triggerManual,
    resetSession,
    getStats
  }
}
