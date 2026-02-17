'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SocialBar } from '@/components/social-bar'

interface AdsterraBannerProps {
  format: '160x300' | '160x600' | '300x250' | '468x60' | '728x90' | 'native' | 'social'
}

export function AdsterraBanner({ format }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [adKey, setAdKey] = useState(0) // Force re-render

  // Force re-render ads when route changes
  useEffect(() => {
    setAdKey(prev => prev + 1)
  }, [pathname])

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing content
    containerRef.current.innerHTML = ''

    try {
      if (format === '160x300') {
        // 160x300 IFRAME SYNC
        const script1 = document.createElement('script')
        script1.innerHTML = `
          atOptions = {
            'key' : '6e9a519272442fa242b5a43e53ddc7fd',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        `
        containerRef.current.appendChild(script1)

        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js'
        containerRef.current.appendChild(script2)

      } else if (format === '160x600') {
        // 160x600 IFRAME SYNC
        const script1 = document.createElement('script')
        script1.innerHTML = `
          atOptions = {
            'key' : '22bed31723f24472a78afb44a7addb6b',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        `
        containerRef.current.appendChild(script1)

        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js'
        containerRef.current.appendChild(script2)

      } else if (format === '300x250') {
        // 300x250 IFRAME SYNC
        const script1 = document.createElement('script')
        script1.innerHTML = `
          atOptions = {
            'key' : '1ad6f564f3ca7bb42752dba86368d149',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `
        containerRef.current.appendChild(script1)

        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js'
        containerRef.current.appendChild(script2)

      } else if (format === '468x60') {
        // 468x60 IFRAME SYNC
        const script1 = document.createElement('script')
        script1.innerHTML = `
          atOptions = {
            'key' : 'a8ea859722150189e57a87b6579578f3',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `
        containerRef.current.appendChild(script1)

        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js'
        containerRef.current.appendChild(script2)

      } else if (format === '728x90') {
        // 728x90 IFRAME SYNC
        const script1 = document.createElement('script')
        script1.innerHTML = `
          atOptions = {
            'key' : '5a8dd45e78414c6e5be9db9eaffed61f',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `
        containerRef.current.appendChild(script1)

        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js'
        containerRef.current.appendChild(script2)

      } else if (format === 'native') {
        // Native Banner NATIVE ASYNC
        const container = document.createElement('div')
        container.id = 'container-c08de902b7930682919199d915646b97'
        containerRef.current.appendChild(container)

        const script = document.createElement('script')
        script.async = true
        script.setAttribute('data-cfasync', 'false')
        script.src = 'https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js'
        containerRef.current.appendChild(script)

      } else if (format === 'social') {
        // Use SocialBar component instead
        console.log('Using SocialBar component for better reliability')
      }

      console.log(`Adsterra ${format} banner loaded successfully (route: ${pathname})`)

    } catch (error) {
      console.error(`Error loading ${format} ad:`, error)
    }

  }, [format, pathname, adKey]) // Re-run when pathname or adKey changes

  // For social format, use SocialBar component
  if (format === 'social') {
    return <SocialBar />
  }

  return (
    <div 
      key={`${format}-${adKey}`} // Force re-render with key
      ref={containerRef} 
      className={`flex justify-center items-center ${
        format === '160x300' ? 'w-[160px] h-[300px]' : 
        format === '160x600' ? 'w-[160px] h-[600px]' : 
        format === '300x250' ? 'w-[300px] h-[250px]' : 
        format === '468x60' ? 'w-[468px] h-[60px]' : 
        format === '728x90' ? 'w-full max-w-[728px] h-[90px]' : 
        format === 'native' ? 'w-full min-h-[250px]' : 
        format === 'social' ? 'w-full min-h-[50px]' : 
        'w-full min-h-[100px]'
      }`}
    />
  )
}
