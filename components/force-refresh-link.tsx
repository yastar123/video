'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ForceRefreshLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function ForceRefreshLink({ href, children, className, onClick }: ForceRefreshLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Trigger aggressive popunder before navigation
    try {
      if (typeof window !== 'undefined' && (window as any).adsterra_popunder) {
        (window as any).adsterra_popunder();
        
        // Multiple triggers for aggressive behavior
        setTimeout(() => {
          if ((window as any).adsterra_popunder) {
            (window as any).adsterra_popunder();
          }
        }, 100);
        
        setTimeout(() => {
          if ((window as any).adsterra_popunder) {
            (window as any).adsterra_popunder();
          }
        }, 300);
      }
      
      // Trigger additional events
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(clickEvent);
      
    } catch (err) {
      console.error('Force refresh link popunder error:', err);
    }
    
    // Execute custom onClick if provided
    if (onClick) {
      onClick()
    }
    
    // Force full page refresh untuk reload semua iklan
    window.location.href = href
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

// Hook untuk memaksa refresh pada router navigation
export function useForceRefresh() {
  const router = useRouter()
  
  const pushWithRefresh = (href: string) => {
    window.location.href = href
  }
  
  const replaceWithRefresh = (href: string) => {
    window.location.replace(href)
  }
  
  return {
    push: pushWithRefresh,
    replace: replaceWithRefresh
  }
}
