"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface DelayConfig {
  enabled: boolean
  popunderScript: string
  delayStrategies: DelayStrategy[]
  antiDetection: AntiDetectionConfig
  triggerEvents: string[]
  maxPerHour: number
  maxPerSession: number
  fallbackMode: 'delay' | 'immediate' | 'hybrid'
  mobileOptimized: boolean
}

interface DelayStrategy {
  name: string
  enabled: boolean
  delay: number // dalam detik
  variance: number // variance dalam detik
  conditions?: string[]
  weight: number // 1-10, prioritas
  description: string
}

interface AntiDetectionConfig {
  randomDelays: boolean
  variableTiming: boolean
  userBehaviorSimulation: boolean
  stealthMode: boolean
  bypassAdBlock: boolean
  multipleInjection: boolean
  scriptObfuscation: boolean
  cookieTracking: boolean
}

interface DelayPopunderProps {
  config?: Partial<DelayConfig>
  className?: string
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

const DEFAULT_DELAY_STRATEGIES: DelayStrategy[] = [
  {
    name: 'immediate',
    enabled: true,
    delay: 0,
    variance: 0,
    weight: 2,
    description: 'Immediate trigger untuk high-intent events'
  },
  {
    name: 'short',
    enabled: true,
    delay: 2,
    variance: 1,
    weight: 4,
    description: 'Short delay 2±1 detik'
  },
  {
    name: 'medium',
    enabled: true,
    delay: 5,
    variance: 2,
    weight: 6,
    description: 'Medium delay 5±2 detik'
  },
  {
    name: 'long',
    enabled: true,
    delay: 10,
    variance: 3,
    weight: 5,
    description: 'Long delay 10±3 detik'
  },
  {
    name: 'behavioral',
    enabled: true,
    delay: 15,
    variance: 5,
    weight: 7,
    description: 'Behavioral delay 15±5 detik'
  },
  {
    name: 'random',
    enabled: true,
    delay: 20,
    variance: 10,
    weight: 3,
    description: 'Random delay 20±10 detik'
  },
  {
    name: 'session_based',
    enabled: true,
    delay: 30,
    variance: 15,
    weight: 4,
    description: 'Session-based delay 30±15 detik'
  }
]

const DEFAULT_EVENTS = [
  'click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup',
  'touchstart', 'touchend', 'touchmove', 'scroll', 'wheel',
  'focus', 'blur', 'resize', 'keydown', 'keyup',
  'play', 'pause', 'ended', 'volumechange',
  'submit', 'change', 'input', 'beforeunload', 'pagehide'
]

export function DelayPopunder({ 
  config = {}, 
  className = "" 
}: DelayPopunderProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [hourlyCount, setHourlyCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const [activeDelays, setActiveDelays] = useState<Record<string, number>>({})
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false)
  const [delayStats, setDelayStats] = useState<Record<string, number>>({})
  const { trackClick } = useSmartlinkAnalytics()
  
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const delayTimersRef = useRef<Record<string, NodeJS.Timeout>>({})
  const userBehaviorRef = useRef({
    clicks: 0,
    scrolls: 0,
    keypresses: 0,
    totalTime: 0,
    lastActivity: Date.now()
  })
  
  const configRef = useRef<DelayConfig>({
    enabled: true,
    popunderScript: POPUNDER_SCRIPT,
    delayStrategies: DEFAULT_DELAY_STRATEGIES,
    antiDetection: {
      randomDelays: true,
      variableTiming: true,
      userBehaviorSimulation: true,
      stealthMode: true,
      bypassAdBlock: true,
      multipleInjection: true,
      scriptObfuscation: true,
      cookieTracking: true
    },
    triggerEvents: DEFAULT_EVENTS,
    maxPerHour: 60,
    maxPerSession: 120,
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
        setActiveDelays(data.activeDelays || {})
        setDelayStats(data.delayStats || {})
        
        // Reset hourly count jika new hour
        const now = Date.now()
        if (now - (data.lastHourReset || 0) > 3600000) {
          setHourlyCount(0)
        }
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
      activeDelays,
      delayStats,
      lastHourReset: Date.now()
    }
    localStorage.setItem('delay_popunder_data', JSON.stringify(data))
  }, [sessionCount, hourlyCount, lastTriggered, activeDelays, delayStats])

