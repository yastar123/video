import { NextResponse } from 'next/server'
import { banners } from '@/lib/db'

export async function GET() {
  return NextResponse.json(banners)
}
