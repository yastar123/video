import { NextResponse } from 'next/server'
import { removeSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { sessionToken } = await request.json()

    if (sessionToken) {
      removeSession(sessionToken)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
