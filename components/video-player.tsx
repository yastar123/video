'use client'

import { useEffect, useRef } from 'react'
import videojs from 'video.js'
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
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        poster: thumbnail,
        sources: [{
          src: url,
          type: url.includes('.m3u8') 
            ? 'application/x-mpegURL' 
            : url.includes('.mpd') 
              ? 'application/dash+xml' 
              : url.includes('.webm')
                ? 'video/webm'
                : url.includes('.ogg')
                  ? 'video/ogg'
                  : 'video/mp4'
        }]
      }, () => {
        console.log('player is ready')
      })
    } else if (playerRef.current) {
      const player = playerRef.current
      player.src({
        src: url,
        type: url.includes('.m3u8') 
          ? 'application/x-mpegURL' 
          : url.includes('.mpd') 
            ? 'application/dash+xml' 
            : url.includes('.webm')
              ? 'video/webm'
              : url.includes('.ogg')
                ? 'video/ogg'
                : 'video/mp4'
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
    <div className="aspect-video w-full bg-black">
      {!url ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <div className="mb-4 text-6xl opacity-20 text-white">▶</div>
            <p className="text-muted-foreground">Video URL not provided</p>
          </div>
        </div>
      ) : (
        <div data-vjs-player>
          <div ref={videoRef} />
        </div>
      )}
    </div>
  )
}
