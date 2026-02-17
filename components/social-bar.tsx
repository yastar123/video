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
      
      // Create multiple social bar scripts untuk memastikan load
      const script1 = document.createElement('script')
      script1.src = 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
      script1.async = true
      script1.onload = () => {
        console.log('Adsterra Social Bar script 1 loaded successfully')
      }
      script1.onerror = () => {
        console.error('Adsterra Social Bar script 1 failed to load')
      }
      if (containerRef.current) {
        containerRef.current.appendChild(script1)
      }

      // Backup script jika yang pertama gagal
      setTimeout(() => {
        const script2 = document.createElement('script')
        script2.src = 'https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js'
        script2.async = true
        script2.onload = () => {
          console.log('Adsterra Social Bar script 2 loaded successfully')
        }
        script2.onerror = () => {
          console.error('Adsterra Social Bar script 2 failed to load')
        }
        if (containerRef.current) {
          containerRef.current.appendChild(script2)
        }
      }, 2000)

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
      <div style={{ 
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
