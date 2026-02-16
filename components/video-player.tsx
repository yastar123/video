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
        // Extract base filename and try different video formats
        const baseFilename = url.replace(/\.m3u8$/, '')
        console.log('Converting HLS to direct video:', url, '->', baseFilename)
        
        // Try to find the actual video file
        const checkVideoFile = async (format: string) => {
          const testUrl = `${baseFilename}${format}`
          try {
            const response = await fetch(testUrl, { method: 'HEAD' })
            if (response.ok) {
              console.log('Found working video file:', testUrl)
              return testUrl
            }
          } catch (error) {
            // Continue to next format
          }
          return null
        }
        
        // Try formats in order
        const formats = ['.mp4', '.webm', '.ogg', '.mov']
        
        // Check for video file asynchronously
        ;(async () => {
          setIsLoading(true)
          setVideoError(null)
          
          let foundVideo = false
          for (const format of formats) {
            const foundUrl = await checkVideoFile(format)
            if (foundUrl) {
              videoUrl = foundUrl
              videoType = format === '.webm' ? 'video/webm' : format === '.ogg' ? 'video/ogg' : format === '.mov' ? 'video/quicktime' : 'video/mp4'
              
              // Update player source
              if (playerRef.current) {
                playerRef.current.src({
                  src: videoUrl,
                  type: videoType
                })
              }
              foundVideo = true
              setIsLoading(false)
              break
            }
          }
          
          // If no video file found, show error
          if (!foundVideo) {
            console.error('No video file found for:', url)
            setVideoError('Video file not found. The video may have been removed or is not available.')
            setIsLoading(false)
          }
        })()
        
        // Default to MP4 format
        videoUrl = `${baseFilename}.mp4`
        videoType = 'video/mp4'
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
          // Disable HLS completely to avoid infinite loop
          vhs: {
            overrideNative: false
          },
          nativeVideoTracks: true,
          nativeAudioTracks: true,
          nativeTextTracks: true
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
        setVideoError('Unable to load video. The video file may not be available.')
        
        // Try different video formats if current fails
        if (error.code === 4) {
          const baseFilename = url.replace(/\.(m3u8|mp4|webm|ogg|mov)$/, '')
          const formats = ['.mp4', '.webm', '.ogg', '.mov']
          
          formats.forEach(format => {
            const testUrl = `${baseFilename}${format}`
            console.log('Trying fallback format:', testUrl)
            
            fetch(testUrl, { method: 'HEAD' })
              .then(response => {
                if (response.ok) {
                  console.log('Found working format:', format)
                  setVideoError(null)
                  player.src({
                    src: testUrl,
                    type: format === '.webm' ? 'video/webm' : format === '.ogg' ? 'video/ogg' : format === '.mov' ? 'video/quicktime' : 'video/mp4'
                  })
                }
              })
              .catch(() => {
                // Try next format
              })
          })
        }
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      
      // Force direct video playback
      let videoUrl = url
      let videoType = 'video/mp4'
      
      if (url.includes('.m3u8')) {
        videoUrl = url.replace(/\.m3u8$/, '.mp4')
        videoType = 'video/mp4'
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