  // Detect AdBlock
  const detectAdBlock = useCallback(() => {
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
  }, [])

  // Load popunder script dengan anti-detection
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const loadScript = () => {
      const antiDetection = configRef.current.antiDetection
      
      // Create multiple script elements for multiple injection
      const scripts: HTMLScriptElement[] = []
      
      for (let i = 0; i < (antiDetection.multipleInjection ? 3 : 1); i++) {
        const script = document.createElement('script')
        
        if (antiDetection.scriptObfuscation) {
          // Obfuscate script attributes
          script.setAttribute('data-cfasync', 'false')
          script.setAttribute('data-no-defer', '1')
          script.setAttribute('data-no-minify', '1')
          script.setAttribute('data-pagespeed-no-defer', '1')
          script.style.cssText = 'display:none;visibility:hidden;'
        }
        
        // Create script with blob URL to avoid CSP issues
        const scriptContent = i === 0 ? '' : '//'
        const blob = new Blob([scriptContent], { type: 'text/javascript' })
        const scriptUrl = URL.createObjectURL(blob)
        
        script.src = i === 0 ? configRef.current.popunderScript : scriptUrl
        script.async = true
        script.referrerPolicy = 'no-referrer-when-downgrade'
        
        // Add random delay for stealth
        if (antiDetection.stealthMode && i > 0) {
          setTimeout(() => {
            try {
              document.head.appendChild(script)
              scripts.push(script)
            } catch (e) {
              console.warn(`Script injection ${i} failed`)
            }
          }, Math.random() * 2000 + 1000) // Random 1-3 seconds
        } else {
          try {
            document.head.appendChild(script)
            scripts.push(script)
          } catch (e) {
            console.warn(`Script injection ${i} failed`)
          }
        }
      }
      
      scriptRef.current = scripts[0]
      
      // Handle load/error
      scripts[0].onload = () => {
        setIsScriptLoaded(true)
        console.log('Delay popunder script loaded with anti-detection')
      }
      
      scripts[0].onerror = () => {
        console.error('Failed to load popunder script, trying fallback')
        if (configRef.current.fallbackMode !== 'delay') {
          setIsScriptLoaded(true) // Enable immediate fallback
        }
      }
    }

    // Detect AdBlock first
    detectAdBlock()
    
    // Delayed loading untuk stealth
    const delay = configRef.current.antiDetection.stealthMode ? 
      Math.random() * 3000 + 2000 : 500 // Random 2-5 seconds or 0.5 seconds
    
    const timer = setTimeout(loadScript, delay)

