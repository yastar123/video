import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        )
      }

      const objectId = randomUUID()
      const extension = file.name.split('.').pop() || ''
      const fileName = `${objectId}.${extension}`
      const relativePath = `/uploads/${fileName}`
      const absolutePath = path.join(process.cwd(), 'public', 'uploads', fileName)

      await mkdir(path.dirname(absolutePath), { recursive: true })

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(absolutePath, buffer)

      return NextResponse.json({
        success: true,
        objectPath: relativePath,
        metadata: { name: file.name, size: file.size, contentType: file.type },
      })
    }

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
    const relativePath = `/uploads/${fileName}`

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : '')
    
    const uploadURL = baseUrl ? `${baseUrl}/api/uploads/file` : '/api/uploads/file'

    return NextResponse.json({
      uploadURL,
      objectPath: relativePath,
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
