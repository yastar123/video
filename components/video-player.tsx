'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
}

export default function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set video source
    video.src = url
    video.poster = thumbnail || ''

    // Handle video events
    const handleLoadStart = () => {
      setIsLoading(true)
      setVideoError(null)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setVideoError(null)
    }

    const handleError = () => {
      setIsLoading(false)
      setVideoError('Unable to load video. The video file may not be available.')
    }

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Cleanup
    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [url, thumbnail])

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          preload="metadata"
        />
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center p-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Video Not Available</h3>
              <p className="text-gray-300 mb-4">{videoError}</p>
              <p className="text-sm text-gray-400">
                Video ID: {url.split('/').pop()?.split('.')[0]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
