"use client"

import { useState, useEffect } from 'react'

interface SystemStatus {
  delayPopunder: {
    loaded: boolean
    adBlockDetected: boolean
    sessionCount: number
    hourlyCount: number
    activeDelays: number
    delayStats: Record<string, number>
  }
  smartlinkRotator: {
    loaded: boolean
    rotationCount: number
    analyticsCount: number
    lastRotation: number | null
  }
  system: {
    nodeEnv: string
    browser: string
    mobile: boolean
    localStorage: boolean
    cookies: boolean
  }
}

export function TestingDashboard() {
  const [status, setStatus] = useState<SystemStatus>({
    delayPopunder: {
      loaded: false,
      adBlockDetected: false,
      sessionCount: 0,
      hourlyCount: 0,
      activeDelays: 0,
      delayStats: {}
    },
    smartlinkRotator: {
      loaded: false,
      rotationCount: 0,
      analyticsCount: 0,
      lastRotation: null
    },
    system: {
      nodeEnv: 'unknown',
      browser: 'unknown',
      mobile: false,
      localStorage: false,
      cookies: false
    }
  })

  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Check system status
    const checkSystemStatus = () => {
      const delayData = localStorage.getItem('delay_popunder_data')
      const smartlinkData = localStorage.getItem('smartlink_analytics')
      
      const parsedDelayData = delayData ? JSON.parse(delayData) : {}
      const parsedSmartlinkData = smartlinkData ? JSON.parse(smartlinkData) : []

      setStatus({
        delayPopunder: {
          loaded: !!document.querySelector('script[src*="4388c91d89682a21f68164b288c042f9"]'),
          adBlockDetected: parsedDelayData.adBlockDetected || false,
          sessionCount: parsedDelayData.sessionCount || 0,
          hourlyCount: parsedDelayData.hourlyCount || 0,
          activeDelays: parsedDelayData.activeDelays ? Object.keys(parsedDelayData.activeDelays).length : 0,
          delayStats: parsedDelayData.delayStats || {}
        },
        smartlinkRotator: {
          loaded: document.querySelectorAll('[data-smartlink]').length > 0,
          rotationCount: parsedSmartlinkData.length,
          analyticsCount: parsedSmartlinkData.length,
          lastRotation: parsedSmartlinkData.length > 0 ? parsedSmartlinkData[parsedSmartlinkData.length - 1]?.timestamp : null
        },
        system: {
          nodeEnv: process.env.NODE_ENV || 'unknown',
          browser: navigator.userAgent.split(' ')[0] || 'unknown',
          mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
          localStorage: typeof Storage !== 'undefined',
          cookies: navigator.cookieEnabled
        }
      })
    }

    checkSystemStatus()
    const interval = setInterval(checkSystemStatus, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const runQuickTest = () => {
    // Test delay popunder
    const delayData = localStorage.getItem('delay_popunder_data')
    if (delayData) {
      const parsed = JSON.parse(delayData)
      console.log('✅ Delay Popunder Data:', parsed)
    } else {
      console.log('❌ No Delay Popunder Data Found')
    }

    // Test smartlink analytics
    const smartlinkData = localStorage.getItem('smartlink_analytics')
    if (smartlinkData) {
      const parsed = JSON.parse(smartlinkData)
      console.log('✅ Smartlink Analytics:', parsed)
    } else {
      console.log('❌ No Smartlink Analytics Found')
    }

    // Test script loading
    const scripts = document.querySelectorAll('script[src*="4388c91d89682a21f68164b288c042f9"]')
    console.log(`✅ Popunder Scripts Loaded: ${scripts.length}`)

    // Test smartlink elements
    const smartlinks = document.querySelectorAll('[data-smartlink]')
    console.log(`✅ Smartlink Elements: ${smartlinks.length}`)
  }

  const clearAllData = () => {
    localStorage.removeItem('delay_popunder_data')
    localStorage.removeItem('smartlink_analytics')
    localStorage.removeItem('advanced_popunder_data')
    localStorage.removeItem('multi_event_popunder_data')
    localStorage.removeItem('hybrid_popunder_data')
    window.location.reload()
  }

  const triggerTestEvents = () => {
    // Test click events
    const clickEvent = new MouseEvent('click', { bubbles: true })
    document.body.dispatchEvent(clickEvent)

    // Test scroll events
    window.scrollBy(0, 100)
    setTimeout(() => window.scrollBy(0, -100), 100)

    // Test touch events (if mobile)
    if (status.system.mobile) {
      const touchEvent = new TouchEvent('touchstart', { bubbles: true })
      document.body.dispatchEvent(touchEvent)
    }

    console.log('🧪 Test Events Triggered!')
  }

  // Only show in development
  if (status.system.nodeEnv !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-green-400">Testing Dashboard</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {!expanded && (
        <div className="space-y-1">
          <p>Delay Popunder: {status.delayPopunder.loaded ? '✅' : '❌'}</p>
          <p>Smartlink: {status.smartlinkRotator.loaded ? '✅' : '❌'}</p>
          <p>Environment: {status.system.nodeEnv}</p>
        </div>
      )}

      {expanded && (
        <div className="space-y-3">
          {/* System Status */}
          <div className="border-t border-gray-600 pt-2">
            <p className="font-semibold text-blue-400">System Status</p>
            <p>Environment: {status.system.nodeEnv}</p>
            <p>Browser: {status.system.browser}</p>
            <p>Mobile: {status.system.mobile ? '✅' : '❌'}</p>
            <p>LocalStorage: {status.system.localStorage ? '✅' : '❌'}</p>
            <p>Cookies: {status.system.cookies ? '✅' : '❌'}</p>
          </div>

          {/* Delay Popunder Status */}
          <div className="border-t border-gray-600 pt-2">
            <p className="font-semibold text-orange-400">Delay Popunder</p>
            <p>Script Loaded: {status.delayPopunder.loaded ? '✅' : '❌'}</p>
            <p>AdBlock Detected: {status.delayPopunder.adBlockDetected ? '🚫' : '✅'}</p>
            <p>Session: {status.delayPopunder.sessionCount}</p>
            <p>Hourly: {status.delayPopunder.hourlyCount}</p>
            <p>Active Delays: {status.delayPopunder.activeDelays}</p>
            <p>Strategies Used: {Object.keys(status.delayPopunder.delayStats).length}</p>
          </div>

          {/* Smartlink Status */}
          <div className="border-t border-gray-600 pt-2">
            <p className="font-semibold text-green-400">Smartlink Rotator</p>
            <p>Loaded: {status.smartlinkRotator.loaded ? '✅' : '❌'}</p>
            <p>Rotations: {status.smartlinkRotator.rotationCount}</p>
            <p>Analytics: {status.smartlinkRotator.analyticsCount}</p>
            <p>Last Rotation: {status.smartlinkRotator.lastRotation ? 
              new Date(status.smartlinkRotator.lastRotation).toLocaleTimeString() : 'Never'}</p>
          </div>

          {/* Test Buttons */}
          <div className="border-t border-gray-600 pt-2 space-y-2">
            <p className="font-semibold text-yellow-400">Testing Tools</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={runQuickTest}
                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
              >
                🧪 Quick Test
              </button>
              <button
                onClick={triggerTestEvents}
                className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
              >
                ⚡ Trigger Events
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-600 pt-2">
            <p className="font-semibold text-purple-400">Quick Instructions</p>
            <ul className="text-gray-300 space-y-1">
              <li>1. Click "Quick Test" to check console</li>
              <li>2. Click "Trigger Events" to test</li>
              <li>3. Check debug panels (bottom-right)</li>
              <li>4. Test manual triggers in panels</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
