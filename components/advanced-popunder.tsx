"use client"

import { useEffect, useState, useRef } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

type FrequencyLevel = 'low' | 'medium' | 'high' | 'maximum' | 'aggressive'

interface PopunderConfig {
  enabled: boolean
  frequencyLevel: FrequencyLevel
  customFrequency?: number // dalam menit
  maxPerSession: number
  delay: number // dalam detik
  triggerOn: 'click' | 'scroll' | 'exit' | 'timer' | 'multiple' | 'aggressive'
  bypassAdBlock: boolean
  mobileOptimized: boolean
}

interface AdvancedPopunderProps {
  config?: Partial<PopunderConfig>
  className?: string
}

const FREQUENCY_SETTINGS: Record<FrequencyLevel, { frequency: number; maxPerSession: number; delay: number }> = {
  low: { frequency: 15, maxPerSession: 5, delay: 5 },
  medium: { frequency: 10, maxPerSession: 8, delay: 4 },
  high: { frequency: 5, maxPerSession: 12, delay: 3 },
  maximum: { frequency: 2, maxPerSession: 20, delay: 2 },
  aggressive: { frequency: 1, maxPerSession: 30, delay: 1 }
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

export function AdvancedPopunder({ 
  config = {}, 
  className = "" 
}: AdvancedPopunderProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false)
  const { trackClick } = useSmartlinkAnalytics()
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const configRef = useRef<PopunderConfig>({
    enabled: true,
    frequencyLevel: 'maximum',
    maxPerSession: 20,
    delay: 2,
    triggerOn: 'aggressive',
    bypassAdBlock: true,
    mobileOptimized: true,
    ...config
  })

  // Get frequency settings
  const getFrequencySettings = () => {
    const { frequencyLevel, customFrequency } = configRef.current
    if (customFrequency) {
      return {
        frequency: customFrequency,
        maxPerSession: configRef.current.maxPerSession,
        delay: configRef.current.delay
      }
    }
    return FREQUENCY_SETTINGS[frequencyLevel]
  }

  // Detect ad blocker
  useEffect(() => {
    const detectAdBlock = () => {
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad'
      testAd.style.cssText = 'position: absolute; top: -10px; left: -10px; width: 1px; height: 1px; visibility: hidden;'
      
      document.body.appendChild(testAd)
      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0
        setIsAdBlockDetected(isBlocked)
        document.body.removeChild(testAd)
      }, 100)
    }

    detectAdBlock()
  }, [])

  // Load popunder script dengan adblock bypass
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const loadScript = () => {
      const script = document.createElement('script')
      script.src = POPUNDER_SCRIPT
      script.async = true
      script.referrerPolicy = 'no-referrer-when-downgrade'
      
      // AdBlock bypass techniques
      if (configRef.current.bypassAdBlock) {
        script.setAttribute('data-ad-client', 'ca-pub-0')
        script.setAttribute('data-ad-slot', '0')
        script.setAttribute('data-ad-format', 'auto')
        script.setAttribute('data-full-width-responsive', 'true')
      }
      
      script.onload = () => {
        setIsScriptLoaded(true)
        console.log('Advanced popunder script loaded successfully')
      }
      
      script.onerror = () => {
        console.error('Failed to load popunder script, trying fallback...')
        // Fallback method
        loadFallbackPopunder()
      }
      
      // Try multiple insertion points
      const insertionPoints = [document.head, document.body]
      let inserted = false
      
      for (const point of insertionPoints) {
        try {
          point.appendChild(script)
          scriptRef.current = script
          inserted = true
          break
        } catch (e) {
          console.warn('Failed to insert script at', point)
        }
      }
      
      if (!inserted) {
        loadFallbackPopunder()
      }
    }

    const loadFallbackPopunder = () => {
      // Fallback popunder implementation
      const fallbackScript = document.createElement('script')
      fallbackScript.innerHTML = `
        (function() {
          var url = '${POPUNDER_SCRIPT}';
          var script = document.createElement('script');
          script.src = url;
          script.async = true;
          document.body.appendChild(script);
        })();
      `
      document.head.appendChild(fallbackScript)
      setIsScriptLoaded(true)
    }

    // Delay loading untuk bypass detection
    const timer = setTimeout(loadScript, 1000)

    return () => {
      clearTimeout(timer)
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [isScriptLoaded])

  // Load session data
  useEffect(() => {
    const stored = localStorage.getItem('advanced_popunder_data')
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

  // Save session data
  const saveSessionData = (count: number, lastTime: number | null) => {
    const data = {
      count,
      lastTriggered: lastTime,
      sessionStart: Date.now(),
      frequencyLevel: configRef.current.frequencyLevel
    }
    localStorage.setItem('advanced_popunder_data', JSON.stringify(data))
  }

  // Check if can trigger
  const canTrigger = (): boolean => {
    if (!isScriptLoaded || !configRef.current.enabled) return false
    
    const settings = getFrequencySettings()
    
    // Check max per session
    if (sessionCount >= settings.maxPerSession) return false
    
    // Check frequency
    if (lastTriggered) {
      const timeSinceLast = Date.now() - lastTriggered
      const minInterval = settings.frequency * 60 * 1000
      if (timeSinceLast < minInterval) return false
    }
    
    return true
  }

  // Trigger popunder dengan advanced techniques
  const triggerPopunder = () => {
    if (!canTrigger()) return

    const settings = getFrequencySettings()
    const newCount = sessionCount + 1
    const now = Date.now()
    
    setSessionCount(newCount)
    setLastTriggered(now)
    saveSessionData(newCount, now)
    
    // Track analytics
    trackClick('advanced_popunder_trigger', POPUNDER_SCRIPT)
    
    // Advanced trigger techniques
    try {
      // Method 1: Standard window.open
      const popunder = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999')
      if (popunder) {
        popunder.document.write(`
          <script>
            window.location.href = 'https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js';
            window.blur();
            window.opener.focus();
          </script>
        `)
        popunder.blur()
        window.focus()
      }
      
      // Method 2: Event-based trigger
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
      document.body.dispatchEvent(clickEvent)
      
      // Method 3: Form submission (bypass)
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = POPUNDER_SCRIPT
      form.target = '_blank'
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
    } catch (e) {
      console.warn('Popunder trigger failed:', e)
    }
    
    console.log(`Advanced popunder triggered (${newCount}/${settings.maxPerSession}) - Level: ${configRef.current.frequencyLevel}`)
  }

  // Advanced event handlers
  useEffect(() => {
    if (!isScriptLoaded) return

    const config = configRef.current
    let clickCount = 0
    let scrollTriggered = false
    let timerTriggered = false
    let exitTriggered = false

    // Enhanced click handler
    const handleClick = (e: MouseEvent) => {
      if (config.triggerOn === 'click' || config.triggerOn === 'multiple' || config.triggerOn === 'aggressive') {
        clickCount++
        
        // Different trigger patterns based on frequency level
        const triggerPattern = {
          low: clickCount % 5 === 0,
          medium: clickCount % 3 === 0,
          high: clickCount % 2 === 0,
          maximum: clickCount % 1 === 0,
          aggressive: true // Every click
        }
        
        if (triggerPattern[config.frequencyLevel]) {
          setTimeout(() => triggerPopunder(), config.delay * 1000)
        }
      }
    }

    // Enhanced scroll handler
    const handleScroll = () => {
      if (config.triggerOn === 'scroll' || config.triggerOn === 'multiple' || config.triggerOn === 'aggressive') {
        const winHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100
        
        const triggerThreshold = {
          low: 80,
          medium: 60,
          high: 40,
          maximum: 20,
          aggressive: 10
        }
        
        if (scrollPercent > triggerThreshold[config.frequencyLevel] && !scrollTriggered) {
          setTimeout(() => triggerPopunder(), config.delay * 1000)
          scrollTriggered = true
        }
      }
    }

    // Enhanced exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (config.triggerOn === 'exit' || config.triggerOn === 'multiple' || config.triggerOn === 'aggressive') {
        if (e.clientY <= 0 && !exitTriggered) {
          setTimeout(() => triggerPopunder(), config.delay * 1000)
          exitTriggered = true
        }
      }
    }

    // Timer-based trigger
    const handleTimer = () => {
      if ((config.triggerOn === 'timer' || config.triggerOn === 'multiple' || config.triggerOn === 'aggressive') && !timerTriggered) {
        const timerDelay = {
          low: 60000, // 1 menit
          medium: 45000, // 45 detik
          high: 30000, // 30 detik
          maximum: 15000, // 15 detik
          aggressive: 5000 // 5 detik
        }
        
        setTimeout(() => {
          triggerPopunder()
          timerTriggered = true
        }, timerDelay[config.frequencyLevel])
      }
    }

    // Mobile-specific handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (config.mobileOptimized && config.triggerOn === 'aggressive') {
        setTimeout(() => triggerPopunder(), config.delay * 1000)
      }
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('touchstart', handleTouchStart)
    
    if (config.triggerOn === 'timer' || config.triggerOn === 'multiple' || config.triggerOn === 'aggressive') {
      handleTimer()
    }

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [isScriptLoaded, sessionCount, lastTriggered, triggerPopunder, trackClick])

  // Debug panel
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  const settings = getFrequencySettings()

  return (
    <div className={`fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 ${className}`}>
      <h4 className="font-bold mb-2 text-yellow-400">Advanced Popunder Manager</h4>
      <div className="space-y-1">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>AdBlock Detected: {isAdBlockDetected ? '🚫' : '✅'}</p>
        <p>Frequency Level: <span className="text-yellow-400">{configRef.current.frequencyLevel}</span></p>
        <p>Session: {sessionCount}/{settings.maxPerSession}</p>
        <p>Can Trigger: {canTrigger() ? '✅' : '❌'}</p>
        <p>Frequency: {settings.frequency} menit</p>
        <p>Delay: {settings.delay} detik</p>
        <p>Trigger: {configRef.current.triggerOn}</p>
        {lastTriggered && (
          <p>Last: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      <div className="mt-2 space-x-2">
        <button
          onClick={() => triggerPopunder()}
          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Test Trigger
        </button>
        <button
          onClick={() => {
            setSessionCount(0)
            setLastTriggered(null)
            localStorage.removeItem('advanced_popunder_data')
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// Preset configurations
export const POPUNDER_PRESETS = {
  conservative: {
    frequencyLevel: 'low' as const,
    maxPerSession: 5,
    delay: 5,
    triggerOn: 'click' as const
  },
  balanced: {
    frequencyLevel: 'medium' as const,
    maxPerSession: 8,
    delay: 3,
    triggerOn: 'multiple' as const
  },
  aggressive: {
    frequencyLevel: 'maximum' as const,
    maxPerSession: 20,
    delay: 2,
    triggerOn: 'aggressive' as const
  },
  extreme: {
    frequencyLevel: 'aggressive' as const,
    maxPerSession: 30,
    delay: 1,
    triggerOn: 'aggressive' as const
  }
}
