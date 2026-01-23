import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    let sql = 'SELECT id, username, email, role, status, membership_status as "membershipStatus", membership_date as "membershipDate", membership_proof as "membershipPaymentProof", image, google_id as "googleId", created_at as "joinDate" FROM users'
    const params: any[] = []
    
    if (id) {
      params.push(id)
      sql += ` WHERE id = $${params.length}`
    }
    
    sql += ' ORDER BY created_at DESC'
    
    const { rows } = await query(sql, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, status, username, role } = data

    let sql = 'UPDATE users SET '
    const updates: string[] = []
    const params: any[] = []

    if (status !== undefined) {
      params.push(status)
      updates.push(`status = $${params.length}`)
    }
    if (username !== undefined) {
      params.push(username)
      updates.push(`username = $${params.length}`)
    }
    if (role !== undefined) {
      params.push(role)
      updates.push(`role = $${params.length}`)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    params.push(id)
    sql += updates.join(', ') + ` WHERE id = $${params.length} RETURNING *`

    const { rows } = await query(sql, params)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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
    const { rows } = await query('SELECT role FROM users WHERE id = $1', [id])
    if (rows.length > 0 && rows[0].role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 403 })
    }

    await query('DELETE FROM users WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
