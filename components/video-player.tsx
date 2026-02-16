'use client'

import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
}

export default function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video')
      videoElement.className = 'video-js vjs-big-play-centered vjs-theme-city'
      videoRef.current.appendChild(videoElement)

      // Force MP4 format - disable HLS completely
      let videoUrl = url
      
      // If URL is HLS, convert to MP4
      if (url.includes('.m3u8')) {
        videoUrl = url.replace(/\.m3u8$/, '.mp4')
        console.log('Converting HLS to MP4:', url, '->', videoUrl)
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
          // Disable HLS completely
          vhs: {
            overrideNative: false
          },
          nativeVideoTracks: true,
          nativeAudioTracks: true,
          nativeTextTracks: true
        },
        sources: [{
          src: videoUrl,
          type: 'video/mp4'
        }]
      }, () => {
        console.log('player is ready')
      })

      // Handle player errors
      player.on('error', (error: any) => {
        console.error('Video.js error:', error)
        
        // Try different video formats if MP4 fails
        if (error.code === 4) {
          const baseFilename = url.replace(/\.(m3u8|mp4|webm|ogg)$/, '')
          
          // Try different formats in order
          const formats = ['.webm', '.ogg', '.mp4']
          
          formats.forEach(format => {
            const testUrl = `${baseFilename}${format}`
            console.log('Trying fallback format:', testUrl)
            
            fetch(testUrl, { method: 'HEAD' })
              .then(response => {
                if (response.ok) {
                  console.log('Found working format:', format)
                  player.src({
                    src: testUrl,
                    type: format === '.webm' ? 'video/webm' : format === '.ogg' ? 'video/ogg' : 'video/mp4'
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
      
      // Force MP4 format
      let videoUrl = url
      if (url.includes('.m3u8')) {
        videoUrl = url.replace(/\.m3u8$/, '.mp4')
      }
      
      player.src({
        src: videoUrl,
        type: 'video/mp4'
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

  const isEmbed = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')

  if (isEmbed) {
    let embedUrl = url
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/')
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/')
    }

    return (
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {!url ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <div className="mb-4 text-6xl opacity-20 text-white">▶</div>
            <p className="text-muted-foreground">Video URL not provided</p>
          </div>
        </div>
      ) : (
        <div data-vjs-player className="w-full h-full">
          <div ref={videoRef} className="w-full h-full" />
        </div>
      )}
    </div>
  )
}
