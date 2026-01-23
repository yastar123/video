import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const { rows } = await query('SELECT v.*, c.name as category FROM videos v LEFT JOIN categories c ON v.category_id = c.id ORDER BY v.created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, thumbnail, category, url } = body

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (thumbnail && thumbnail.startsWith('data:')) {
      return NextResponse.json({ error: 'Base64 data URLs are not allowed. Please upload the image file first.' }, { status: 400 })
    }

    // Find category ID
    const catRes = await query('SELECT id FROM categories WHERE name = $1', [category])
    const categoryId = catRes.rows[0]?.id

    const { rows } = await query(
      'INSERT INTO videos (title, description, thumbnail, category_id, url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description || '', thumbnail || '', categoryId, url || '']
    )

    return NextResponse.json({ ...rows[0], category }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, thumbnail, category, url } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (thumbnail && thumbnail.startsWith('data:')) {
      return NextResponse.json({ error: 'Base64 data URLs are not allowed. Please upload the image file first.' }, { status: 400 })
    }

    // Find category ID
    const catRes = await query('SELECT id FROM categories WHERE name = $1', [category])
    const categoryId = catRes.rows[0]?.id

    const { rows } = await query(
      'UPDATE videos SET title = $1, description = $2, thumbnail = $3, category_id = $4, url = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [title, description || '', thumbnail || '', categoryId, url || '', id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({ ...rows[0], category })
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
