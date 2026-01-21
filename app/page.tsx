import { HeroBanner } from '@/components/hero-banner'
import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'
import { Pagination } from '@/components/pagination'
import { SortFilter } from '@/components/sort-filter'
import { AdBanner } from '@/components/ad-banner'
import { query } from '@/lib/postgres'
import { ChevronDown, LogIn, User } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/session'

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

  const currentUser: any = null // getCurrentUser() is client-only as it uses localStorage

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-background transform rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight">StreamFlix</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/kategori" className="hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-64">
              <SearchBar initialValue={search} />
            </div>
            {currentUser ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                {currentUser.image ? (
                  <img
                    src={currentUser.image || "/placeholder.svg"}
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-full border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <span>{currentUser.username}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors"
              >
                Sign In
              </Link>
            )}
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <section className="mb-8">
          <HeroBanner />
        </section>

        {/* Top Advertisement Banner */}
        <section className="mb-8">
          <AdBanner position="top" />
        </section>

        {/* Search and Filter Section */}
        <section className="mb-12 space-y-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-px no-scrollbar">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                !selectedCategory
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              {!selectedCategory && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.name)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
                {selectedCategory === cat.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Videos Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedCategory ? `${selectedCategory} Videos` : 'Popular Videos'}
            </h2>
            <div className="flex items-center gap-4">
               <SortFilter currentSort={sort} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {videos.length > 0 ? (
              videos.map((video: any) => (
                <Link
                  key={video.id}
                  href={`/video/${video.id}`}
                >
                  <VideoCard video={video} />
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

        {/* Bottom Advertisement */}
        <section className="mt-12">
          <AdBanner position="bottom" />
        </section>
      </div>
    </main>
  )
}
