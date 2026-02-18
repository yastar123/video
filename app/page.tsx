import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'
import { ForceRefreshPagination } from '@/components/force-refresh-pagination'
import { SortFilter } from '@/components/sort-filter'
import { query } from '@/lib/postgres'
import { ChevronDown, LogIn, User } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'
import { ForceRefreshLink } from '@/components/force-refresh-link'
import { HeaderUser } from '@/components/header-user'
import { getCurrentUser } from '@/lib/session'
import { DynamicAds } from '@/components/dynamic-ads'
import { AdsterraBanner } from '@/components/adsterra-banner-inline'
import AdsterraAd from '@/components/adsterra-ad'
import { Metadata } from 'next'

export const revalidate = 3600 // Revalidate home page every hour

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const selectedCategory = typeof params.category === 'string' ? params.category : undefined
  const search = typeof params.search === 'string' ? params.search : undefined

  if (selectedCategory) {
    return {
      title: `Video ${selectedCategory} Terbaru`,
      description: `Kumpulan video bokep ${selectedCategory} terbaru dan terlengkap. Streaming video ${selectedCategory} HD gratis hanya di BokepIndonesia. Update harian dengan kualitas terbaik.`,
      keywords: `bokep ${selectedCategory}, video ${selectedCategory}, nonton ${selectedCategory}, streaming ${selectedCategory}, ${selectedCategory} terbaru, ${selectedCategory} HD, bokepindonesia, streaming gratis`,
      alternates: {
        canonical: `/?category=${encodeURIComponent(selectedCategory)}`
      },
      other: {
        'og:updated_time': new Date().toISOString(),
        'lastmod': new Date().toISOString(),
      },
      openGraph: {
        title: `Video ${selectedCategory} Terbaru - BokepIndonesia`,
        description: `Kumpulan video bokep ${selectedCategory} terbaru dan terlengkap. Streaming video ${selectedCategory} HD gratis.`,
        url: `https://bokepindonesia.my.id/?category=${encodeURIComponent(selectedCategory)}`,
        type: 'website',
        siteName: 'BokepIndonesia',
        locale: 'id_ID',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Video ${selectedCategory} Terbaru - BokepIndonesia`,
        description: `Kumpulan video bokep ${selectedCategory} terbaru dan terlengkap.`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  }

  if (search) {
    return {
      title: `Search: ${search}`,
      description: `Hasil pencarian video bokep "${search}". Streaming video terbaru Indonesia, Jepang, China, dan lainnya secara gratis. Temukan video favorit kamu di BokepIndonesia.`,
      keywords: `search ${search}, cari video ${search}, nonton ${search}, streaming ${search}, bokep ${search}, bokepindonesia, video terbaru, streaming gratis`,
      alternates: {
        canonical: `/?search=${encodeURIComponent(search)}`
      },
      other: {
        'og:updated_time': new Date().toISOString(),
        'lastmod': new Date().toISOString(),
      },
      openGraph: {
        title: `Search: ${search} - BokepIndonesia`,
        description: `Hasil pencarian video bokep "${search}". Streaming video terbaru.`,
        url: `https://bokepindonesia.my.id/?search=${encodeURIComponent(search)}`,
        type: 'website',
        siteName: 'BokepIndonesia',
        locale: 'id_ID',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Search: ${search} - BokepIndonesia`,
        description: `Hasil pencarian video bokep "${search}".`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  }

  return {
    title: 'Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN. Update harian dengan konten terlengkap.',
    keywords: 'bokepindonesia, nonton video, bokep indonesia, bokep jepang, bokep china, streaming video terbaru, video dewasa, film porno, streaming gratis, video HD',
    alternates: {
      canonical: '/'
    },
    other: {
      'og:updated_time': new Date().toISOString(),
      'lastmod': new Date().toISOString(),
    },
    openGraph: {
      title: 'BokepIndonesia - Nonton Video Online Terlengkap',
      description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
      url: 'https://bokepindonesia.my.id',
      type: 'website',
      siteName: 'BokepIndonesia',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'BokepIndonesia - Nonton Video Online Terlengkap',
      description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <ForceRefreshLink href="/" className="flex items-center gap-1 sm:gap-2 group">
              <div className="w-6 h-6 sm:w-8 sm:h-8 overflow-hidden rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img src="/assets/logo.jpg" alt="BokepIndonesia Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">BokepIndonesia</span>
            </ForceRefreshLink>
            <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium text-gray-400">
              <ForceRefreshLink href="/" className="hover:text-white transition-colors">Home</ForceRefreshLink>
              <ForceRefreshLink href="/kategori" className="hover:text-white transition-colors">Genre</ForceRefreshLink>
              <ForceRefreshLink href="/?category=Indonesia" className="hover:text-white transition-colors">Indonesia</ForceRefreshLink>
              <ForceRefreshLink href="/?category=Jepang" className="hover:text-white transition-colors">Jepang</ForceRefreshLink>
              <ForceRefreshLink href="/?category=China" className="hover:text-white transition-colors">China</ForceRefreshLink>
              <ForceRefreshLink href="/?category=Korea" className="hover:text-white transition-colors">Korea</ForceRefreshLink>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block w-32 md:w-48 lg:w-64">
              <SearchBar initialValue={search} />
            </div>
            <HeaderUser />
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Main H1 Heading */}
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2">
                {selectedCategory ? `Video ${selectedCategory} Terbaru` : 'Nonton Video Bokep Indonesia Terlengkap'}
              </h1>
              <p className="text-gray-400 text-center text-sm sm:text-base max-w-2xl mx-auto">
                {selectedCategory 
                  ? `Kumpulan video bokep ${selectedCategory} terbaru dan terlengkap. Streaming HD gratis.`
                  : 'Streaming video bokep Indonesia, Jepang, China terbaru dan terlengkap. Kualitas HD tanpa VPN.'
                }
              </p>
            </header>
            
            {/* Top Banner Ads */}
            <div className="flex flex-col items-center gap-2 sm:gap-4 w-full overflow-hidden mb-4 sm:mb-6">
              {/* Banner 468x60 - ID: a8ea859722150189e57a87b6579578f3 */}
              <div className='flex flex-wrap justify-center gap-2 sm:gap-4 w-full overflow-hidden mb-4 sm:mb-4'>
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
              </div>
            </div>

            
            {/* Middle Banner Ads */}

            {/* Search and Filter Section */}
            <section className="mb-8 overflow-hidden">
              <h2 className="text-lg font-semibold text-white mb-4">Filter Video</h2>
              <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px no-scrollbar">
                <ForceRefreshLink
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
                </ForceRefreshLink>
                {categories.map((cat: any) => (
                  <ForceRefreshLink
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
                  </ForceRefreshLink>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 w-full">
                {videos.length > 0 ? (
                  videos.map((video: any, index: number) => (
                    <ForceRefreshLink
                      key={video.id}
                      href={`/video/${video.id}`}
                      className="w-full max-w-full overflow-hidden"
                    >
                      <VideoCard 
                        video={video} 
                        priority={index < 4}
                      />
                    </ForceRefreshLink>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-400">No results found.</p>
                  </div>
                )}
              </div>
              {videos.length > 0 && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <ForceRefreshPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
              
              {/* Banner 468x60 - ID: a8ea859722150189e57a87b6579578f3 */}
              <div className='flex flex-wrap justify-center gap-2 sm:gap-4 w-full overflow-hidden mb-4 sm:mb-6 mt-4 sm:mt-6'>
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
              </div>
          </section>
          </div>
          
          <aside className="hidden xl:block w-[160px] flex-shrink-0 ">
            <div className="sticky top-24 flex flex-col gap-8">
              {/* Banner 160x600 - ID: 22bed31723f24472a78afb44a7addb6b */}
              <AdsterraBanner format="160x600" />
              {/* Banner 160x300 - ID: 6e9a519272442fa242b5a43e53ddc7fd */}
              <AdsterraBanner format="160x300" />
              {/* Banner 160x300 - Additional */}
              <AdsterraBanner format="160x300" />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer with Internal Links */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Kategori Populer</h3>
              <ul className="space-y-2">
                <li><ForceRefreshLink href="/?category=Indonesia" className="text-gray-400 hover:text-white text-sm transition-colors">Video Indonesia</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=Jepang" className="text-gray-400 hover:text-white text-sm transition-colors">Video Jepang</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=China" className="text-gray-400 hover:text-white text-sm transition-colors">Video China</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=Korea" className="text-gray-400 hover:text-white text-sm transition-colors">Video Korea</ForceRefreshLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Genre</h3>
              <ul className="space-y-2">
                <li><ForceRefreshLink href="/kategori" className="text-gray-400 hover:text-white text-sm transition-colors">Semua Genre</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=Hijab" className="text-gray-400 hover:text-white text-sm transition-colors">Hijab</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=Asian" className="text-gray-400 hover:text-white text-sm transition-colors">Asian</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?category=Western" className="text-gray-400 hover:text-white text-sm transition-colors">Western</ForceRefreshLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Navigasi</h3>
              <ul className="space-y-2">
                <li><ForceRefreshLink href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/kategori" className="text-gray-400 hover:text-white text-sm transition-colors">Kategori</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?sort=newest" className="text-gray-400 hover:text-white text-sm transition-colors">Video Terbaru</ForceRefreshLink></li>
                <li><ForceRefreshLink href="/?sort=popular" className="text-gray-400 hover:text-white text-sm transition-colors">Video Populer</ForceRefreshLink></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Tentang</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400 text-sm">BokepIndonesia</span></li>
                <li><span className="text-gray-400 text-sm">Streaming Video HD</span></li>
                <li><span className="text-gray-400 text-sm">Update Harian</span></li>
                <li><span className="text-gray-400 text-sm">100% Gratis</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">© 2024 BokepIndonesia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
