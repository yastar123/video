import { HeroBanner } from '@/components/hero-banner'
import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'
import { Pagination } from '@/components/pagination'
import { SortFilter } from '@/components/sort-filter'
import { query } from '@/lib/postgres'
import { ChevronDown, LogIn, User } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import { HeaderUser } from '@/components/header-user'
import { getCurrentUser } from '@/lib/session'
import { BannerPlaceholder } from '@/components/banner-placeholder'

export const revalidate = 3600 // Revalidate home page every hour

async function getCategories() {
  const { rows } = await query('SELECT * FROM categories ORDER BY name ASC')
  return rows
}

async function getVideos(search?: string, category?: string, page: number = 1, sort: string = 'newest') {
  const limit = 8
  const offset = (page - 1) * limit
  let sql = 'SELECT v.*, c.name as category_name FROM videos v LEFT JOIN categories c ON v.category_id = c.id WHERE 1=1'
  const params: any[] = []

  if (search) {
    params.push(`%${search}%`)
    sql += ` AND (v.title ILIKE $${params.length} OR v.description ILIKE $${params.length})`
  }

  if (category) {
    params.push(category)
    sql += ` AND c.name = $${params.length}`
  }

  let orderBy = 'v.created_at DESC'
  if (sort === 'oldest') orderBy = 'v.created_at ASC'
  else if (sort === 'popular') orderBy = 'v.views DESC'
  else if (sort === 'rating') orderBy = 'v.rating DESC'

  const countSql = `SELECT COUNT(*) FROM (${sql}) as total`
  const { rows: countRows } = await query(countSql, params)
  const totalCount = parseInt(countRows[0].count)

  sql += ` ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  const { rows: videoRows } = await query(sql, params)

  return {
    videos: videoRows,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const selectedCategory = typeof params.category === 'string' ? params.category : undefined
  const currentPage = typeof params.page === 'string' ? parseInt(params.page) : 1
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'

  const [categories, { videos, pagination }] = await Promise.all([
    getCategories(),
    getVideos(search, selectedCategory, currentPage, sort)
  ])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img src="/assets/logo.jpg" alt="BokepIndonesia Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">a98h3g4</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/kategori" className="hover:text-white transition-colors">Genre</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-48 md:w-64">
              <SearchBar initialValue={search} />
            </div>
            <HeaderUser />
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="sr-only">BokepIndonesia - Nonton Video Online Terlengkap</h1>
        
        {/* Hero Section with side-by-side Announcements */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeroBanner />
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Pengumuman</h3>
                <Link href="/pengumuman" className="text-sm text-gray-400 hover:text-white transition-colors">Semua</Link>
              </div>
              <div className="space-y-4 flex-1">
                {[
                  { title: "Premium Sekarang Cuma 12500!!!", date: "16 November 2025" },
                  { title: "Pengumuman Rekrutmen Pengembangan Aplikasi", date: "03 August 2025" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                    <div className="w-16 h-16 bg-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0">
                      <img src="/assets/logo.jpg" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px no-scrollbar">
            <Link
              href="/"
              className={`px-5 py-3 text-sm font-medium transition-all relative ${
                !selectedCategory
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
              {!selectedCategory && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.name)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-5 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat.name}
                {selectedCategory === cat.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Videos Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">
                {selectedCategory ? `${selectedCategory}` : 'Popular Now'}
              </h2>
              <p className="text-gray-400 text-sm">
                {videos.length} videos
              </p>
            </div>
            <div className="flex items-center gap-4">
               <SortFilter currentSort={sort} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {videos.length > 0 ? (
              videos.map((video: any, index: number) => (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                >
                  <VideoCard 
                    video={video} 
                    priority={index < 4}
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-400">No results found.</p>
              </div>
            )}
          </div>
          {videos.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
