'use client'

import { useEffect, useRef } from 'react'

interface AdsterraAdProps {
  adKey: string
  format: 'iframe' | 'js'
  height?: number
  width?: number
  className?: string
}

// Adsterra ad configurations
const ADSTERRA_CONFIGS = {
  // IFRAME BANNERS
  '6e9a519272442fa242b5a43e53ddc7fd': {
    format: 'iframe',
    height: 300,
    width: 160,
    type: 'highperformanceformat'
  },
  '22bed31723f24472a78afb44a7addb6b': {
    format: 'iframe',
    height: 600,
    width: 160,
    type: 'highperformanceformat'
  },
  '1ad6f564f3ca7bb42752dba86368d149': {
    format: 'iframe',
    height: 250,
    width: 300,
    type: 'highperformanceformat'
  },
  'a8ea859722150189e57a87b6579578f3': {
    format: 'iframe',
    height: 60,
    width: 468,
    type: 'highperformanceformat'
  },
  '5a8dd45e78414c6e5be9db9eaffed61f': {
    format: 'iframe',
    height: 90,
    width: 728,
    type: 'highperformanceformat'
  },
  
  // JS BANNERS
  'c08de902b7930682919199d915646b97': {
    format: 'js',
    type: 'effectivegatecpm',
    async: true,
    cfasync: false,
    containerId: 'container-c08de902b7930682919199d915646b97'
  },
  '9add34aad611a8243e9fa65055bde309': {
    format: 'js',
    type: 'effectivegatecpm',
    path: '9a/dd/34'
  },
  '4388c91d89682a21f68164b288c042f9': {
    format: 'js',
    type: 'effectivegatecpm',
    path: '43/88/c9'
  }
} as const

type AdConfig = typeof ADSTERRA_CONFIGS[keyof typeof ADSTERRA_CONFIGS]

export function AdsterraAd({ adKey, format, height, width, className = "" }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const config = ADSTERRA_CONFIGS[adKey as keyof typeof ADSTERRA_CONFIGS]
    if (!config) {
      console.warn(`Adsterra ad key not found: ${adKey}`)
      return
    }

    // Clear existing content
    containerRef.current.innerHTML = ''

    if (config.format === 'iframe') {
      // IFRAME BANNER
      const configScript = document.createElement('script')
      configScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height || (config as any).height},
          'width' : ${width || (config as any).width},
          'params' : {}
        };
      `
      containerRef.current.appendChild(configScript)

      const invokeScript = document.createElement('script')
      invokeScript.src = `https://www.${config.type}.com/${adKey}/invoke.js`
      containerRef.current.appendChild(invokeScript)

    } else if (config.format === 'js') {
      // JS BANNER
      if ('containerId' in config) {
        // Native banner with container
        const nativeContainer = document.createElement('div')
        nativeContainer.id = config.containerId
        containerRef.current.appendChild(nativeContainer)
      }

      const jsScript = document.createElement('script')
      
      if ('async' in config) {
        jsScript.async = config.async
      }
      
      if ('cfasync' in config) {
        jsScript.setAttribute('data-cfasync', config.cfasync.toString())
      }

      if ('path' in config) {
        jsScript.src = `https://pl28722941.${config.type}.com/${config.path}/${adKey}.js`
      } else {
        jsScript.src = `https://pl28722946.${config.type}.com/${adKey}/invoke.js`
      }
      
      containerRef.current.appendChild(jsScript)
    }

  }, [adKey, format, height, width])

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-hidden ${className}`}
      style={{
        width: format === 'iframe' ? `${width}px` : '100%',
        height: format === 'iframe' ? `${height}px` : 'auto'
      }}
    />
  )
}

// Legacy wrapper for backward compatibility
export default function AdScript({ adKey, format, height, width, className }: AdsterraAdProps) {
  return <AdsterraAd adKey={adKey} format={format} height={height} width={width} className={className} />
}
