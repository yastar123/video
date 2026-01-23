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

  // SEO-optimized keywords untuk adult content Indonesia
  const seoKeywords = [
    'nonton bokep', 'video porno indonesia', 'bokep terbaru', 
    'memek viral', 'ngentot', 'jepang bokep', 'china bokep',
    'bokep barat', 'streaming bokep gratis', 'bokep indo 2026'
  ].join(', ')

  // Dynamic title dengan high-search volume keywords
  const seoTitle = `${banner.title} - Nonton Bokep Terbaru Indonesia Jepang China Gratis`
  
  // Meta description optimized (155 chars)
  const seoDescription = `Nonton ${banner.title.toLowerCase()} video bokep terbaru Indonesia, Jepang, China. Streaming gratis kualitas HD nonton bokep viral memek ngentot terupdate 2026.`

  return (
    <>
      {/* SEO Meta Tags - Critical untuk Google ranking */}
      <head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        
        {/* Open Graph untuk social sharing */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="video.other" />
        <meta property="og:image" content={banner.image || "/placeholder.svg"} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        
        {/* Adult Content Schema */}
        <meta name="rating" content="Adult" />
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data untuk Video (rich snippets) */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": seoTitle,
              "description": seoDescription,
              "thumbnailUrl": banner.image,
              "uploadDate": new Date().toISOString().split('T')[0],
              "contentUrl": window.location.href,
              "embedUrl": window.location.href,
              "genre": ["Adult", "Pornography"],
              "inLanguage": "id",
              "isFamilyFriendly": false
            })
          }}
        />
      </head>

      <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] overflow-hidden rounded-2xl group border border-border/50">
        {/* Banner Image dengan SEO alt text */}
        <img
          src={banner.image || "/placeholder.svg"}
          alt={`Nonton ${banner.title} - Video Bokep Terbaru Indonesia Jepang China Gratis HD`}
          title={`Nonton ${banner.title} Bokep Terupdate 2026`}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          width={1200}
          height={400}
        />

        {/* SEO Optimized Overlay dengan keyword-rich content */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* H1 dengan primary keyword (penting untuk SEO) */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-2 sm:mb-4 text-balance leading-tight tracking-tight">
              {banner.title}
            </h1>
            
            {/* Keyword-rich subtitle untuk dwell time & SEO */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-semibold mb-4 hidden md:block">
              Nonton Bokep Terbaru Indonesia • Jepang • China • Gratis HD 2026
            </p>
            
            {/* CTA dengan keyword anchor text */}
            <Link 
              href={`/search?q=${encodeURIComponent('bokep terbaru')}`}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Nonton Sekarang Bokep Gratis →
            </Link>
          </div>
        </div>

        {/* Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="Previous banner - Nonton bokep sebelumnya"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              aria-label="Next banner - Nonton bokep selanjutnya"
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
                  aria-label={`Go to banner ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Additional SEO content block - keyword density booster */}
      <div className="mt-6 p-6 bg-gradient-to-r from-red-900/20 to-purple-900/20 rounded-2xl border border-red-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">Kategori Bokep Terpopuler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {['Bokep Indo', 'Jepang Uncensored', 'China Viral', 'Barat HD'].map((cat) => (
            <Link 
              key={cat}
              href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
              className="block p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}