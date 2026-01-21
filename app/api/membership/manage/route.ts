import { NextRequest, NextResponse } from 'next/server'
import { updateUserMembership, findUserById } from '@/lib/auth'
import { users } from '@/lib/db'

export async function GET() {
  try {
    // Get all users with membership applications
    const membershipUsers = users.filter(
      (u) =>
        u.membershipStatus === 'pending' || u.membershipStatus === 'approved'
    )

    return NextResponse.json(membershipUsers)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch membership data' },
      { status: 500 }
    )
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

    const updatedUser = updateUserMembership(
      userId,
      status as 'pending' | 'approved' | 'none'
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update membership' },
      { status: 500 }
    )
  }
}
