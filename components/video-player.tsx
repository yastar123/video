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
        // Keep HLS format for proper HLS playback
        videoType = 'application/x-mpegURL'
        console.log('Using HLS format:', url)
        
        // Extract base filename and try different video formats as fallback
        const baseFilename = url.replace(/\.m3u8$/, '')
        console.log('HLS base filename:', baseFilename)
        
        // Try to find the actual video file for fallback
        const checkVideoFile = async (format: string) => {
          const testUrl = `${baseFilename}${format}`
          try {
            const response = await fetch(testUrl, { method: 'HEAD' })
            if (response.ok) {
              console.log('Found working video file for fallback:', testUrl)
              return testUrl
            }
          } catch (error) {
            // Continue to next format
          }
          return null
        }
        
        // Check for video file asynchronously as fallback
        ;(async () => {
          const formats = ['.mp4', '.webm', '.ogg', '.mov']
          
          for (const format of formats) {
            const foundUrl = await checkVideoFile(format)
            if (foundUrl) {
              console.log('Switching to fallback format:', format)
              // Don't switch immediately, let HLS try first
              // Only switch if HLS fails
              break
            }
          }
        })()
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
          // Enable HLS support
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
        
        // If HLS fails, try to fallback to direct video file
        if (error.code === 4 && url.includes('.m3u8')) {
          console.log('HLS failed, trying to find direct video file...')
          
          const baseFilename = url.replace(/\.m3u8$/, '')
          const formats = ['.mp4', '.webm', '.ogg', '.mov']
          
          // Try different video formats
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
          
          // If no format works, show error
          setTimeout(() => {
            if (videoError === null) {
              setVideoError('Unable to load video. The video file may not be available.')
            }
          }, 3000)
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
