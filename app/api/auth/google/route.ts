import { NextRequest, NextResponse } from 'next/server'
import {
  createOrUpdateUser,
  generateSessionToken,
  setSession,
} from '@/lib/auth'

// For demo: simple JWT decode without verification
function decodeGoogleToken(token: string) {
  try {
    const parts = token.split('.')
    const payload = parts[1]
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    )
    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 400 }
      )
    }

    const decoded = decodeGoogleToken(token)

    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = createOrUpdateUser({
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || 'User',
      image: decoded.picture,
    })

    const sessionToken = generateSessionToken()
    setSession(sessionToken, user)

    return NextResponse.json({
      success: true,
      sessionToken,
      user,
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
