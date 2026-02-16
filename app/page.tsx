import { HeroBanner } from '@/components/hero-banner'
import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'
import { Pagination } from '@/components/pagination'
import { SortFilter } from '@/components/sort-filter'
import { SmartlinkRotator } from '@/components/smartlink-rotator'
import { query } from '@/lib/postgres'
import { ChevronDown, LogIn, User } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import { HeaderUser } from '@/components/header-user'
import { getCurrentUser } from '@/lib/session'
import { BannerPlaceholder } from '@/components/banner-placeholder'
import { DynamicAds } from '@/components/dynamic-ads'
import { AdsterraBanner } from '@/components/adsterra-banner'
import AdScript from '@/components/ad-script'

export const revalidate = 3600 // Revalidate home page every hour

async function getCategories() {
  const { rows } = await query('SELECT * FROM categories ORDER BY name ASC')
  return rows
}

async function getVideos(search?: string, category?: string, page: number = 1, sort: string = 'newest') {
  const limit = 8
  const offset = (page - 1) * limit
  let sql = `
    SELECT v.*, 
    ARRAY(SELECT c.name FROM categories c JOIN video_categories vc ON c.id = vc.category_id WHERE vc.video_id = v.id) as categories 
    FROM videos v 
    WHERE 1=1
  `
  const params: any[] = []

  if (search) {
    params.push(`%${search}%`)
    sql += ` AND (v.title ILIKE $${params.length} OR v.description ILIKE $${params.length})`
  }

  if (category) {
    params.push(category)
    sql += ` AND EXISTS (SELECT 1 FROM video_categories vc JOIN categories c ON vc.category_id = c.id WHERE vc.video_id = v.id AND c.name = $${params.length})`
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

  // Ensure all video URLs are MP4 format
  const processedVideos = videoRows.map(video => {
    if (video.url) {
      // Convert HLS to MP4
      if (video.url.includes('.m3u8')) {
        video.url = video.url.replace(/\.m3u8$/, '.mp4')
      }
      // Ensure it has proper uploads path
      if (!video.url.startsWith('/uploads/') && !video.url.startsWith('http')) {
        video.url = `/uploads/${video.url}`
      }
    }
    return video
  })

  return {
    videos: processedVideos,
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

  const [categoriesResult, videosResult] = await Promise.allSettled([
    getCategories(),
    getVideos(search, selectedCategory, currentPage, sort)
  ])

  const categories = categoriesResult.status === 'fulfilled' ? (categoriesResult.value || []) : []
  const videosData = videosResult.status === 'fulfilled' ? (videosResult.value || { videos: [], pagination: { totalCount: 0, totalPages: 0, currentPage: 1 } }) : { videos: [], pagination: { totalCount: 0, totalPages: 0, currentPage: 1 } }
  const videos = videosData.videos || []
  const pagination = videosData.pagination || { totalCount: 0, totalPages: 0, currentPage: 1 }

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
              <span className="text-xl font-bold tracking-tight text-white">BokepIndonesia</span>
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

      {/* Popunder & Social Bar (Fixed Position/Head) */}
      <AdScript adKey="4388c91d89682a21f68164b288c042f9" format="js" />
      <AdScript adKey="9add34aad611a8243e9fa65055bde309" format="js" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="sr-only">BokepIndonesia - Nonton Video Online Terlengkap</h1>
            
            {/* Top Banner Ads */}
            <div className="flex flex-col items-center gap-4 w-full overflow-hidden mb-6">
              <div className="w-full overflow-hidden flex justify-center">
                <AdScript adKey="5a8dd45e78414c6e5be9db9eaffed61f" format="iframe" height={90} width={728} />
              </div>
              <div className="w-full overflow-hidden flex justify-center">
                <AdScript adKey="1ad6f564f3ca7bb42752dba86368d149" format="iframe" height={250} width={300} />
              </div>
              {/* Banner 728x90 - ID: 28622405 */}
              <div className="w-full overflow-hidden flex justify-center">
                <AdScript adKey="28622405" format="iframe" height={90} width={728} />
              </div>
            </div>

            {/* Smartlinks Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 w-full">
              <SmartlinkRotator />
              <SmartlinkRotator />
              <SmartlinkRotator />
            </div>

            {/* Middle Banner Ads */}
            <div className="flex flex-col items-center gap-4 w-full overflow-hidden mb-8">
              {/* Banner 468x60 - ID: 28628094 */}
              <div className="w-full overflow-hidden flex justify-center">
                <AdScript adKey="28628094" format="iframe" height={60} width={468} />
              </div>
              {/* Banner 300x250 - ID: 28622523 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <div className="flex justify-center">
                  <AdScript adKey="28622523" format="iframe" height={250} width={300} />
                </div>
                <div className="flex justify-center">
                  <AdScript adKey="28622523" format="iframe" height={250} width={300} />
                </div>
                <div className="flex justify-center">
                  <AdScript adKey="28622523" format="iframe" height={250} width={300} />
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <section className="mb-8 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px no-scrollbar">
                <Link
                  href="/"
                  className={`px-5 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
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
              
              <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
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
              
              {/* Native Banner - Paling Bawah */}
              <div className="mt-12 mb-8 flex justify-center">
                <div className="w-full max-w-[728px]">
                  <div 
                    dangerouslySetInnerHTML={{
                      __html: `
                        <script async="async" data-cfasync="false" src="https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"></script>
                        <div id="container-c08de902b7930682919199d915646b97"></div>
                      `
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
          
          <aside className="hidden xl:block w-[160px] flex-shrink-0 pt-20">
            <div className="sticky top-24 flex flex-col gap-8">
              {/* Banner 160x600 - ID: 28622417 */}
              <AdScript adKey="28622417" format="iframe" height={600} width={160} />
              {/* Banner 160x300 - ID: 28628104 */}
              <AdScript adKey="28628104" format="iframe" height={300} width={160} />
              {/* Banner 160x300 - Additional */}
              <AdScript adKey="28628104" format="iframe" height={300} width={160} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
