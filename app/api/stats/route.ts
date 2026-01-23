import { NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const totalVideosRes = await query('SELECT count(*)::int as count FROM videos')
    const totalUsersRes = await query('SELECT count(*)::int as count FROM users')
    const totalCategoriesRes = await query('SELECT count(*)::int as count FROM categories')
    
    // We can also get counts per category for the dashboard
    const categoriesRes = await query('SELECT id, name FROM categories')
    const videosPerCategory = await Promise.all(
      categoriesRes.rows.map(async (cat: any) => {
        const countRes = await query('SELECT count(*)::int as count FROM videos WHERE category_id = $1', [cat.id])
        return {
          name: cat.name,
          count: countRes.rows[0].count
        }
      })
    )

    return NextResponse.json({
      totalVideos: totalVideosRes.rows[0].count,
      totalUsers: totalUsersRes.rows[0].count,
      totalCategories: totalCategoriesRes.rows[0].count,
      videosPerCategory,
      views: 0 // Placeholder or fetch from a views tracking table if available
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
