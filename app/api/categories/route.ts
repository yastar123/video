import { NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM categories ORDER BY name ASC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
