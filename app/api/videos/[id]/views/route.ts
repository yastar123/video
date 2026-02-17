import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Get client IP for basic tracking
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check if video exists
    const videoResult = await query(
      'SELECT id, views FROM videos WHERE id = $1',
      [videoId]
    )

    if (videoResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Increment view count
    const updateResult = await query(
      'UPDATE videos SET views = views + 1 WHERE id = $1 RETURNING views',
      [videoId]
    )

    const newViewCount = updateResult.rows[0].views

    // Log view for analytics (optional)
    await query(
      `INSERT INTO video_views (video_id, ip_address, user_agent, created_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
       ON CONFLICT DO NOTHING`,
      [videoId, ip, request.headers.get('user-agent') || 'unknown']
    ).catch(() => {
      // Ignore errors for view logging table (might not exist)
    })

    return NextResponse.json({
      success: true,
      views: newViewCount,
      message: 'View count updated successfully'
    })

  } catch (error) {
    console.error('Error updating view count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Get current view count
    const result = await query(
      'SELECT views FROM videos WHERE id = $1',
      [videoId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      views: result.rows[0].views || 0
    })

  } catch (error) {
    console.error('Error getting view count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
