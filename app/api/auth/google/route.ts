import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/postgres'

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json()
    
    const { rows } = await query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [userData.id, userData.email]
    )

    let user;
    if (rows.length === 0) {
      const { rows: newUsers } = await query(
        'INSERT INTO users (username, email, google_id, image, role, status, membership_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userData.name, userData.email, userData.id, userData.picture, 'user', 'active', 'none']
      )
      user = newUsers[0]
    } else {
      user = rows[0]
      if (user.image !== userData.picture) {
        await query('UPDATE users SET image = $1 WHERE id = $2', [userData.picture, user.id])
        user.image = userData.picture
      }
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
