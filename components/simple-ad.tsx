'use client'

import { useEffect } from 'react'

// Simple Adsterra implementation using exact format from Adsterra dashboard
export function SimpleAd({ format }: { format: '160x300' | '160x600' | '300x250' | '468x60' | '728x90' | 'native' | 'social' }) {
  useEffect(() => {
    // Load ad scripts based on format
    const loadAdScript = () => {
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
        document.body.appendChild(script1)
        
        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js'
        document.body.appendChild(script2)
        
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
        document.body.appendChild(script1)
        
        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js'
        document.body.appendChild(script2)
        
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
        document.body.appendChild(script1)
        
        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js'
        document.body.appendChild(script2)
        
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
        document.body.appendChild(script1)
        
        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js'
        document.body.appendChild(script2)
        
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
        document.body.appendChild(script1)
        
        const script2 = document.createElement('script')
        script2.src = 'https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js'
        document.body.appendChild(script2)
        
      } else if (format === 'native') {
        // Native Banner NATIVE ASYNC
        const container = document.createElement('div')
        container.id = 'container-c08de902b7930682919199d915646b97'
        document.body.appendChild(container)
        
        const script = document.createElement('script')
        script.async = true
        script.setAttribute('data-cfasync', 'false')
        script.src = 'https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js'
        document.body.appendChild(script)
        
      } else if (format === 'social') {
        // Social Bar JS SYNC (NO ADBLOCK BYPASS)
        const script = document.createElement('script')
        script.src = 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
        document.body.appendChild(script)
      }
    }

    // Load ads after page is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadAdScript)
    } else {
      loadAdScript()
    }

    // Cleanup function
    return () => {
      // Remove scripts when component unmounts (optional)
    }
  }, [format])

  // Return placeholder div for ad container
  return (
    <div 
      className={`ad-container ${
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
