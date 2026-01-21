import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const position = searchParams.get('position')
  const status = searchParams.get('status')

  try {
    let sql = 'SELECT * FROM advertisements WHERE 1=1'
    const params: any[] = []

    if (position) {
      params.push(position)
      sql += ` AND position = $${params.length}`
    }

    if (status) {
      params.push(status)
      sql += ` AND status = $${params.length}`
    }

    const { rows } = await query(sql, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
