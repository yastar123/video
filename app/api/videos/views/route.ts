import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    await query(
      'UPDATE videos SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [videoId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating views:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
