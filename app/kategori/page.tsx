'use client'

import { useEffect, useState } from 'react'
import { categories, videos } from '@/lib/db'
import type { Category, Video } from '@/lib/db'
import { VideoCard } from '@/components/video-card'
import { SortFilter } from '@/components/sort-filter'
import { Pagination } from '@/components/pagination'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MobileMenu } from '@/components/mobile-menu'

export default function KategoriPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Action')
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('newest')
  const limit = 8

  useEffect(() => {
    let filtered = videos.filter((v) => v.category === selectedCategory)

    // Apply sorting
    switch (sort) {
      case 'popular':
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'mostViewed':
        filtered = filtered.sort((a, b) => b.views - a.views)
        break
      case 'oldest':
        filtered = filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        break
      case 'newest':
      default:
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    // Apply pagination
    const total = filtered.length
    setTotalPages(Math.ceil(total / limit))
    const offset = (currentPage - 1) * limit
    setFilteredVideos(filtered.slice(offset, offset + limit))
  }, [selectedCategory, sort, currentPage])

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold text-primary">StreamFlix - Categories</h1>
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selection */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-lg font-medium transition text-center space-y-2 ${
                  selectedCategory === category.name
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="text-3xl">{category.icon}</div>
                <div>{category.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Videos for Selected Category */}
        <section>
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {selectedCategory} Videos
              </h2>
            </div>
            <SortFilter currentSort={sort} onSortChange={setSort} />
          </div>

          {filteredVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <Link key={video.id} href={`/video/${video.id}`}>
                    <VideoCard video={video} />
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground text-lg">
                No videos found in {selectedCategory}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
