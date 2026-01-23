import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT id, username, email, role, status, 
             membership_status as "membershipStatus", 
             membership_date as "membershipDate", 
             membership_proof as "membershipPaymentProof", 
             image, created_at as "joinDate" 
      FROM users 
      WHERE membership_status IN ('pending', 'approved')
      ORDER BY created_at DESC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, status } = await request.json()

    if (!userId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let role = 'user'
    if (status === 'approved') {
      role = 'userVIP'
    }

    const { rows } = await query(
      `UPDATE users SET membership_status = $1, role = $2, membership_date = CASE WHEN $1 = 'approved' THEN NOW() ELSE membership_date END WHERE id = $3 RETURNING id, username, email, role, status, membership_status as "membershipStatus", membership_date as "membershipDate", image, created_at as "joinDate"`,
      [status, role, userId]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, username, role } = data

    const { rows } = await query(
      `UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, email, role, status, membership_status as "membershipStatus", membership_date as "membershipDate", image, created_at as "joinDate"`,
      [username, role, id]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    await query('DELETE FROM users WHERE id = $1', [userId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
