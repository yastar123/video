"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface PopunderEvent {
  name: string
  enabled: boolean
  weight: number // 1-10, prioritas trigger
  cooldown: number // dalam detik
  conditions?: string[] // kondisi tambahan
}

interface MultiEventPopunderConfig {
  enabled: boolean
  globalCooldown: number // global cooldown dalam detik
  maxPerHour: number
  maxPerSession: number
  events: PopunderEvent[]
  bypassAdBlock: boolean
  stealthMode: boolean // sembunyikan dari detection
  mobileOptimized: boolean
}

interface MultiEventPopunderProps {
  config?: Partial<MultiEventPopunderConfig>
  className?: string
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

const DEFAULT_EVENTS: PopunderEvent[] = [
  // Mouse Events
  { name: 'click', enabled: true, weight: 8, cooldown: 30 },
  { name: 'dblclick', enabled: true, weight: 6, cooldown: 60 },
  { name: 'contextmenu', enabled: true, weight: 7, cooldown: 45 },
  { name: 'mousedown', enabled: true, weight: 5, cooldown: 20 },
  { name: 'mouseup', enabled: true, weight: 4, cooldown: 20 },
  
  // Keyboard Events
  { name: 'keydown', enabled: true, weight: 3, cooldown: 15, conditions: ['enter', 'space', 'escape'] },
  { name: 'keyup', enabled: false, weight: 2, cooldown: 10 },
  
  // Touch Events (Mobile)
  { name: 'touchstart', enabled: true, weight: 7, cooldown: 25 },
  { name: 'touchend', enabled: true, weight: 6, cooldown: 25 },
  { name: 'touchmove', enabled: true, weight: 3, cooldown: 30 },
  
  // Scroll Events
  { name: 'scroll', enabled: true, weight: 5, cooldown: 40 },
  { name: 'wheel', enabled: true, weight: 4, cooldown: 20 },
  
  // Window Events
  { name: 'resize', enabled: true, weight: 2, cooldown: 60 },
  { name: 'focus', enabled: true, weight: 3, cooldown: 30 },
  { name: 'blur', enabled: true, weight: 4, cooldown: 30 },
  { name: 'beforeunload', enabled: true, weight: 9, cooldown: 0 },
  { name: 'pagehide', enabled: true, weight: 8, cooldown: 0 },
  
  // Form Events
  { name: 'submit', enabled: true, weight: 6, cooldown: 45 },
  { name: 'change', enabled: true, weight: 2, cooldown: 15 },
  { name: 'input', enabled: false, weight: 1, cooldown: 10 },
  
  // Media Events
  { name: 'play', enabled: true, weight: 7, cooldown: 50 },
  { name: 'pause', enabled: true, weight: 5, cooldown: 40 },
  { name: 'ended', enabled: true, weight: 8, cooldown: 30 },
  { name: 'volumechange', enabled: true, weight: 3, cooldown: 20 },
  
  // Drag Events
  { name: 'dragstart', enabled: true, weight: 4, cooldown: 30 },
  { name: 'dragend', enabled: true, weight: 4, cooldown: 30 },
  { name: 'drop', enabled: true, weight: 5, cooldown: 35 },
  
  // Custom Events
  { name: 'mouseidle', enabled: true, weight: 6, cooldown: 90 },
  { name: 'scrolldepth', enabled: true, weight: 7, cooldown: 60 },
  { name: 'dwelltime', enabled: true, weight: 5, cooldown: 120 },
  { name: 'exitintent', enabled: true, weight: 9, cooldown: 0 },
  { name: 'inactivity', enabled: true, weight: 4, cooldown: 180 }
]

export function MultiEventPopunder({ 
  config = {}, 
  className = "" 
}: MultiEventPopunderProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [hourlyCount, setHourlyCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const [eventCooldowns, setEventCooldowns] = useState<Record<string, number>>({})
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false)
  const { trackClick } = useSmartlinkAnalytics()
  
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const eventCountsRef = useRef<Record<string, number>>({})
  const mousePositionRef = useRef({ x: 0, y: 0, lastMove: Date.now() })
  const scrollDepthRef = useRef({ max: 0, triggered: false })
  const dwellTimeRef = useRef({ start: Date.now(), triggered: false })
  
  const configRef = useRef<MultiEventPopunderConfig>({
    enabled: true,
    globalCooldown: 5, // 5 detik global cooldown
    maxPerHour: 50,
    maxPerSession: 100,
    events: DEFAULT_EVENTS,
    bypassAdBlock: true,
    stealthMode: true,
    mobileOptimized: true,
    ...config
  })

  // Load popunder script
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const loadScript = () => {
      const script = document.createElement('script')
      script.src = POPUNDER_SCRIPT
      script.async = true
      script.referrerPolicy = 'no-referrer-when-downgrade'
      
      // Stealth mode attributes
      if (configRef.current.stealthMode) {
        script.style.display = 'none'
        script.setAttribute('data-cfasync', 'false')
        script.setAttribute('data-no-defer', '1')
        script.setAttribute('data-no-minify', '1')
      }
      
      script.onload = () => {
        setIsScriptLoaded(true)
        console.log('Multi-event popunder script loaded')
      }
      
      script.onerror = () => {
        console.error('Failed to load popunder script')
        // Fallback method
        loadFallbackScript()
      }
      
      // Multiple insertion points for bypass
      const insertionPoints = [
        () => document.head.appendChild(script),
        () => document.body.appendChild(script),
        () => document.documentElement.appendChild(script)
      ]
      
      for (const insert of insertionPoints) {
        try {
          insert()
          scriptRef.current = script
          break
        } catch (e) {
          continue
        }
      }
    }

    const loadFallbackScript = () => {
      const fallback = document.createElement('script')
      fallback.innerHTML = `
        (function() {
          var s = document.createElement('script');
          s.src = '${POPUNDER_SCRIPT}';
          s.async = true;
          (document.head || document.documentElement).appendChild(s);
        })();
      `
      document.head.appendChild(fallback)
      setIsScriptLoaded(true)
    }

    // Delayed loading untuk stealth
    const timer = setTimeout(loadScript, configRef.current.stealthMode ? 2000 : 500)

    return () => {
      clearTimeout(timer)
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [isScriptLoaded])

  // Load session data
  useEffect(() => {
    const stored = localStorage.getItem('multi_event_popunder_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setSessionCount(data.sessionCount || 0)
        setHourlyCount(data.hourlyCount || 0)
        setLastTriggered(data.lastTriggered || null)
        setEventCooldowns(data.eventCooldowns || {})
        
        // Reset hourly count jika new hour
        const now = Date.now()
        if (now - (data.lastHourReset || 0) > 3600000) { // 1 hour
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
      eventCooldowns,
      lastHourReset: Date.now()
    }
    localStorage.setItem('multi_event_popunder_data', JSON.stringify(data))
  }, [sessionCount, hourlyCount, lastTriggered, eventCooldowns])

  // Check if can trigger
  const canTrigger = useCallback((eventName: string): boolean => {
    if (!isScriptLoaded || !configRef.current.enabled) return false
    
    const config = configRef.current
    const event = config.events.find(e => e.name === eventName)
    if (!event || !event.enabled) return false
    
    // Check global limits
    if (sessionCount >= config.maxPerSession) return false
    if (hourlyCount >= config.maxPerHour) return false
    
    // Check global cooldown
    if (lastTriggered) {
      const timeSinceLast = Date.now() - lastTriggered
      if (timeSinceLast < config.globalCooldown * 1000) return false
    }
    
    // Check event cooldown
    const eventCooldown = eventCooldowns[eventName] || 0
    if (Date.now() - eventCooldown < event.cooldown * 1000) return false
    
    return true
  }, [isScriptLoaded, sessionCount, hourlyCount, lastTriggered, eventCooldowns])

  // Trigger popunder
  const triggerPopunder = useCallback((eventName: string, weight: number = 5) => {
    if (!canTrigger(eventName)) return false

    const now = Date.now()
    const newSessionCount = sessionCount + 1
    const newHourlyCount = hourlyCount + 1
    
    setSessionCount(newSessionCount)
    setHourlyCount(newHourlyCount)
    setLastTriggered(now)
    setEventCooldowns(prev => ({ ...prev, [eventName]: now }))
    
    // Update event cooldown
    const event = configRef.current.events.find(e => e.name === eventName)
    if (event) {
      setEventCooldowns(prev => ({ 
        ...prev, 
        [eventName]: now - (event.cooldown * 1000) + 1000 
      }))
    }
    
    saveSessionData()
    
    // Track analytics
    trackClick(`multi_event_popunder_${eventName}`, POPUNDER_SCRIPT)
    
    // Multiple trigger techniques
    try {
      // Technique 1: Standard window.open
      const popunder = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999,scrollbars=no,toolbar=no,location=no,status=no,menubar=no')
      if (popunder) {
        popunder.document.write(`
          <html>
            <head><script>window.location.href="${POPUNDER_SCRIPT}";</script></head>
            <body></body>
          </html>
        `)
        popunder.blur()
        window.focus()
      }
      
      // Technique 2: Form submission
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = POPUNDER_SCRIPT
      form.target = '_blank'
      form.style.display = 'none'
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      // Technique 3: Link click simulation
      const link = document.createElement('a')
      link.href = POPUNDER_SCRIPT
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (e) {
      console.warn(`Popunder trigger failed for ${eventName}:`, e)
    }
    
    console.log(`Multi-event popunder triggered: ${eventName} (weight: ${weight}, session: ${newSessionCount}/${configRef.current.maxPerSession})`)
    return true
  }, [canTrigger, sessionCount, hourlyCount, saveSessionData, trackClick])

  // Event handlers
  useEffect(() => {
    if (!isScriptLoaded) return

    const config = configRef.current
    const handlers: Record<string, Function> = {}

    // Mouse Events
    handlers.click = (e: MouseEvent) => {
      eventCountsRef.current.click = (eventCountsRef.current.click || 0) + 1
      if (Math.random() < 0.3) { // 30% chance
        triggerPopunder('click', 8)
      }
    }

    handlers.dblclick = (e: MouseEvent) => {
      triggerPopunder('dblclick', 6)
    }

    handlers.contextmenu = (e: MouseEvent) => {
      e.preventDefault()
      triggerPopunder('contextmenu', 7)
    }

    handlers.mousedown = (e: MouseEvent) => {
      if (e.button === 2) { // Right click
        triggerPopunder('mousedown', 5)
      }
    }

    // Keyboard Events
    handlers.keydown = (e: KeyboardEvent) => {
      const event = config.events.find(e => e.name === 'keydown')
      if (event?.conditions?.includes(e.key.toLowerCase())) {
        triggerPopunder('keydown', 3)
      }
    }

    // Touch Events (Mobile)
    handlers.touchstart = (e: TouchEvent) => {
      if (config.mobileOptimized) {
        triggerPopunder('touchstart', 7)
      }
    }

    handlers.touchend = (e: TouchEvent) => {
      if (config.mobileOptimized && Math.random() < 0.4) {
        triggerPopunder('touchend', 6)
      }
    }

    // Scroll Events
    handlers.scroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      // Scroll depth trigger
      if (scrollPercent > 25 && !scrollDepthRef.current.triggered) {
        scrollDepthRef.current.triggered = true
        triggerPopunder('scrolldepth', 7)
      }
      
      // Random scroll trigger
      if (Math.random() < 0.05) { // 5% chance
        triggerPopunder('scroll', 5)
      }
    }

    handlers.wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 100 && Math.random() < 0.1) {
        triggerPopunder('wheel', 4)
      }
    }

    // Window Events
    handlers.focus = () => {
      if (Math.random() < 0.2) {
        triggerPopunder('focus', 3)
      }
    }

    handlers.blur = () => {
      triggerPopunder('blur', 4)
    }

    handlers.beforeunload = (e: BeforeUnloadEvent) => {
      triggerPopunder('beforeunload', 9)
    }

    handlers.pagehide = (e: PageTransitionEvent) => {
      triggerPopunder('pagehide', 8)
    }

    // Form Events
    handlers.submit = (e: SubmitEvent) => {
      triggerPopunder('submit', 6)
    }

    // Media Events
    handlers.play = (e: Event) => {
      triggerPopunder('play', 7)
    }

    handlers.pause = (e: Event) => {
      if (Math.random() < 0.5) {
        triggerPopunder('pause', 5)
      }
    }

    handlers.ended = (e: Event) => {
      triggerPopunder('ended', 8)
    }

    // Custom Events
    const setupCustomEvents = () => {
      // Mouse idle detection
      let idleTimer: NodeJS.Timeout
      const resetIdleTimer = () => {
        clearTimeout(idleTimer)
        idleTimer = setTimeout(() => {
          triggerPopunder('mouseidle', 6)
        }, 5000) // 5 seconds idle
      }
      
      document.addEventListener('mousemove', resetIdleTimer)
      document.addEventListener('keypress', resetIdleTimer)
      resetIdleTimer()

      // Exit intent detection
      document.addEventListener('mouseleave', (e: MouseEvent) => {
        if (e.clientY <= 0) {
          triggerPopunder('exitintent', 9)
        }
      })

      // Dwell time detection
      setInterval(() => {
        const dwellTime = (Date.now() - dwellTimeRef.current.start) / 1000
        if (dwellTime > 60 && !dwellTimeRef.current.triggered) { // 1 minute
          dwellTimeRef.current.triggered = true
          triggerPopunder('dwelltime', 5)
        }
      }, 10000)

      // Inactivity detection
      let inactiveTimer: NodeJS.Timeout
      const resetInactiveTimer = () => {
        clearTimeout(inactiveTimer)
        inactiveTimer = setTimeout(() => {
          triggerPopunder('inactivity', 4)
        }, 180000) // 3 minutes inactive
      }
      
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactiveTimer)
      })
      resetInactiveTimer()
    }

    // Add event listeners
    config.events.forEach(event => {
      if (event.enabled && handlers[event.name]) {
        const element = event.name === 'beforeunload' || event.name === 'pagehide' ? window : document
        element.addEventListener(event.name, handlers[event.name] as EventListener, { passive: true })
      }
    })

    setupCustomEvents()

    return () => {
      // Cleanup
      config.events.forEach(event => {
        if (event.enabled && handlers[event.name]) {
          const element = event.name === 'beforeunload' || event.name === 'pagehide' ? window : document
          element.removeEventListener(event.name, handlers[event.name] as EventListener)
        }
      })
    }
  }, [isScriptLoaded, triggerPopunder])

  // Debug panel
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-md z-50 ${className}`}>
      <h4 className="font-bold mb-2 text-red-400">Multi-Event Popunder Manager</h4>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>Session: {sessionCount}/{configRef.current.maxPerSession}</p>
        <p>Hourly: {hourlyCount}/{configRef.current.maxPerHour}</p>
        <p>Global Cooldown: {configRef.current.globalCooldown}s</p>
        <p>Stealth Mode: {configRef.current.stealthMode ? '🕵️' : '👁️'}</p>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="font-semibold text-yellow-400">Active Events:</p>
          {configRef.current.events.filter(e => e.enabled).slice(0, 8).map(event => (
            <div key={event.name} className="flex justify-between">
              <span>{event.name}</span>
              <span className="text-gray-400">W:{event.weight} CD:{event.cooldown}s</span>
            </div>
          ))}
        </div>
        
        {lastTriggered && (
          <p>Last Trigger: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => triggerPopunder('manual', 10)}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Manual Trigger
        </button>
        <button
          onClick={() => {
            setSessionCount(0)
            setHourlyCount(0)
            setLastTriggered(null)
            setEventCooldowns({})
            localStorage.removeItem('multi_event_popunder_data')
          }}
          className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
        >
          Reset All
        </button>
      </div>
    </div>
  )
}

// Event presets
export const EVENT_PRESETS = {
  conservative: {
    events: [
      { name: 'click', enabled: true, weight: 5, cooldown: 60 },
      { name: 'scrolldepth', enabled: true, weight: 6, cooldown: 120 },
      { name: 'exitintent', enabled: true, weight: 8, cooldown: 0 }
    ]
  },
  balanced: {
    events: [
      { name: 'click', enabled: true, weight: 7, cooldown: 30 },
      { name: 'touchstart', enabled: true, weight: 6, cooldown: 45 },
      { name: 'scroll', enabled: true, weight: 5, cooldown: 60 },
      { name: 'play', enabled: true, weight: 7, cooldown: 90 },
      { name: 'exitintent', enabled: true, weight: 9, cooldown: 0 }
    ]
  },
  aggressive: {
    events: [
      { name: 'click', enabled: true, weight: 8, cooldown: 15 },
      { name: 'contextmenu', enabled: true, weight: 7, cooldown: 20 },
      { name: 'touchstart', enabled: true, weight: 7, cooldown: 25 },
      { name: 'scroll', enabled: true, weight: 5, cooldown: 30 },
      { name: 'focus', enabled: true, weight: 3, cooldown: 20 },
      { name: 'blur', enabled: true, weight: 4, cooldown: 20 },
      { name: 'play', enabled: true, weight: 7, cooldown: 40 },
      { name: 'ended', enabled: true, weight: 8, cooldown: 30 },
      { name: 'submit', enabled: true, weight: 6, cooldown: 45 },
      { name: 'exitintent', enabled: true, weight: 9, cooldown: 0 },
      { name: 'beforeunload', enabled: true, weight: 9, cooldown: 0 }
    ]
  },
  maximum: DEFAULT_EVENTS // All events enabled
}
