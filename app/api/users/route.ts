import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM users ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
