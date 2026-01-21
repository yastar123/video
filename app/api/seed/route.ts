import { NextResponse } from 'next/server'
import { seedUsers } from '@/lib/seed'

export async function GET() {
  try {
    await seedUsers()
    return NextResponse.json({ success: true, message: 'Seeded successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}
