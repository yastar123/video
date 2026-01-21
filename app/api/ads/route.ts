import { NextRequest, NextResponse } from 'next/server'
import { advertisements } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const position = searchParams.get('position')
  const status = searchParams.get('status')

  let filtered = advertisements

  if (position) {
    filtered = filtered.filter((ad) => ad.position === position)
  }

  if (status) {
    filtered = filtered.filter((ad) => ad.status === status)
  }

  return NextResponse.json(filtered)
}
