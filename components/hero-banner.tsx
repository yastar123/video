'use client'

import { useEffect, useState } from 'react'
import type { Banner } from '@/lib/db'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        setBanners(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch banners:', err)
        setBanners([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (banners.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners])

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  if (loading || banners.length === 0) return null

  const banner = banners[currentIndex]

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-2xl group border border-border/50">
      {/* Banner Image */}
      <img
        src={banner.image || "/placeholder.svg"}
        alt={banner.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-2 sm:mb-4 text-balance leading-tight tracking-tight">
            {banner.title}
          </h2>
        </div>
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
