"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface DirectLink {
  id: string
  url: string
  label: string
  weight: number // 1-10, prioritas
  type: 'smartlink' | 'offer' | 'content' | 'premium'
  cooldown: number // dalam detik
  newTab?: boolean
}

interface HybridConfig {
  enabled: boolean
  popunderScript: string
  globalCooldown: number
  maxPerHour: number
  maxPerSession: number
  popunderRatio: number // 0-1, rasio popunder vs direct link
  directLinks: DirectLink[]
  triggerEvents: string[]
  bypassAdBlock: boolean
  stealthMode: boolean
  mobileOptimized: boolean
  fallbackMode: 'popunder' | 'direct' | 'both'
}

interface HybridPopunderProps {
  config?: Partial<HybridConfig>
  className?: string
}

const POPUNDER_SCRIPT = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"

const DEFAULT_DIRECT_LINKS: DirectLink[] = [
  {
    id: 'smartlink_1',
    url: 'https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55',
    label: 'Premium Content',
    weight: 8,
    type: 'smartlink',
    cooldown: 30,
    newTab: true
  },
  {
    id: 'smartlink_2',
    url: 'https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8',
    label: 'Exclusive Videos',
    weight: 7,
    type: 'smartlink',
    cooldown: 45,
    newTab: true
  },
  {
    id: 'smartlink_3',
    url: 'https://www.effectivegatecpm.com/by96i9ee?key=a0e61301b91f693d8a1866f59dd1de66',
    label: 'Special Offers',
    weight: 6,
    type: 'smartlink',
    cooldown: 60,
    newTab: true
  },
  {
    id: 'offer_1',
    url: 'https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55',
    label: 'Limited Time Offer',
    weight: 5,
    type: 'offer',
    cooldown: 90,
    newTab: true
  },
  {
    id: 'content_1',
    url: 'https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8',
    label: 'Trending Content',
    weight: 4,
    type: 'content',
    cooldown: 120,
    newTab: true
  }
]

const DEFAULT_EVENTS = [
  'click', 'dblclick', 'contextmenu', 'mousedown', 'touchstart', 
  'touchend', 'scroll', 'wheel', 'focus', 'blur', 'play', 'pause', 
  'ended', 'submit', 'beforeunload', 'pagehide', 'exitintent'
]

