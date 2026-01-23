import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { ObjectStorageService } from '@/lib/replit_integrations/object_storage/objectStorage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, size, contentType: fileContentType } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const objectId = randomUUID()
    const extension = name.split('.').pop() || ''
    const fileName = `uploads/${objectId}.${extension}`
    
    // Use Replit Object Storage
    const storage = new ObjectStorageService()
    
    // Check if storage is configured
    try {
      storage.getPrivateObjectDir()
    } catch (e) {
      console.error('Storage configuration error:', e)
      return NextResponse.json(
        { error: 'Storage is not configured on the server. Please set PRIVATE_OBJECT_DIR.' },
        { status: 500 }
      )
    }

    const uploadURL = await storage.getPresignedUploadUrl(fileName, fileContentType)
    const publicUrl = await storage.getPublicUrl(fileName)

    return NextResponse.json({
      uploadURL,
      objectPath: publicUrl,
      objectId,
      fileName,
      metadata: { name, size, contentType: fileContentType },
    })
  } catch (error) {
    console.error('Error handling upload request:', error)
    return NextResponse.json(
      { error: 'Failed to process upload request: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
