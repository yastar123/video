'use client'

import { useEffect, useRef } from 'react'

interface SocialBarProps {
  className?: string
}

export function SocialBar({ className = "" }: SocialBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing content
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    try {
      console.log('Loading Adsterra Social Bar...')
      
      // Create social bar script
      const script = document.createElement('script')
      script.src = 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
      script.async = true
      script.onload = () => {
        console.log('Adsterra Social Bar script loaded successfully')
        // Clear loading state when script loads
        if (containerRef.current) {
          const loadingDiv = containerRef.current.querySelector('.loading-text')
          if (loadingDiv) {
            loadingDiv.remove()
          }
        }
      }
      script.onerror = () => {
        console.error('Adsterra Social Bar script failed to load')
      }
      
      if (containerRef.current) {
        containerRef.current.appendChild(script)
      }

    } catch (error) {
      console.error('Error loading Social Bar:', error)
    }

  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`w-full min-h-[50px] ${className}`}
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="loading-text" style={{ 
        fontSize: '12px', 
        color: '#666',
        textAlign: 'center',
        padding: '10px'
      }}>
        Loading Social Bar...
      </div>
    </div>
  )
}
