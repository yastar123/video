import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { existsSync, readdirSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string[] } }
) {
  const filename = params.filename.join('/')
  
  if (!filename) {
    return new Response('Missing filename', { status: 400 })
  }

  // Security: prevent directory traversal
  const normalizedPath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '')
  const extension = path.extname(filename).toLowerCase()
  
  // Try multiple possible upload directories
  const possiblePaths = [
    path.join(process.cwd(), 'uploads', normalizedPath),
    path.join(process.cwd(), 'public', 'uploads', normalizedPath),
    path.join('/tmp', 'uploads', normalizedPath),
    path.join('/var/tmp', 'uploads', normalizedPath)
  ]
  
  let absolutePath = null
  for (const testPath of possiblePaths) {
    console.log('Looking for file in:', testPath, 'exists:', existsSync(testPath))
    if (existsSync(testPath)) {
      absolutePath = testPath
      console.log('Found file at:', testPath)
      break
    }
  }

  if (!absolutePath) {
    console.log('File not found in any location:', filename)
    return new Response('File not found', { status: 404 })
  }

  try {
    const fileStat = await stat(absolutePath)
    const fileSize = fileStat.size
    
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
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.mkv': 'video/x-matroska',
      // HLS streaming formats
      '.ts': 'video/mp2t',
      '.m3u8': 'application/vnd.apple.mpegurl',
      '.m3u': 'application/vnd.apple.mpegurl'
    }
    
    const contentType = mimeTypes[extension] || 'application/octet-stream'

    // Handle range requests for video streaming
    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      
      const fileBuffer = await readFile(absolutePath)
      const chunk = fileBuffer.slice(start, end + 1)
      
      return new Response(new Uint8Array(chunk), {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        },
      })
    }

    // Serve full file
    const fileBuffer = await readFile(absolutePath)
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  })
}
