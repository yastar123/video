import { NextResponse } from 'next/server'
import { categories } from '@/lib/db'

export async function GET() {
  return NextResponse.json(categories)
}