export function HybridPopunder({ 
  config = {}, 
  className = "" 
}: HybridPopunderProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [hourlyCount, setHourlyCount] = useState(0)
  const [lastTriggered, setLastTriggered] = useState<number | null>(null)
  const [linkCooldowns, setLinkCooldowns] = useState<Record<string, number>>({})
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false)
  const [triggerStats, setTriggerStats] = useState({ popunder: 0, direct: 0 })
  const { trackClick } = useSmartlinkAnalytics()
  
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  
  const configRef = useRef<HybridConfig>({
    enabled: true,
    popunderScript: POPUNDER_SCRIPT,
    globalCooldown: 3, // 3 detik global cooldown
    maxPerHour: 80,
    maxPerSession: 150,
    popunderRatio: 0.7, // 70% popunder, 30% direct link
    directLinks: DEFAULT_DIRECT_LINKS,
    triggerEvents: DEFAULT_EVENTS,
    bypassAdBlock: true,
    stealthMode: true,
    mobileOptimized: true,
    fallbackMode: 'both',
    ...config
  })

  // Load popunder script
  useEffect(() => {
    if (!configRef.current.enabled || isScriptLoaded) return

    const loadScript = () => {
      const script = document.createElement('script')
      script.src = configRef.current.popunderScript
      script.async = true
      script.referrerPolicy = 'no-referrer-when-downgrade'
      
      if (configRef.current.stealthMode) {
        script.style.display = 'none'
        script.setAttribute('data-cfasync', 'false')
        script.setAttribute('data-no-defer', '1')
      }
      
      script.onload = () => {
        setIsScriptLoaded(true)
        console.log('Hybrid popunder script loaded')
      }
      
      script.onerror = () => {
        console.error('Failed to load popunder script')
        if (configRef.current.fallbackMode !== 'popunder') {
          setIsScriptLoaded(true) // Enable direct link fallback
        }
      }
      
      // Multiple insertion points
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
    const stored = localStorage.getItem('hybrid_popunder_data')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setSessionCount(data.sessionCount || 0)
        setHourlyCount(data.hourlyCount || 0)
        setLastTriggered(data.lastTriggered || null)
        setLinkCooldowns(data.linkCooldowns || {})
        setTriggerStats(data.triggerStats || { popunder: 0, direct: 0 })
        
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
      linkCooldowns,
      triggerStats,
      lastHourReset: Date.now()
    }
    localStorage.setItem('hybrid_popunder_data', JSON.stringify(data))
  }, [sessionCount, hourlyCount, lastTriggered, linkCooldowns, triggerStats])

  // Check if can trigger
  const canTrigger = useCallback((): boolean => {
    if (!configRef.current.enabled) return false
    
    const config = configRef.current
    
    // Check global limits
    if (sessionCount >= config.maxPerSession) return false
    if (hourlyCount >= config.maxPerHour) return false
    
    // Check global cooldown
    if (lastTriggered) {
      const timeSinceLast = Date.now() - lastTriggered
      if (timeSinceLast < config.globalCooldown * 1000) return false
    }
    
    return true
  }, [sessionCount, hourlyCount, lastTriggered])

  // Get available direct link
  const getAvailableDirectLink = useCallback((): DirectLink | null => {
    const now = Date.now()
    const availableLinks = configRef.current.directLinks.filter(link => {
      const cooldown = linkCooldowns[link.id] || 0
      return now - cooldown >= link.cooldown * 1000
    })
    
    if (availableLinks.length === 0) return null
    
    // Weighted random selection
    const totalWeight = availableLinks.reduce((sum, link) => sum + link.weight, 0)
    let random = Math.random() * totalWeight
    
    for (const link of availableLinks) {
      random -= link.weight
      if (random <= 0) return link
    }
    
    return availableLinks[0]
  }, [linkCooldowns])

  // Trigger popunder
  const triggerPopunder = useCallback(() => {
    if (!isScriptLoaded || !canTrigger()) return false

    const now = Date.now()
    const newSessionCount = sessionCount + 1
    const newHourlyCount = hourlyCount + 1
    
    setSessionCount(newSessionCount)
    setHourlyCount(newHourlyCount)
    setLastTriggered(now)
    setTriggerStats(prev => ({ ...prev, popunder: prev.popunder + 1 }))
    
    saveSessionData()
    
    // Track analytics
    trackClick('hybrid_popunder', configRef.current.popunderScript)
    
    // Multiple trigger techniques
    try {
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
      }
      
      // Technique 2: Form submission
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = configRef.current.popunderScript
      form.target = '_blank'
      form.style.display = 'none'
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
    } catch (e) {
      console.warn('Popunder trigger failed:', e)
      return false
    }
    
    console.log(`Hybrid popunder triggered (session: ${newSessionCount}/${configRef.current.maxPerSession})`)
    return true
  }, [isScriptLoaded, canTrigger, sessionCount, hourlyCount, saveSessionData, trackClick])

  // Trigger direct link
  const triggerDirectLink = useCallback((link?: DirectLink) => {
    const selectedLink = link || getAvailableDirectLink()
    if (!selectedLink || !canTrigger()) return false

    const now = Date.now()
    const newSessionCount = sessionCount + 1
    const newHourlyCount = hourlyCount + 1
    
    setSessionCount(newSessionCount)
    setHourlyCount(newHourlyCount)
    setLastTriggered(now)
    setLinkCooldowns(prev => ({ ...prev, [selectedLink.id]: now }))
    setTriggerStats(prev => ({ ...prev, direct: prev.direct + 1 }))
    
    saveSessionData()
    
    // Track analytics
    trackClick(`hybrid_direct_${selectedLink.type}`, selectedLink.url)
    
    // Open direct link
    try {
      if (selectedLink.newTab) {
        window.open(selectedLink.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = selectedLink.url
      }
    } catch (e) {
      console.warn('Direct link trigger failed:', e)
      return false
    }
    
    console.log(`Hybrid direct link triggered: ${selectedLink.label} (${selectedLink.type})`)
    return true
  }, [getAvailableDirectLink, canTrigger, sessionCount, hourlyCount, saveSessionData, trackClick])

  // Hybrid trigger (popunder atau direct link)
  const triggerHybrid = useCallback((eventName: string) => {
    if (!canTrigger()) return false
    
    const config = configRef.current
    const shouldUsePopunder = Math.random() < config.popunderRatio
    
    if (shouldUsePopunder && isScriptLoaded) {
      return triggerPopunder()
    } else {
      return triggerDirectLink()
    }
  }, [canTrigger, isScriptLoaded, triggerPopunder, triggerDirectLink])

  // Create floating direct link overlay
  const createFloatingOverlay = useCallback((link: DirectLink) => {
    if (overlayRef.current) return
    
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      max-width: 250px;
    `
    
    overlay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <span style="font-weight: 600;">${link.label}</span>
        <span style="font-size: 12px; opacity: 0.8;">→</span>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      </style>
    `
    
    overlay.addEventListener('click', () => {
      triggerDirectLink(link)
      document.body.removeChild(overlay)
      overlayRef.current = null
    })
    
    overlay.addEventListener('mouseenter', () => {
      overlay.style.transform = 'scale(1.05)'
    })
    
    overlay.addEventListener('mouseleave', () => {
      overlay.style.transform = 'scale(1)'
    })
    
    document.body.appendChild(overlay)
    overlayRef.current = overlay
    
    // Auto remove setelah 10 detik
    setTimeout(() => {
      if (overlayRef.current) {
        document.body.removeChild(overlay)
        overlayRef.current = null
      }
    }, 10000)
  }, [triggerDirectLink])

  // Event handlers
  useEffect(() => {
    if (!configRef.current.enabled) return

    const config = configRef.current
    let clickCount = 0

    const handleClick = (e: MouseEvent) => {
      clickCount++
      if (clickCount % 2 === 0) { // Setiap 2 klik
        triggerHybrid('click')
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      triggerHybrid('contextmenu')
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (config.mobileOptimized) {
        triggerHybrid('touchstart')
      }
    }

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 25 && Math.random() < 0.1) {
        triggerHybrid('scroll')
      }
    }

    const handlePlay = (e: Event) => {
      triggerHybrid('play')
    }

    const handleEnded = (e: Event) => {
      triggerHybrid('ended')
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      triggerHybrid('beforeunload')
    }

    const handleExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        // Coba popunder dulu, jika gagal gunakan floating overlay
        if (!triggerHybrid('exitintent')) {
          const link = getAvailableDirectLink()
          if (link) {
            createFloatingOverlay(link)
          }
        }
      }
    }

    // Add event listeners
    const events = [
      { name: 'click', handler: handleClick, element: document },
      { name: 'contextmenu', handler: handleContextMenu, element: document },
      { name: 'touchstart', handler: handleTouchStart, element: document },
      { name: 'scroll', handler: handleScroll, element: window },
      { name: 'play', handler: handlePlay, element: document },
      { name: 'ended', handler: handleEnded, element: document },
      { name: 'beforeunload', handler: handleBeforeUnload, element: window },
      { name: 'mouseleave', handler: handleExitIntent, element: document }
    ]

    events.forEach(({ name, handler, element }) => {
      if (config.triggerEvents.includes(name)) {
        element.addEventListener(name, handler as EventListener, { passive: true })
      }
    })

    // Auto floating overlay setiap 30 detik
    const overlayInterval = setInterval(() => {
      const link = getAvailableDirectLink()
      if (link && Math.random() < 0.3) { // 30% chance
        createFloatingOverlay(link)
      }
    }, 30000)

    return () => {
      events.forEach(({ name, handler, element }) => {
        element.removeEventListener(name, handler as EventListener)
      })
      clearInterval(overlayInterval)
      if (overlayRef.current) {
        document.body.removeChild(overlayRef.current)
      }
    }
  }, [triggerHybrid, getAvailableDirectLink, createFloatingOverlay])

  // Debug panel
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-md z-50 ${className}`}>
      <h4 className="font-bold mb-2 text-purple-400">Hybrid Popunder Manager</h4>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        <p>Script Loaded: {isScriptLoaded ? '✅' : '❌'}</p>
        <p>Session: {sessionCount}/{configRef.current.maxPerSession}</p>
        <p>Hourly: {hourlyCount}/{configRef.current.maxPerHour}</p>
        <p>Popunder Ratio: {(configRef.current.popunderRatio * 100).toFixed(0)}%</p>
        <p>Global Cooldown: {configRef.current.globalCooldown}s</p>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="font-semibold text-yellow-400">Trigger Stats:</p>
          <p>Popunder: {triggerStats.popunder}</p>
          <p>Direct Links: {triggerStats.direct}</p>
          <p>Total: {triggerStats.popunder + triggerStats.direct}</p>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <p className="font-semibold text-green-400">Available Links:</p>
          {getAvailableDirectLink() ? (
            <p className="text-green-300">✅ {getAvailableDirectLink()?.label}</p>
          ) : (
            <p className="text-red-300">❌ All links on cooldown</p>
          )}
        </div>
        
        {lastTriggered && (
          <p>Last Trigger: {new Date(lastTriggered).toLocaleTimeString()}</p>
        )}
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => triggerHybrid('manual')}
          className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
        >
          Hybrid Trigger
        </button>
        <button
          onClick={() => triggerPopunder()}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Popunder Only
        </button>
        <button
          onClick={() => triggerDirectLink()}
          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Direct Link
        </button>
        <button
          onClick={() => {
            setSessionCount(0)
            setHourlyCount(0)
            setLastTriggered(null)
            setLinkCooldowns({})
            setTriggerStats({ popunder: 0, direct: 0 })
            localStorage.removeItem('hybrid_popunder_data')
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// Presets
export const HYBRID_PRESETS = {
  conservative: {
    popunderRatio: 0.8, // 80% popunder, 20% direct
    globalCooldown: 5,
    maxPerHour: 30,
    maxPerSession: 60
  },
  balanced: {
    popunderRatio: 0.7, // 70% popunder, 30% direct
    globalCooldown: 3,
    maxPerHour: 50,
    maxPerSession: 100
  },
  aggressive: {
    popunderRatio: 0.6, // 60% popunder, 40% direct
    globalCooldown: 2,
    maxPerHour: 80,
    maxPerSession: 150
  },
  direct_focused: {
    popunderRatio: 0.3, // 30% popunder, 70% direct
    globalCooldown: 2,
    maxPerHour: 100,
    maxPerSession: 200
  }
}
