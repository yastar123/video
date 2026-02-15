import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const offset = (page - 1) * limit

    const { rows: videos } = await query(
      `SELECT v.*, 
       ARRAY(SELECT c.name FROM categories c JOIN video_categories vc ON c.id = vc.category_id WHERE vc.video_id = v.id) as categories,
       ARRAY(SELECT c.id FROM categories c JOIN video_categories vc ON c.id = vc.category_id WHERE vc.video_id = v.id) as category_ids
       FROM videos v ORDER BY v.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    
    const { rows: countRows } = await query('SELECT COUNT(*) FROM videos')
    const totalCount = parseInt(countRows[0].count)

    return NextResponse.json({
      videos,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, thumbnail, category_ids, url } = body

    if (!title || !category_ids || !Array.isArray(category_ids) || category_ids.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (thumbnail && thumbnail.startsWith('data:')) {
      return NextResponse.json({ error: 'Base64 data URLs are not allowed. Please upload the image file first.' }, { status: 400 })
    }

    const { rows } = await query(
      'INSERT INTO videos (title, description, thumbnail, url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || '', thumbnail || '', url || '']
    )
    
    const videoId = rows[0].id
    
    // Insert categories
    for (const catId of category_ids) {
      await query('INSERT INTO video_categories (video_id, category_id) VALUES ($1, $2)', [videoId, catId])
    }

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, thumbnail, category_ids, url } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (thumbnail && thumbnail.startsWith('data:')) {
      return NextResponse.json({ error: 'Base64 data URLs are not allowed. Please upload the image file first.' }, { status: 400 })
    }

    const { rows } = await query(
      'UPDATE videos SET title = $1, description = $2, thumbnail = $3, url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, description || '', thumbnail || '', url || '', id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Update categories
    await query('DELETE FROM video_categories WHERE video_id = $1', [id])
    if (category_ids && Array.isArray(category_ids)) {
      for (const catId of category_ids) {
        await query('INSERT INTO video_categories (video_id, category_id) VALUES ($1, $2)', [id, catId])
      }
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await query('DELETE FROM videos WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
