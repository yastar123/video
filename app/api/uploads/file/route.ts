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
    
    const fileName = customFileName || `${objectId}.${extension}`
    const relativePath = `/uploads/${fileName}`
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', fileName)

    console.log('Uploading file to:', absolutePath)
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
    console.error('Error uploading file (POST):', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('filename')

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing filename parameter' },
        { status: 400 }
      )
    }

    const absolutePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await mkdir(path.dirname(absolutePath), { recursive: true })

    console.log('Uploading file to:', absolutePath)
    const bytes = await request.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(absolutePath, buffer)

    return NextResponse.json({
      success: true,
      objectPath: `/uploads/${fileName}`,
      fileName,
    })
  } catch (error) {
    console.error('Error uploading file (PUT):', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
