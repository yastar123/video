import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  try {
    // Get total views
    const totalViewsResult = await query(`
      SELECT SUM(views) as total_views 
      FROM videos
    `)
    const totalViews = parseInt(totalViewsResult.rows[0]?.total_views || '0')

    // Get today's views
    const todayViewsResult = await query(`
      SELECT COUNT(*) as today_views 
      FROM video_views 
      WHERE DATE(created_at) = CURRENT_DATE
    `)
    const todayViews = parseInt(todayViewsResult.rows[0]?.today_views || '0')

    // Get weekly views
    const weeklyViewsResult = await query(`
      SELECT COUNT(*) as weekly_views 
      FROM video_views 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `)
    const weeklyViews = parseInt(weeklyViewsResult.rows[0]?.weekly_views || '0')

    // Get monthly views
    const monthlyViewsResult = await query(`
      SELECT COUNT(*) as monthly_views 
      FROM video_views 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `)
    const monthlyViews = parseInt(monthlyViewsResult.rows[0]?.monthly_views || '0')

    // Get top videos
    const topVideosResult = await query(`
      SELECT id, title, views 
      FROM videos 
      WHERE views > 0 
      ORDER BY views DESC 
      LIMIT 10
    `)

    const topVideos = topVideosResult.rows.map((video: any) => ({
      id: video.id.toString(),
      title: video.title,
      views: parseInt(video.views || '0')
    }))

    // Get views by category
    const categoryViewsResult = await query(`
      SELECT 
        c.name as category,
        COALESCE(SUM(v.views), 0) as total_views,
        COUNT(v.id) as video_count
      FROM categories c
      LEFT JOIN videos v ON c.id = v.category_id
      GROUP BY c.id, c.name
      ORDER BY total_views DESC
      LIMIT 10
    `)

    const categoryViews = categoryViewsResult.rows.map((cat: any) => ({
      category: cat.category,
      totalViews: parseInt(cat.total_views || '0'),
      videoCount: parseInt(cat.video_count || '0')
    }))

    // Get daily views for the last 30 days
    const dailyViewsResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views
      FROM video_views 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    const dailyViews = dailyViewsResult.rows.map((day: any) => ({
      date: day.date,
      views: parseInt(day.views || '0')
    }))

    return NextResponse.json({
      success: true,
      totalViews,
      todayViews,
      weeklyViews,
      monthlyViews,
      topVideos,
      categoryViews,
      dailyViews,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching view statistics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        totalViews: 0,
        todayViews: 0,
        weeklyViews: 0,
        monthlyViews: 0,
        topVideos: [],
        categoryViews: [],
        dailyViews: []
      },
      { status: 500 }
    )
  }
}
