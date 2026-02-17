'use client'

import { useEffect, useRef, useState } from 'react'

// Extend Window interface for atOptions
declare global {
  interface Window {
    atOptions?: {
      key: string
      format: string
      height?: number
      width?: number
      params?: Record<string, any>
    }
  }
}

interface AdsterraBannerProps {
  format: '160x300' | '160x600' | '300x250' | '468x60' | '728x90' | 'native' | 'social'
}

// Adsterra configurations with proper types
const AD_CONFIGS = {
  '160x300': {
    key: '6e9a519272442fa242b5a43e53ddc7fd',
    format: 'iframe' as const,
    height: 300,
    width: 160,
    scriptUrl: 'https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js'
  },
  '160x600': {
    key: '22bed31723f24472a78afb44a7addb6b',
    format: 'iframe' as const,
    height: 600,
    width: 160,
    scriptUrl: 'https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js'
  },
  '300x250': {
    key: '1ad6f564f3ca7bb42752dba86368d149',
    format: 'iframe' as const,
    height: 250,
    width: 300,
    scriptUrl: 'https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js'
  },
  '468x60': {
    key: 'a8ea859722150189e57a87b6579578f3',
    format: 'iframe' as const,
    height: 60,
    width: 468,
    scriptUrl: 'https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js'
  },
  '728x90': {
    key: '5a8dd45e78414c6e5be9db9eaffed61f',
    format: 'iframe' as const,
    height: 90,
    width: 728,
    scriptUrl: 'https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js'
  },
  'native': {
    key: 'c08de902b7930682919199d915646b97',
    format: 'native' as const,
    scriptUrl: 'https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js',
    containerId: 'container-c08de902b7930682919199d915646b97'
  },
  'social': {
    key: '9add34aad611a8243e9fa65055bde309',
    format: 'social' as const,
    scriptUrl: 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
  }
}

type IframeConfig = {
  key: string
  format: 'iframe'
  height: number
  width: number
  scriptUrl: string
}

type NativeConfig = {
  key: string
  format: 'native'
  scriptUrl: string
  containerId: string
}

type SocialConfig = {
  key: string
  format: 'social'
  scriptUrl: string
}

type AdConfig = IframeConfig | NativeConfig | SocialConfig

export function AdsterraBanner({ format }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const config = AD_CONFIGS[format] as AdConfig
    if (!config) {
      console.error(`Unknown ad format: ${format}`)
      setAdError(true)
      return
    }

    // Clear existing content
    containerRef.current.innerHTML = ''
    setAdLoaded(false)
    setAdError(false)

    // Add debug border for development
    if (process.env.NODE_ENV === 'development') {
      containerRef.current.style.border = '2px dashed red'
      containerRef.current.style.position = 'relative'
      
      const debugLabel = document.createElement('div')
      debugLabel.textContent = `Ad: ${format} (${config.key})`
      debugLabel.style.position = 'absolute'
      debugLabel.style.top = '0'
      debugLabel.style.left = '0'
      debugLabel.style.fontSize = '10px'
      debugLabel.style.background = 'rgba(255,0,0,0.8)'
      debugLabel.style.color = 'white'
      debugLabel.style.padding = '2px'
      debugLabel.style.zIndex = '9999'
      containerRef.current.appendChild(debugLabel)
    }

    try {
      if (config.format === 'iframe') {
        // IFRAME BANNER
        console.log(`Loading ${format} iframe banner...`)
        
        // Set global atOptions
        window.atOptions = {
          'key': config.key,
          'format': config.format,
          'height': config.height,
          'width': config.width,
          'params': {}
        }
        
        // Create config script
        const configScript = document.createElement('script')
        configScript.innerHTML = `
          window.atOptions = {
            'key': '${config.key}',
            'format': '${config.format}',
            'height': ${config.height},
            'width': ${config.width},
            'params': {}
          };
          console.log('Adsterra config set for ${format}:', window.atOptions);
        `
        containerRef.current.appendChild(configScript)

        // Create invoke script
        const invokeScript = document.createElement('script')
        invokeScript.src = config.scriptUrl
        invokeScript.async = true
        invokeScript.onload = () => {
          console.log(`Adsterra ${format} script loaded successfully`)
          setAdLoaded(true)
          
          // Check if iframe was created
          setTimeout(() => {
            const iframes = containerRef.current?.querySelectorAll('iframe')
            console.log(`${format} iframes found:`, iframes?.length || 0)
            if (iframes && iframes.length === 0) {
              console.warn(`No iframe found for ${format} banner`)
              setAdError(true)
            }
          }, 1000)
        }
        invokeScript.onerror = () => {
          console.error(`Adsterra ${format} script failed to load`)
          setAdError(true)
        }
        containerRef.current.appendChild(invokeScript)

      } else if (config.format === 'native') {
        // NATIVE BANNER
        console.log(`Loading ${format} native banner...`)
        
        // Create container
        const nativeContainer = document.createElement('div')
        nativeContainer.id = config.containerId
        nativeContainer.style.width = '100%'
        nativeContainer.style.minHeight = '250px'
        containerRef.current.appendChild(nativeContainer)

        // Create script
        const nativeScript = document.createElement('script')
        nativeScript.async = true
        nativeScript.setAttribute('data-cfasync', 'false')
        nativeScript.src = config.scriptUrl
        nativeScript.onload = () => {
          console.log(`Adsterra ${format} native script loaded successfully`)
          setAdLoaded(true)
        }
        nativeScript.onerror = () => {
          console.error(`Adsterra ${format} native script failed to load`)
          setAdError(true)
        }
        containerRef.current.appendChild(nativeScript)

      } else if (config.format === 'social') {
        // SOCIAL BAR
        console.log(`Loading ${format} social bar...`)
        
        const socialScript = document.createElement('script')
        socialScript.src = config.scriptUrl
        socialScript.onload = () => {
          console.log(`Adsterra ${format} social script loaded successfully`)
          setAdLoaded(true)
        }
        socialScript.onerror = () => {
          console.error(`Adsterra ${format} social script failed to load`)
          setAdError(true)
        }
        containerRef.current.appendChild(socialScript)
      }

    } catch (error) {
      console.error(`Error loading ${format} ad:`, error)
      setAdError(true)
    }

  }, [format])

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-hidden my-4 mx-auto relative ${
        format === '160x300' ? 'w-[160px] h-[300px]' : 
        format === '160x600' ? 'w-[160px] h-[600px]' : 
        format === '300x250' ? 'w-[300px] h-[250px]' : 
        format === '468x60' ? 'w-[468px] h-[60px]' : 
        format === '728x90' ? 'w-full max-w-[728px] h-[90px]' : 
        format === 'native' ? 'w-full min-h-[250px]' : 
        format === 'social' ? 'w-full min-h-[50px]' : 
        'w-full min-h-[100px]'
      }`}
    >
      {/* Fallback content for development */}
      {process.env.NODE_ENV === 'development' && adError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 border-2 border-red-500 text-red-700 text-xs p-2">
          <div className="text-center">
            <div>Ad Error: {format}</div>
            <div>Check console for details</div>
          </div>
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && !adLoaded && !adError && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 border-2 border-yellow-500 text-yellow-700 text-xs p-2">
          <div className="text-center">
            <div>Loading Ad: {format}</div>
            <div>Please wait...</div>
          </div>
        </div>
      )}
    </div>
  )
}
