import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const position = searchParams.get('position')
  const status = searchParams.get('status')

  try {
    let sql = 'SELECT id, title, image, link, position, status, created_at as "createdAt" FROM advertisements WHERE 1=1'
    const params: any[] = []

    if (position) {
      params.push(position)
      sql += ` AND position = $${params.length}`
    }

    if (status) {
      params.push(status)
      sql += ` AND status = $${params.length}`
    }

    sql += ' ORDER BY created_at DESC'

    const { rows } = await query(sql, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, image, link, position } = data

    const { rows } = await query(
      'INSERT INTO advertisements (title, image, link, position, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, image || '', link || '', position || 'top', 'active']
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
    const { id, title, image, link, position, status } = data

    const { rows } = await query(
      'UPDATE advertisements SET title = $1, image = $2, link = $3, position = $4, status = $5 WHERE id = $6 RETURNING *',
      [title, image || '', link || '', position || 'top', status || 'active', id]
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
    await query('DELETE FROM advertisements WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
