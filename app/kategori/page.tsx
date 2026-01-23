'use client'

import { useEffect, useState } from 'react'
import { categories, videos } from '@/lib/db'
import type { Category, Video } from '@/lib/db'
import { VideoCard } from '@/components/video-card'
import { SortFilter } from '@/components/sort-filter'
import { Pagination } from '@/components/pagination'
import { ArrowLeft, Filter, Clock, Eye, Star } from 'lucide-react'
import Link from 'next/link'
import { MobileMenu } from '@/components/mobile-menu'
import Head from 'next/head'

export default function KategoriPage({ params }: { params: { slug?: string } }) {
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categorySlug, setCategorySlug] = useState<string>('')
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVideos, setTotalVideos] = useState(0)
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const limit = 12 // Increased for better UX/SEO

  // Indonesian adult keywords mapping
  const categoryKeywords: Record<string, string[]> = {
    'indonesia': ['bokep indonesia', 'video porno indonesia', 'bokep indo viral', 'cerita bokep indonesia'],
    'jepang': ['bokep jepang', 'jav uncensored', 'video dewasa jepang', 'bokep jepang terbaru'],
    'china': ['bokep china', 'video porno china', 'bokep cina hd', 'film dewasa china'],
    'abar': ['bokep abar', 'video abar terbaru', 'nonton abar gratis'],
    'asia': ['bokep asia', 'video dewasa asia', 'bokep asian'],
    // Add more categories as needed
  }

  useEffect(() => {
    // Set initial category from slug if available
    if (params.slug) {
      setCategorySlug(params.slug)
    }

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data : []
        setCategoriesList(cats)
        
        // Auto-select first category or slug-based category
        let initialCategory = ''
        if (params.slug) {
          const slugCategory = cats.find(cat => 
            cat.slug === params.slug || cat.name.toLowerCase().includes(params.slug)
          )
          initialCategory = slugCategory?.name || cats[0]?.name || ''
        } else if (cats.length > 0) {
          initialCategory = cats[0].name
        }
        setSelectedCategory(initialCategory)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err)
        setCategoriesList([])
        setLoading(false)
      })
  }, [params.slug])

  useEffect(() => {
    if (!selectedCategory) return

    setLoading(true)
    const paramsQuery = new URLSearchParams({
      category: selectedCategory,
      sort,
      page: currentPage.toString(),
      limit: limit.toString()
    })

    fetch(`/api/videos?${paramsQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredVideos(Array.isArray(data.videos) ? data.videos : [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalVideos(data.pagination?.total || 0)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch videos:', err)
        setFilteredVideos([])
        setLoading(false)
      })
  }, [selectedCategory, sort, currentPage])

  // Reset pagination on category/sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, sort])

  const getCategoryMeta = (categoryName: string) => {
    const keywords = categoryKeywords[categoryName.toLowerCase()] || ['bokep', 'video dewasa', 'nonton bokep gratis']
    const title = `${selectedCategory} Terbaru - Nonton Bokep ${selectedCategory} Gratis HD Indonesia Jepang China`
    const description = `Koleksi ${selectedCategory} terlengkap ${totalVideos.toLocaleString()} video bokep ${selectedCategory} terbaru. Streaming gratis HD nonton bokep ${selectedCategory} Indonesia, Jepang, China tanpa buffering. Update harian!`
    
    return { title, description, keywords: keywords.join(', ') }
  }

  const meta = getCategoryMeta(selectedCategory)
  const breadcrumbTitle = selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Bokep` : 'Kategori Bokep'

  if (loading && !categoriesList.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-primary rounded-full" />
      </div>
    )
  }

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={`bokep ${selectedCategory}, nonton ${selectedCategory}, video porno ${selectedCategory}, ${meta.keywords}`} />
        
        {/* Open Graph for Social Sharing */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yoursite.com/kategori/${categorySlug}`} />
        
        {/* Schema.org Breadcrumb */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yoursite.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": breadcrumbTitle,
                "item": `https://yoursite.com/kategori/${categorySlug}`
              }
            ]
          })
        }} />
        
        {/* Category-specific Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${selectedCategory} Videos`,
            "description": meta.description,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": totalVideos,
              "itemListElement": filteredVideos.slice(0, 10).map((video: Video, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "VideoObject",
                  "name": video.title,
                  "thumbnailUrl": video.thumbnail,
                  "contentUrl": video.url
                }
              }))
            }
          })
        }} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-pink-900/30">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="group p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all hover:scale-110 shadow-lg border border-white/20">
                  <ArrowLeft size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                </Link>
                <div>
                  <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/70 mb-2 hidden md:flex">
                    <Link href="/" className="hover:text-white transition">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-white">{breadcrumbTitle}</span>
                  </nav>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Bokep {selectedCategory}
                  </h1>
                  <p className="text-xl text-white/80 mt-2">
                    {totalVideos.toLocaleString()} Video {selectedCategory} Terbaru - Update Harian
                  </p>
                </div>
              </div>
              <MobileMenu />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Category Filter - Above the Fold */}
          <section className="mb-16 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Filter className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Pilih Kategori Bokep</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
              {categoriesList.map((category) => {
                const isActive = selectedCategory === category.name
                const keywords = categoryKeywords[category.name.toLowerCase()] || []
                
                return (
                  <Link
                    key={category.id}
                    href={`/kategori/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedCategory(category.name)
                    }}
                    className={`group relative p-6 rounded-2xl font-bold text-center transition-all shadow-lg border-2 hover:shadow-2xl cursor-pointer h-full min-h-[140px] flex flex-col justify-center ${
                      isActive
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-purple-500/25 text-white ring-4 ring-purple-500/30'
                        : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-purple-400/50 text-white/90 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl -z-10" />
                    )}
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="font-black text-lg leading-tight">{category.name}</div>
                    {isActive && (
                      <div className="mt-2 px-3 py-1 bg-black/50 rounded-full text-xs uppercase tracking-wider">
                        TERPILIH
                      </div>
                    )}
                    {!isActive && keywords.length > 0 && (
                      <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-purple-300">
                        {keywords[0]}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Video Grid with Stats */}
          <section>
            <div className="mb-12 flex flex-wrap items-center justify-between gap-4 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                  <Eye className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">
                    {selectedCategory} Videos ({totalVideos.toLocaleString()})
                  </h2>
                  <p className="text-lg text-white/70">
                    Video bokep {selectedCategory.toLowerCase()} terbaru - Streaming HD gratis
                  </p>
                </div>
              </div>
              
              <SortFilter 
                currentSort={sort} 
                onSortChange={setSort}
                className="min-w-[200px]"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-2xl h-64 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted/50 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredVideos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
                  {filteredVideos.map((video) => (
                    <Link key={video.id} href={`/video/${video.id}`} className="group">
                      <VideoCard video={video} />
                    </Link>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-black/40 rounded-3xl border-2 border-dashed border-white/20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-white/10 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                    <Filter className="w-12 h-12 text-white/50" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Belum ada video {selectedCategory}
                  </h3>
                  <p className="text-lg text-white/70 mb-8">
                    Video bokep {selectedCategory.toLowerCase()} akan segera hadir. Cek kategori lain!
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {categoriesList.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/kategori/${cat.slug}`}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 border border-white/30 text-white font-semibold transition-all hover:scale-105"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedCategory(cat.name)
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SEO Content Booster */}
          {filteredVideos.length > 0 && (
            <section className="mt-20 bg-black/50 backdrop-blur-xl rounded-3xl border border-white/20 p-12">
              <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Koleksi {selectedCategory} Terlengkap
              </h2>
              <div className="max-w-4xl mx-auto text-center text-xl text-white/90 leading-relaxed">
                <p className="mb-8">
                  Temukan ribuan video bokep {selectedCategory.toLowerCase()} terupdate setiap hari. 
                  Streaming gratis HD tanpa buffering untuk koleksi video dewasa{' '}
                  <strong>Indonesia, Jepang, China</strong> dan berbagai kategori lainnya.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                    <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Update Harian</h3>
                    <p className="text-white/80">Video {selectedCategory} terbaru setiap hari</p>
                  </div>
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                    <Eye className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">HD Quality</h3>
                    <p className="text-white/80">Streaming 720p/1080p tanpa gangguan</p>
                  </div>
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                    <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Gratis Selamanya</h3>
                    <p className="text-white/80">Nonton bokep {selectedCategory} tanpa biaya</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

// Enable static generation for better SEO
export async function generateStaticParams() {
  // Generate static paths for popular categories
  const popularCategories = ['indonesia', 'jepang', 'china', 'abar', 'asia']
  return popularCategories.map(slug => ({ slug }))
}