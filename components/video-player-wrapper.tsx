'use client'

import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('@/components/video-player'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-muted flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
    </div>
  )
})

interface VideoPlayerWrapperProps {
  url: string
  thumbnail: string
}

export function VideoPlayerWrapper({ url, thumbnail }: VideoPlayerWrapperProps) {
  return <VideoPlayer url={url} thumbnail={thumbnail} />
}
