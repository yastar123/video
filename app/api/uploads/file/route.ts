import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
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
    
    // Get upload directory from environment or use defaults
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    console.log('Upload Environment:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- UPLOAD_DIR:', uploadDir)
    console.log('- Current working directory:', process.cwd())
    
    // Detect if we're running on VPS
    const isVPS = process.env.NODE_ENV === 'production' && 
                  (process.cwd().includes('/root/video') || 
                   require('fs').existsSync('/root/video') ||
                   process.env.USER === 'root')
    
    console.log('VPS Environment detected:', isVPS)
    
    // Try multiple possible upload directories - prioritize VPS paths and env var
    let possiblePaths = []
    
    if (isVPS) {
      // VPS priority paths
      possiblePaths = [
        path.join('/root', 'video', 'uploads', fileName),    // VPS production path
        path.join('/root', 'video', 'public', 'uploads', fileName), // VPS public path
        path.join(process.cwd(), 'uploads', fileName),        // Current working dir
        path.join(process.cwd(), uploadDir, fileName),       // Environment variable
        path.join(process.cwd(), 'public', 'uploads', fileName), // Alternative local
        path.join('/tmp', 'uploads', fileName),              // Production temp
        path.join('/var/tmp', 'uploads', fileName)           // Production temp alt
      ]
    } else {
      // Local development paths
      possiblePaths = [
        path.join(process.cwd(), uploadDir, fileName),       // Environment variable
        path.join(process.cwd(), 'uploads', fileName),        // Local development
        path.join(process.cwd(), 'public', 'uploads', fileName), // Alternative local
        path.join('/tmp', 'uploads', fileName),              // Production temp
        path.join('/var/tmp', 'uploads', fileName)           // Production temp alt
      ]
    }
    
    console.log('Upload file details:')
    console.log('- Original filename:', file.name)
    console.log('- File size:', file.size)
    console.log('- File type:', file.type)
    console.log('- Generated filename:', fileName)
    console.log('Possible upload paths:')
    possiblePaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path}`)
    })
    
    let absolutePath = possiblePaths[0] // Default to first option
    let uploadSuccess = false
    
    for (const testPath of possiblePaths) {
      try {
        console.log('Attempting to save to:', testPath)
        await mkdir(path.dirname(testPath), { recursive: true })
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(testPath, buffer)
        
        // Verify file was written
        if (require('fs').existsSync(testPath)) {
          absolutePath = testPath
          uploadSuccess = true
          console.log('✅ File saved successfully to:', testPath)
          console.log('✅ File exists after save:', require('fs').existsSync(testPath))
          console.log('✅ File size:', require('fs').statSync(testPath).size, 'bytes')
          break
        } else {
          console.log('❌ File save verification failed for:', testPath)
        }
      } catch (error: any) {
        console.log('❌ Failed to save to', testPath, ':', error.message)
        continue
      }
    }
    
    if (!uploadSuccess) {
      console.log('❌ Failed to save file to any location')
      throw new Error('Failed to save file to any location')
    }

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

    const absolutePath = path.join(process.cwd(), 'uploads', fileName)
    await mkdir(path.dirname(absolutePath), { recursive: true })

    console.log('Uploading file via PUT:')
    console.log('- Filename:', fileName)
    console.log('- Target path:', absolutePath)
    console.log('- Directory exists:', existsSync(path.dirname(absolutePath)))
    
    const bytes = await request.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(absolutePath, buffer)
    
    console.log('File saved successfully via PUT:', absolutePath)
    console.log('File exists after save:', existsSync(absolutePath))

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
