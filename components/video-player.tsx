'use client'

import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
}

export default function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video')
      videoElement.className = 'video-js vjs-big-play-centered vjs-theme-city'
      videoRef.current.appendChild(videoElement)

      // Force direct video playback - disable HLS completely
      let videoUrl = url
      let videoType = 'video/mp4'
      
      // Convert HLS to direct video file
      if (url.includes('.m3u8')) {
        // Force HLS type to prevent auto fallback
        videoType = 'application/x-mpegURL'
        console.log('Using HLS format with forced type:', url)
        
        // Don't try to find other formats - just use HLS
        setIsLoading(false)
        setVideoError(null)
      } else if (url.includes('.mpd')) {
        videoType = 'application/dash+xml'
      } else if (url.includes('.webm')) {
        videoType = 'video/webm'
      } else if (url.includes('.ogg')) {
        videoType = 'video/ogg'
      } else if (url.includes('.mov')) {
        videoType = 'video/quicktime'
      }

      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        poster: thumbnail,
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlSpacer',
            'playbackRateMenuButton',
            'chaptersButton',
            'descriptionsButton',
            'subsCapsButton',
            'audioTrackButton',
            'fullscreenToggle'
          ]
        },
        html5: {
          // Enable HLS support for HLS only mode
          vhs: {
            overrideNative: true,
            enableLowInitialBitrate: true,
            experimentalBufferBasedABR: true,
            experimentalLLHLS: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        },
        sources: [{
          src: videoUrl,
          type: videoType
        }]
      }, () => {
        console.log('player is ready with URL:', videoUrl)
        setIsLoading(false)
      })

      // Handle player errors
      player.on('error', (error: any) => {
        console.error('Video.js error:', error)
        
        // For HLS errors, show specific message
        if (url.includes('.m3u8')) {
          setVideoError('HLS stream not available. The video may be processing or temporarily unavailable.')
        } else {
          setVideoError('Unable to load video. The video file may not be available.')
        }
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      
      // Handle different video formats
      let videoUrl = url
      let videoType = 'video/mp4'
      
      if (url.includes('.m3u8')) {
        videoType = 'application/x-mpegURL'
        console.log('Using HLS format for existing player:', url)
      } else if (url.includes('.mpd')) {
        videoType = 'application/dash+xml'
      } else if (url.includes('.webm')) {
        videoType = 'video/webm'
      } else if (url.includes('.ogg')) {
        videoType = 'video/ogg'
      } else if (url.includes('.mov')) {
        videoType = 'video/quicktime'
      }
      
      player.src({
        src: videoUrl,
        type: videoType
      })
      if (thumbnail) player.poster(thumbnail)
    }
  }, [url, thumbnail, videoRef])

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div className="relative w-full">
      <div ref={videoRef} className="w-full" />
      
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
  )
}
