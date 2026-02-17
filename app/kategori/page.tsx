import { query } from '@/lib/postgres'
import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { ForceRefreshPagination } from '@/components/force-refresh-pagination'
import { ForceRefreshLink } from '@/components/force-refresh-link'
import { AdsterraBanner } from '@/components/adsterra-banner-inline'
import { HeaderUser } from '@/components/header-user'
import { getCurrentUser } from '@/lib/session'

// Fetch categories from database
async function getCategories() {
  try {
    const result = await query(
      `SELECT DISTINCT c.id, c.name, c.slug, COUNT(v.id) as video_count
       FROM categories c
       LEFT JOIN video_categories vc ON c.id = vc.category_id
       LEFT JOIN videos v ON vc.video_id = v.id
       GROUP BY c.id, c.name, c.slug
       ORDER BY c.name`
    )
    return result.rows
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Fetch videos for each category
async function getVideosByCategory(categoryName: string, page: number = 1, limit: number = 12) {
  try {
    const offset = (page - 1) * limit
    const result = await query(
      `SELECT v.*, c.name as category, c.slug as category_slug
       FROM videos v
       JOIN video_categories vc ON v.id = vc.video_id
       JOIN categories c ON vc.category_id = c.id
       WHERE c.name = $1
       ORDER BY v.created_at DESC
       LIMIT $2 OFFSET $3`,
      [categoryName, limit, offset]
    )
    return result.rows
  } catch (error) {
    console.error('Error fetching videos by category:', error)
    return []
  }
}

// Get total count for pagination
async function getVideosCountByCategory(categoryName: string) {
  try {
    const result = await query(
      `SELECT COUNT(v.id) as total
       FROM videos v
       JOIN video_categories vc ON v.id = vc.video_id
       JOIN categories c ON vc.category_id = c.id
       WHERE c.name = $1`,
      [categoryName]
    )
    return parseInt(result.rows[0]?.total || '0')
  } catch (error) {
    console.error('Error fetching videos count by category:', error)
    return 0
  }
}

export default async function KategoriPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1')
  const selectedCategory = searchParams.category
  const limit = 12

  // Get all categories
  const categories = await getCategories()

  // Pagination for categories (show only 8 per page)
  const categoriesPerPage = 8
  const totalCategories = categories.length
  const categoryTotalPages = Math.ceil(totalCategories / categoriesPerPage)
  const categoryOffset = (currentPage - 1) * categoriesPerPage
  const paginatedCategories = categories.slice(categoryOffset, categoryOffset + categoriesPerPage)

  // Get videos for selected category
  let videos: any[] = []
  let totalCount = 0
  let currentCategoryName = ''

  if (selectedCategory) {
    videos = await getVideosByCategory(selectedCategory, currentPage, limit)
    totalCount = await getVideosCountByCategory(selectedCategory)
    const category = categories.find((cat: any) => cat.name === selectedCategory)
    currentCategoryName = category?.name || ''
  }

  const totalPages = selectedCategory ? Math.ceil(totalCount / limit) : categoryTotalPages

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <ForceRefreshLink href="/" className="text-xl font-bold text-primary">
                BokepIndonesia
              </ForceRefreshLink>
              <nav className="hidden md:flex items-center gap-6">
                <ForceRefreshLink
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Home
                </ForceRefreshLink>
                <ForceRefreshLink
                  href="/kategori"
                  className="text-sm font-medium text-foreground transition"
                >
                  Kategori
                </ForceRefreshLink>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
              <HeaderUser />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-balance">
                {selectedCategory ? `Kategori: ${currentCategoryName}` : 'Semua Kategori'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {selectedCategory 
                  ? `${totalCount} video dalam kategori ${currentCategoryName}`
                  : 'Pilih kategori untuk menemukan video favorit Anda'
                }
              </p>
            </div>

            {/* Top Banner Ads */}
            <div className="flex flex-col items-center gap-2 sm:gap-4 w-full overflow-hidden mb-4 sm:mb-6">
              <div className='flex flex-wrap justify-center gap-2 sm:gap-2 w-full overflow-hidden mb-4 sm:mb-4'>
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
              </div>
            </div>

            {!selectedCategory ? (
              // Category Grid View
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedCategories.map((category: any) => (
                    <ForceRefreshLink
                      key={category.id}
                      href={`/?category=${encodeURIComponent(category.name)}`}
                      className="group block"
                    >
                      <div className="bg-muted/30 hover:bg-muted/50 rounded-xl p-6 border border-border/50 hover:border-border transition-all duration-300">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <span className="text-2xl font-bold text-primary">
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-balance mb-2 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.video_count} video
                          </p>
                        </div>
                      </div>
                    </ForceRefreshLink>
                  ))}
                </div>

                {/* Pagination for Categories */}
                {categoryTotalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <ForceRefreshPagination
                      currentPage={currentPage}
                      totalPages={categoryTotalPages}
                    />
                  </div>
                )}
              </>
            ) : (
              // Videos Grid View
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <ForceRefreshPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                  </div>
                )}
              </>
            )}

            {/* Bottom Banner Ads */}
            <div className="mt-8 flex flex-col items-center gap-2 sm:gap-4 w-full overflow-hidden">
              <div className='flex flex-wrap justify-center gap-2 sm:gap-2 w-full overflow-hidden mb-4 sm:mb-6'>
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
                <AdsterraBanner format="468x60" />
              </div>
            </div>
          </div>

          {/* Sidebar untuk iklan */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0">
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
    </main>
  )
}