    return () => {
      clearTimeout(timer)
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
      // Clear all delay timers
      Object.values(delayTimersRef.current).forEach(timer => clearTimeout(timer))
    }
  }, [isScriptLoaded, detectAdBlock])

  // Calculate delay based on strategy
  const calculateDelay = useCallback((strategy: DelayStrategy, eventName: string): number => {
    const antiDetection = configRef.current.antiDetection
    let delay = strategy.delay
    
    // Add variance
    if (antiDetection.variableTiming && strategy.variance > 0) {
      const variance = strategy.variance * 1000 // Convert to milliseconds
      delay += (Math.random() * 2 - 1) * variance / 1000
    }
    
    // Add random delays
    if (antiDetection.randomDelays) {
      delay += Math.random() * 2 // Additional 0-2 seconds
    }
    
    // User behavior simulation
    if (antiDetection.userBehaviorSimulation) {
      const behavior = userBehaviorRef.current
      const inactivityTime = Date.now() - behavior.lastActivity
      
      // Longer delay if user was inactive
      if (inactivityTime > 30000) { // 30 seconds inactive
        delay += Math.random() * 5
      }
      
      // Shorter delay if user is very active
      if (behavior.clicks > 10 || behavior.scrolls > 20) {
        delay = Math.max(0, delay - Math.random() * 3)
      }
    }
    
    // Event-specific adjustments
    const eventDelays: Record<string, number> = {
      'beforeunload': 0,
      'pagehide': 0,
      'contextmenu': Math.min(delay, 1),
      'dblclick': delay * 0.5,
      'touchstart': delay * 0.7,
      'scroll': delay * 1.2,
      'wheel': delay * 0.8
    }
    
    if (eventDelays[eventName] !== undefined) {
      delay = eventDelays[eventName]
    }
    
    return Math.max(0, delay)
  }, [])

  // Get random delay strategy
  const getDelayStrategy = useCallback((): DelayStrategy => {
    const enabledStrategies = configRef.current.delayStrategies.filter(s => s.enabled)
    if (enabledStrategies.length === 0) return DEFAULT_DELAY_STRATEGIES[2] // Default to medium
    
    // Weighted random selection
    const totalWeight = enabledStrategies.reduce((sum, strategy) => sum + strategy.weight, 0)
    let random = Math.random() * totalWeight
    
    for (const strategy of enabledStrategies) {
      random -= strategy.weight
      if (random <= 0) return strategy
    }
    
    return enabledStrategies[0]
  }, [])

  // Check if can trigger
  const canTrigger = useCallback((): boolean => {
    if (!configRef.current.enabled) return false
    
    // Check limits
    if (sessionCount >= configRef.current.maxPerSession) return false
    if (hourlyCount >= configRef.current.maxPerHour) return false
    
    return true
  }, [sessionCount, hourlyCount])

  // Trigger popunder with delay
  const triggerDelayedPopunder = useCallback((eventName: string, strategy?: DelayStrategy) => {
    if (!canTrigger()) return false
    
    const selectedStrategy = strategy || getDelayStrategy()
    const delay = calculateDelay(selectedStrategy, eventName)
    
    // Update user behavior
    userBehaviorRef.current.lastActivity = Date.now()
    
    // Track delay strategy
    setDelayStats(prev => ({
      ...prev,
      [selectedStrategy.name]: (prev[selectedStrategy.name] || 0) + 1
    }))
    
    if (delay === 0) {
      // Immediate trigger
      return executePopunder(eventName, selectedStrategy.name)
    } else {
      // Delayed trigger
      const timerId = `delay_${Date.now()}_${Math.random()}`
      
      delayTimersRef.current[timerId] = setTimeout(() => {
        executePopunder(eventName, selectedStrategy.name)
        delete delayTimersRef.current[timerId]
      }, delay * 1000)
      
      setActiveDelays(prev => ({ ...prev, [timerId]: delay }))
      
      console.log(`Popunder scheduled with ${selectedStrategy.name} strategy: ${delay.toFixed(2)}s delay`)
      return true
    }
  }, [canTrigger, getDelayStrategy, calculateDelay])

  // Execute popunder
  const executePopunder = useCallback((eventName: string, strategyName: string) => {
    if (!isScriptLoaded && configRef.current.fallbackMode === 'delay') return false
    
    const now = Date.now()
    const newSessionCount = sessionCount + 1
    const newHourlyCount = hourlyCount + 1
    
    setSessionCount(newSessionCount)
    setHourlyCount(newHourlyCount)
    setLastTriggered(now)
    
    saveSessionData()
    
    // Track analytics
    trackClick(`delay_popunder_${strategyName}`, configRef.current.popunderScript)
    
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
        console.log(`Popunder executed with ${strategyName} strategy (${eventName})`)
        return true
      }
    }
    
    console.warn(`All popunder techniques failed for ${strategyName} strategy`)
    return false
  }, [isScriptLoaded, sessionCount, hourlyCount, saveSessionData, trackClick])

  // Update user behavior
  const updateUserBehavior = useCallback((eventName: string) => {
    const behavior = userBehaviorRef.current
    
    switch (eventName) {
      case 'click':
      case 'mousedown':
      case 'mouseup':
        behavior.clicks++
        break
      case 'scroll':
      case 'wheel':
        behavior.scrolls++
        break
      case 'keydown':
      case 'keyup':
        behavior.keypresses++
        break
    }
    
    behavior.lastActivity = Date.now()
    behavior.totalTime = Date.now() - (behavior.totalTime || Date.now())
  }, [])

  // Event handlers
  useEffect(() => {
    if (!configRef.current.enabled) return

    const config = configRef.current
    const eventHandlers: Record<string, Function> = {}

    // High-priority events (immediate or short delay)
    eventHandlers.beforeunload = (e: BeforeUnloadEvent) => {
      triggerDelayedPopunder('beforeunload', DEFAULT_DELAY_STRATEGIES[0]) // immediate
    }

    eventHandlers.pagehide = (e: PageTransitionEvent) => {
      triggerDelayedPopunder('pagehide', DEFAULT_DELAY_STRATEGIES[0]) // immediate
    }

    eventHandlers.contextmenu = (e: MouseEvent) => {
      e.preventDefault()
      triggerDelayedPopunder('contextmenu', DEFAULT_DELAY_STRATEGIES[1]) // short
    }

    // Medium-priority events
    eventHandlers.click = (e: MouseEvent) => {
      updateUserBehavior('click')
      if (Math.random() < 0.3) { // 30% chance
        triggerDelayedPopunder('click')
      }
    }

    eventHandlers.dblclick = (e: MouseEvent) => {
      updateUserBehavior('click')
      triggerDelayedPopunder('dblclick', DEFAULT_DELAY_STRATEGIES[1]) // short
    }

    eventHandlers.touchstart = (e: TouchEvent) => {
      if (config.mobileOptimized) {
        updateUserBehavior('touchstart')
        triggerDelayedPopunder('touchstart')
      }
    }

    eventHandlers.touchend = (e: TouchEvent) => {
      if (config.mobileOptimized && Math.random() < 0.4) {
        triggerDelayedPopunder('touchend')
      }
    }

    // Low-priority events (longer delays)
    eventHandlers.scroll = () => {
      updateUserBehavior('scroll')
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 25 && Math.random() < 0.1) {
        triggerDelayedPopunder('scroll')
      }
    }

    eventHandlers.wheel = (e: WheelEvent) => {
      updateUserBehavior('scroll')
      if (Math.abs(e.deltaY) > 100 && Math.random() < 0.15) {
        triggerDelayedPopunder('wheel')
      }
    }

    eventHandlers.play = (e: Event) => {
      triggerDelayedPopunder('play')
    }

    eventHandlers.ended = (e: Event) => {
      triggerDelayedPopunder('ended')
    }

    eventHandlers.focus = () => {
      if (Math.random() < 0.2) {
        triggerDelayedPopunder('focus')
      }
    }

    eventHandlers.blur = () => {
      triggerDelayedPopunder('blur')
    }

    // Add event listeners
    config.triggerEvents.forEach(eventName => {
      if (eventHandlers[eventName]) {
        const element = ['beforeunload', 'pagehide', 'focus', 'blur'].includes(eventName) ? window : document
        element.addEventListener(eventName, eventHandlers[eventName] as EventListener, { passive: true })
      }
    })

    // Periodic behavior-based trigger
    const behaviorTimer = setInterval(() => {
      const behavior = userBehaviorRef.current
      const inactivityTime = Date.now() - behavior.lastActivity
      
      // Trigger based on user behavior patterns
      if (inactivityTime > 60000 && behavior.clicks > 5) { // 1 minute inactive, active user
        triggerDelayedPopunder('behavioral', DEFAULT_DELAY_STRATEGIES[4]) // behavioral
      }
    }, 30000) // Check every 30 seconds

    return () => {
      // Cleanup
      config.triggerEvents.forEach(eventName => {
        if (eventHandlers[eventName]) {
          const element = ['beforeunload', 'pagehide', 'focus', 'blur'].includes(eventName) ? window : document
          element.removeEventListener(eventName, eventHandlers[eventName] as EventListener)
        }
      })
      clearInterval(behaviorTimer)
    }
  }, [triggerDelayedPopunder, updateUserBehavior])

  // Debug panel
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-md z-50 ${className}`}>
      <h4 className="font-bold mb-2 text-orange-400">Delay Popunder Manager (Anti-Block)</h4>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>AdBlock Detected: {isAdBlockDetected ? '🚫' : '✅'}</p>
        <p>Session: {sessionCount}/{configRef.current.maxPerSession}</p>
        <p>Hourly: {hourlyCount}/{configRef.current.maxPerHour}</p>
        <p>Active Delays: {Object.keys(activeDelays).length}</p>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="font-semibold text-yellow-400">Delay Strategies Used:</p>
          {Object.entries(delayStats).map(([strategy, count]) => (
            <div key={strategy} className="flex justify-between">
              <span>{strategy}</span>
              <span className="text-gray-400">{count}x</span>
            </div>
          ))}
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="font-semibold text-green-400">Anti-Detection:</p>
          <p>Stealth Mode: {configRef.current.antiDetection.stealthMode ? '✅' : '❌'}</p>
          <p>Random Delays: {configRef.current.antiDetection.randomDelays ? '✅' : '❌'}</p>
          <p>Variable Timing: {configRef.current.antiDetection.variableTiming ? '✅' : '❌'}</p>
          <p>Behavior Sim: {configRef.current.antiDetection.userBehaviorSimulation ? '✅' : '❌'}</p>
        </div>
        
        {lastTriggered && (
          <p>Last Trigger: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => triggerDelayedPopunder('manual')}
          className="bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs"
        >
          Delayed Trigger
        </button>
        <button
          onClick={() => {
            Object.values(delayTimersRef.current).forEach(timer => clearTimeout(timer))
            setActiveDelays({})
          }}
          className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
        >
          Clear Delays
        </button>
        <button
          onClick={() => {
            setSessionCount(0)
            setHourlyCount(0)
            setLastTriggered(null)
            setActiveDelays({})
            setDelayStats({})
            localStorage.removeItem('delay_popunder_data')
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset All
        </button>
      </div>
    </div>
  )
}

// Presets
export const DELAY_PRESETS = {
  stealth: {
    delayStrategies: [
      { name: 'behavioral', enabled: true, delay: 20, variance: 10, weight: 8 },
      { name: 'random', enabled: true, delay: 30, variance: 15, weight: 6 },
      { name: 'session_based', enabled: true, delay: 45, variance: 20, weight: 4 }
    ],
    antiDetection: {
      randomDelays: true,
      variableTiming: true,
      userBehaviorSimulation: true,
      stealthMode: true,
      bypassAdBlock: true,
      multipleInjection: true,
      scriptObfuscation: true,
      cookieTracking: true
    }
  },
  balanced: {
    delayStrategies: [
      { name: 'short', enabled: true, delay: 2, variance: 1, weight: 4 },
      { name: 'medium', enabled: true, delay: 5, variance: 2, weight: 6 },
      { name: 'behavioral', enabled: true, delay: 10, variance: 5, weight: 5 }
    ],
    antiDetection: {
      randomDelays: true,
      variableTiming: true,
      userBehaviorSimulation: true,
      stealthMode: true,
      bypassAdBlock: true,
      multipleInjection: false,
      scriptObfuscation: true,
      cookieTracking: false
    }
  },
  aggressive: {
    delayStrategies: [
      { name: 'immediate', enabled: true, delay: 0, variance: 0, weight: 3 },
      { name: 'short', enabled: true, delay: 1, variance: 1, weight: 5 },
      { name: 'medium', enabled: true, delay: 3, variance: 2, weight: 4 }
    ],
    antiDetection: {
      randomDelays: false,
      variableTiming: true,
      userBehaviorSimulation: false,
      stealthMode: false,
      bypassAdBlock: true,
      multipleInjection: false,
      scriptObfuscation: true,
      cookieTracking: false
    }
  }
}
