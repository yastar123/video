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
    <main className="min-h-screen bg-background vercel-gradient">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 overflow-hidden rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-foreground/10">
                <img src="/assets/logo.jpg" alt="Ruang Malam Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight">Ruang Malam</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-all hover:translate-y-[-1px]">Home</Link>
              <Link href="/kategori" className="hover:text-foreground transition-all hover:translate-y-[-1px]">Categories</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden sm:block w-48 md:w-72">
              <SearchBar initialValue={search} />
            </div>
            <div className="h-6 w-[1px] bg-border/50 hidden sm:block" />
            <HeaderUser />
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Banner */}
        <section className="mb-12">
          <HeroBanner />
        </section>

        {/* Search and Filter Section */}
        <section className="mb-16">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-px no-scrollbar">
            <Link
              href="/"
              className={`px-5 py-3 text-sm font-medium transition-all relative ${
                !selectedCategory
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              {!selectedCategory && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.name)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-5 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
                {selectedCategory === cat.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Videos Grid */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                {selectedCategory ? `${selectedCategory}` : 'Popular Now'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {videos.length} videos available in this collection
              </p>
            </div>
            <div className="flex items-center gap-4">
               <SortFilter currentSort={sort} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12">
            {videos.length > 0 ? (
              videos.map((video: any, index: number) => (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                >
                  <VideoCard 
                    video={video} 
                    priority={index < 4} // Load first 4 images with priority
                  />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No results found.</p>
              </div>
            )}
          </div>
          {videos.length > 0 && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </section>
      </div>
    </main>
  )
}
