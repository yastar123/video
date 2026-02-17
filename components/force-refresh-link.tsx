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
