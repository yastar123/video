import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contentType, type } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing file name' },
        { status: 400 }
      )
    }

    const objectId = randomUUID()
    const extension = name.split('.').pop() || ''
    const fileName = `${objectId}.${extension}`
    
    const host = request.headers.get('host') || 'localhost:5000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    
    const uploadURL = `${protocol}://${host}/api/uploads/file?filename=${fileName}`
    const objectPath = `/uploads/${fileName}`

    return NextResponse.json({
      uploadURL,
      objectPath,
      fileName,
    })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
