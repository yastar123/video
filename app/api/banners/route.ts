import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM banners ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, image, description, link } = data

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
    }

    const { rows } = await query(
      'INSERT INTO banners (title, image, description, link) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, image, description || '', link || '']
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, title, image, description, link } = data

    if (!id || !title || !image) {
      return NextResponse.json({ error: 'ID, title, and image are required' }, { status: 400 })
    }

    const { rows } = await query(
      'UPDATE banners SET title = $1, image = $2, description = $3, link = $4 WHERE id = $5 RETURNING *',
      [title, image, description || '', link || '', id]
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await query('DELETE FROM banners WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
