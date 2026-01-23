import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

const REPLIT_SIDECAR_ENDPOINT = 'http://127.0.0.1:1106'

const objectStorageClient = new Storage({
  credentials: {
    audience: 'replit',
    subject_token_type: 'access_token',
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: 'external_account',
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: 'json',
        subject_token_field_name: 'access_token',
      },
    },
    universe_domain: 'googleapis.com',
  } as any,
  projectId: '',
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const objectPath = path.join('/')
    
    const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || ''
    if (!privateObjectDir) {
      return NextResponse.json(
        { error: 'Object storage not configured' },
        { status: 500 }
      )
    }

    const fullPath = `${privateObjectDir}/${objectPath}`
    const pathParts = fullPath.split('/')
    if (pathParts.length < 3) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const bucketName = pathParts[1]
    const objectName = pathParts.slice(2).join('/')

    const bucket = objectStorageClient.bucket(bucketName)
    const file = bucket.file(objectName)

    const [exists] = await file.exists()
    if (!exists) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 })
    }

    const [metadata] = await file.getMetadata()
    const [content] = await file.download()

    return new NextResponse(content, {
      headers: {
        'Content-Type': metadata.contentType || 'application/octet-stream',
        'Content-Length': String(metadata.size),
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving object:', error)
    return NextResponse.json(
      { error: 'Failed to serve object' },
      { status: 500 }
    )
  }
}
