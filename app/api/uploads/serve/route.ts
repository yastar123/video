import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return new NextResponse('Missing file path', { status: 400 })
  }

  // Security: prevent directory traversal
  const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '')
  const absolutePath = path.join(process.cwd(), 'public', 'uploads', normalizedPath)

  if (!existsSync(absolutePath)) {
    return new NextResponse('File not found', { status: 404 })
  }

  try {
    const fileBuffer = await readFile(absolutePath)
    const extension = path.extname(absolutePath).toLowerCase()
    
    let contentType = 'application/octet-stream'
    if (extension === '.mp4') contentType = 'video/mp4'
    else if (extension === '.jpg' || extension === '.jpeg') contentType = 'image/jpeg'
    else if (extension === '.png') contentType = 'image/png'
    else if (extension === '.svg') contentType = 'image/svg+xml'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
