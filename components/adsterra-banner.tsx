'use client'

import { useEffect, useRef } from 'react'

interface AdsterraBannerProps {
  format: '728x90' | '160x600' | 'native' | 'social'
}

export function AdsterraBanner({ format }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing content
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    
    if (format === '728x90') {
      const configScript = document.createElement('script')
      configScript.innerHTML = `
        atOptions = {
          'key' : '5a8dd45e78414c6e5be9db9eaffed61f',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `
      containerRef.current.appendChild(configScript)
      script.src = 'https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js'
    } else if (format === '160x600') {
      const configScript = document.createElement('script')
      configScript.innerHTML = `
        atOptions = {
          'key' : '22bed31723f24472a78afb44a7addb6b',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      `
      containerRef.current.appendChild(configScript)
      script.src = 'https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js'
    } else if (format === 'native') {
      // script.async = true
      // script.src = 'https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js'
      // script.setAttribute('data-cfasync', 'false')
      // const nativeContainer = document.createElement('div')
      // nativeContainer.id = 'container-c08de902b7930682919199d915646b97'
      // containerRef.current.appendChild(nativeContainer)
      return
    } else if (format === 'social') {
      // script.src = 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
      return
    }

    containerRef.current.appendChild(script)
  }, [format])

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-hidden my-4 mx-auto ${
        format === '160x600' ? 'w-[160px] h-[600px]' : 
        format === '728x90' ? 'w-full max-w-[728px] h-[90px]' : 
        'w-full min-h-[100px]'
      }`}
    />
  )
}
