import { NextRequest, NextResponse } from 'next/server'
import { videos } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '8')
  const sort = searchParams.get('sort') || 'newest' // newest, popular, oldest, mostViewed

  let filtered = videos

  // Filter by search query
  if (search) {
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search)
    )
  }

  // Filter by category
  if (category) {
    filtered = filtered.filter((v) => v.category === category)
  }

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
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedVideos = filtered.slice(offset, offset + limit)

  return NextResponse.json({
    videos: paginatedVideos,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  })
}
