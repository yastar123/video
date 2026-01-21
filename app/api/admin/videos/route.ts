import { NextRequest, NextResponse } from 'next/server'
import { videos } from '@/lib/db'

// Simulasi state in-memory untuk demo
let videosState = [...videos]

export async function GET() {
  return NextResponse.json(videosState)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newVideo = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      thumbnail: body.thumbnail || 'https://via.placeholder.com/500x300',
      category: body.category,
      duration: body.duration || 3600,
      views: 0,
      rating: 0,
      url: body.url || '',
      createdAt: new Date().toISOString(),
    }

    videosState.push(newVideo)
    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const index = videosState.findIndex((v) => v.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    videosState[index] = {
      ...videosState[index],
      ...body,
      id: videosState[index].id, // Prevent ID change
      createdAt: videosState[index].createdAt, // Prevent date change
    }

    return NextResponse.json(videosState[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    videosState = videosState.filter((v) => v.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
