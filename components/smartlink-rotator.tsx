"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

interface SmartlinkRotatorProps {
  className?: string
  children?: React.ReactNode
}

const SMARTLINKS = [
  {
    id: 'smartlink_1',
    url: 'https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55',
    label: 'Premium Content'
  },
  {
    id: 'smartlink_2', 
    url: 'https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8',
    label: 'Exclusive Videos'
  },
  {
    id: 'smartlink_3',
    url: 'https://www.effectivegatecpm.com/by96i9ee?key=a0e61301b91f693d8a1866f59dd1de66',
    label: 'Special Offers'
  }
]

export function SmartlinkRotator({ className = "", children }: SmartlinkRotatorProps) {
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { trackClick } = useSmartlinkAnalytics()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLinkIndex((prevIndex) => (prevIndex + 1) % SMARTLINKS.length)
    }, 10000) // Rotasi setiap 10 detik

    return () => clearInterval(interval)
  }, [])

  const currentLink = SMARTLINKS[currentLinkIndex]

  if (!isVisible) return null

  return (
    <div className={`relative ${className}`}>
      <Link 
        href={currentLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg p-4 transition-all duration-300 group"
        onClick={() => {
          trackClick(currentLink.id, currentLink.url)
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
              {currentLink.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sponsored</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
            style={{
              animation: 'shrink 10s linear infinite'
            }}
          ></div>
        </div>
      </Link>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xs"
        aria-label="Close smartlink"
      >
        ×
      </button>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Component untuk multiple smartlinks (jika diperlukan)
export function MultipleSmartlinks({ count = 1, className = "" }: { count?: number, className?: string }) {
  const [linkIndices, setLinkIndices] = useState<number[]>(() => 
    Array.from({ length: count }, (_, i) => i % SMARTLINKS.length)
  )
  const { trackClick } = useSmartlinkAnalytics()

  useEffect(() => {
    const interval = setInterval(() => {
      setLinkIndices(prev => 
        prev.map((index, i) => (index + 1 + i) % SMARTLINKS.length)
      )
    }, 8000) // Rotasi setiap 8 detik untuk multiple

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`space-y-3 ${className}`}>
      {linkIndices.map((index, i) => {
        const link = SMARTLINKS[index]
        return (
          <Link
            key={`${link.id}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-blue-600/20 to-green-600/20 hover:from-blue-600/30 hover:to-green-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg p-3 transition-all duration-300 group"
            onClick={() => trackClick(link.id, link.url)}
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">
                {link.label}
              </span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
