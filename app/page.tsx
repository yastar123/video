'use client'

import { useEffect, useState } from 'react'
import { HeroBanner } from '@/components/hero-banner'
import { VideoCard } from '@/components/video-card'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'
import { Pagination } from '@/components/pagination'
import { SortFilter } from '@/components/sort-filter'
import { AdBanner } from '@/components/ad-banner'
import type { Video, Category } from '@/lib/db'
import { ChevronDown, LogIn, User } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/session'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('newest')
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  // Check current user
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  // Fetch videos
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (selectedCategory) params.append('category', selectedCategory)
    params.append('page', currentPage.toString())
    params.append('sort', sort)
    params.append('limit', '8')

    setLoading(true)
    fetch(`/api/videos?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setLoading(false)
      })
  }, [search, selectedCategory, currentPage, sort])

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedCategory])

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
              <a href="/" className="hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/kategori" className="hover:text-foreground transition-colors">
                Categories
              </a>
              <a href="/admin" className="hover:text-foreground transition-colors">
                Dashboard
              </a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-64">
              <SearchBar onSearch={setSearch} />
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
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                selectedCategory === ''
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              {selectedCategory === '' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
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
              </button>
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
               <SortFilter currentSort={sort} onSortChange={setSort} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video bg-secondary animate-pulse rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-secondary animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : videos.length > 0 ? (
              videos.map((video) => (
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
          {videos.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
