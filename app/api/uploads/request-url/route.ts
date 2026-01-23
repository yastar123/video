import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { ObjectStorageService } from '@/lib/replit_integrations/object_storage/objectStorage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, size, contentType: fileContentType, type } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const objectId = randomUUID()
    const extension = name.split('.').pop() || ''
    const fileName = `${objectId}.${extension}`
    
    // Use Replit Object Storage
    const storage = new ObjectStorageService()
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
      { error: 'Failed to process upload request' },
      { status: 500 }
    )
  }
}
