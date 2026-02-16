import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
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
  
  // Try both root/uploads and public/uploads
  let absolutePath = path.join(process.cwd(), 'public', 'uploads', normalizedPath)
  if (!existsSync(absolutePath)) {
    absolutePath = path.join(process.cwd(), 'uploads', normalizedPath)
  }

  if (!existsSync(absolutePath)) {
    return new NextResponse('File not found', { status: 404 })
  }

  try {
    const fileStat = await stat(absolutePath)
    const fileSize = fileStat.size
    const extension = path.extname(absolutePath).toLowerCase()
    
    const mimeTypes: { [key: string]: string } = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    }
    
    const contentType = mimeTypes[extension] || 'application/octet-stream'

    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      
      const fileBuffer = await readFile(absolutePath)
      const chunk = fileBuffer.slice(start, end + 1)
      
      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    const fileBuffer = await readFile(absolutePath)
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
