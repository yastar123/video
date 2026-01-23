import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'video'
    const customFileName = formData.get('fileName') as string | null
    const customFolder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const objectId = randomUUID()
    const extension = file.name.split('.').pop() || ''
    const folder = customFolder || (type === 'thumbnail' ? 'thumbnails' : 'videos')
    const fileName = customFileName || `${objectId}.${extension}`
    const relativePath = `/uploads/${folder}/${fileName}`
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', folder, fileName)

    await mkdir(path.dirname(absolutePath), { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(absolutePath, buffer)

    return NextResponse.json({
      success: true,
      objectPath: relativePath,
      fileName,
      metadata: { 
        name: file.name, 
        size: file.size, 
        contentType: file.type 
      },
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
