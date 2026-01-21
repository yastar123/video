import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '8')
  const sort = searchParams.get('sort') || 'newest'

  try {
    let sql = `
      SELECT v.*, c.name as category 
      FROM videos v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE 1=1
    `
    const params: any[] = []

    if (search) {
      params.push(`%${search}%`)
      sql += ` AND (LOWER(v.title) LIKE $${params.length} OR LOWER(v.description) LIKE $${params.length})`
    }

    if (category) {
      params.push(category)
      sql += ` AND c.name = $${params.length}`
    }

    // Sorting
    switch (sort) {
      case 'popular':
        sql += ` ORDER BY v.rating DESC`
        break
      case 'mostViewed':
        sql += ` ORDER BY v.views DESC`
        break
      case 'oldest':
        sql += ` ORDER BY v.created_at ASC`
        break
      case 'newest':
      default:
        sql += ` ORDER BY v.created_at DESC`
    }

    // Pagination
    const offset = (page - 1) * limit
    params.push(limit, offset)
    sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`

    const { rows: videos } = await query(sql, params)
    
    // Total count for pagination
    const countSql = `
      SELECT COUNT(*) 
      FROM videos v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE 1=1 ${search ? ` AND (LOWER(v.title) LIKE $1 OR LOWER(v.description) LIKE $1)` : ''} ${category ? ` AND c.name = $${search ? '2' : '1'}` : ''}
    `
    const countParams = []
    if (search) countParams.push(`%${search}%`)
    if (category) countParams.push(category)
    
    const { rows: countRows } = await query(countSql, countParams)
    const total = parseInt(countRows[0].count)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
