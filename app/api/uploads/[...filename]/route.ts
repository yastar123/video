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
  
  // Try both public/uploads and uploads directories
  let absolutePath = path.join(process.cwd(), 'public', 'uploads', normalizedPath)
  if (!existsSync(absolutePath)) {
    absolutePath = path.join(process.cwd(), 'uploads', normalizedPath)
  }

  if (!existsSync(absolutePath)) {
    // Check if this is an HLS segment request
    if (extension === '.ts' || extension === '.m3u8') {
      // For HLS segments, try to find the original video file or create proper HLS response
      const baseName = path.basename(filename, extension)
      console.log(`HLS segment requested: ${filename} - baseName: ${baseName}`)
      
      // For .m3u8 files, try to create a proper HLS playlist
      if (extension === '.m3u8') {
        // Try to find corresponding video file
        const uploadsDir = path.join(process.cwd(), 'uploads')
        const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads')
        
        let videoFile = null
        
        // Look for video files with similar base name
        for (const dir of [uploadsDir, publicUploadsDir]) {
          if (existsSync(dir)) {
            const files = readdirSync(dir)
            const matchingVideo = files.find((file: string) => 
              file.includes(baseName) && 
              (file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov'))
            )
            if (matchingVideo) {
              videoFile = path.join(dir, matchingVideo)
              console.log(`Found matching video for HLS: ${matchingVideo}`)
              break
            }
          }
        }
        
        if (videoFile && existsSync(videoFile)) {
          // Create a simple HLS playlist that points to the video file
          const videoUrl = `/uploads/${path.basename(videoFile)}`
          const hlsPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
${videoUrl}
#EXT-X-ENDLIST`
          
          return new Response(hlsPlaylist, {
            headers: {
              'Content-Type': 'application/vnd.apple.mpegurl',
              'Content-Length': hlsPlaylist.length.toString(),
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
            },
          })
        }
        
        // If no video file found, return empty playlist
        return new Response('#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-ENDLIST\n', {
          headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
            'Content-Length': '71',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
          },
        })
      }
      
      // For .ts segments, return empty response
      if (extension === '.ts') {
        return new Response(new Uint8Array(), {
          headers: {
            'Content-Type': 'video/mp2t',
            'Content-Length': '0',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
          },
        })
      }
    }
    
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
