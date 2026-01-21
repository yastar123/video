'use client'

import { useEffect, useState } from 'react'
import { banners } from '@/lib/db'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/session'

interface AdBannerProps {
  position?: 'top' | 'sidebar' | 'bottom'
  maxItems?: number
}

export function AdBanner({ position = 'top', maxItems = 1 }: AdBannerProps) {
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user?.role === 'userVIP') {
      setIsVip(true)
    }
  }, [])

  // Don't show ads for VIP users
  if (isVip) {
    return null
  }

  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/ads?position=${position}&status=active`)
      .then((res) => res.json())
      .then((data) => {
        setAds(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch ads:', err)
        setAds([])
        setLoading(false)
      })
  }, [position])

  // Don't show ads for VIP users
  if (isVip || loading || ads.length === 0) {
    return null
  }

  const displayAds = ads.slice(0, maxItems)

  if (position === 'sidebar') {
    return (
      <div className="space-y-4">
        {displayAds.map((ad) => (
          <Link
            key={ad.id}
            href={ad.link || '#'}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition">
              <img
                src={ad.image || "/placeholder.svg"}
                alt={ad.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex flex-col justify-end p-3">
                <h3 className="font-semibold text-white text-sm">
                  {ad.title}
                </h3>
                <p className="text-xs text-white/80">{ad.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  if (position === 'bottom') {
    return (
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.link || '#'}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition h-48">
                <img
                  src={ad.image || "/placeholder.svg"}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex flex-col justify-end p-4">
                  <h3 className="font-bold text-white text-lg">
                    {ad.title}
                  </h3>
                  <p className="text-white/90 text-sm">{ad.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-white text-sm">
                    Learn more
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Top banner (default)
  return (
    <section className="mb-8">
      <div className="space-y-2">
        {displayAds.map((ad) => (
          <Link
            key={ad.id}
            href={ad.link || '#'}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition h-24 md:h-28">
              <img
                src={ad.image || "/placeholder.svg"}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 hover:from-black/70 hover:to-black/30 transition flex items-center justify-between p-6">
                <div>
                  <h3 className="font-bold text-white text-lg md:text-xl">
                    {ad.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    {ad.description}
                  </p>
                </div>
                <ChevronRight size={24} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
