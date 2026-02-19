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
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const [provider, setProvider] = useState<string>('')
  const [isDirect, setIsDirect] = useState(false)

  useEffect(() => {
    if (!url) {
      setVideoError('No video URL provided')
      setIsLoading(false)
      return
    }

    const processedUrl = processVideoUrl(url)
    if (processedUrl) {
      if (processedUrl.provider === 'direct') {
        setEmbedUrl(processedUrl.url)
        setProvider('direct')
        setIsDirect(true)
      } else {
        setEmbedUrl(processedUrl.url)
        setProvider(processedUrl.provider)
        setIsDirect(false)
      }
      setIsLoading(false)
    } else {
      setVideoError('Unsupported video provider')
      setIsLoading(false)
    }
  }, [url])

  const processVideoUrl = (videoUrl: string): { url: string; provider: string } | null => {
    // Streamtape
    if (videoUrl.includes('streamtape.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://streamtape.com/e/${videoId}`,
          provider: 'streamtape'
        }
      }
    }

    // Luluvid
    if (videoUrl.includes('luluvid.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://luluvid.com/e/${videoId}`,
          provider: 'luluvid'
        }
      }
    }

    // Doodstream
    if (videoUrl.includes('doodstream.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://doodstream.com/e/${videoId}`,
          provider: 'doodstream'
        }
      }
    }

    // Streamhub
    if (videoUrl.includes('streamhub.to')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://streamhub.to/e/${videoId}`,
          provider: 'streamhub'
        }
      }
    }

    // Fembed
    if (videoUrl.includes('fembed.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://www.fembed.com/v/${videoId}`,
          provider: 'fembed'
        }
      }
    }

    // Mixdrop
    if (videoUrl.includes('mixdrop.co')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://mixdrop.co/e/${videoId}`,
          provider: 'mixdrop'
        }
      }
    }

    // Upstream
    if (videoUrl.includes('upstream.to')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      if (videoId) {
        return {
          url: `https://upstream.to/e/${videoId}`,
          provider: 'upstream'
        }
      }
    }

    // Direct MP4/M3U8/MPD
    if (videoUrl.includes('.mp4') || videoUrl.includes('.m3u8') || videoUrl.includes('.mpd')) {
      return {
        url: videoUrl,
        provider: 'direct'
      }
    }

    return null
  }

  const renderVideoPlayer = () => {
    if (!embedUrl) return null

    if (isDirect) {
      // Direct video player
      if (embedUrl.includes('.m3u8')) {
        return (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            poster={thumbnail}
            onLoadStart={() => setIsLoading(false)}
            onError={() => setVideoError('Failed to load video')}
          >
            <source src={embedUrl} type="application/x-mpegURL" />
            Your browser does not support HLS video.
          </video>
        )
      } else if (embedUrl.includes('.mpd')) {
        return (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            poster={thumbnail}
            onLoadStart={() => setIsLoading(false)}
            onError={() => setVideoError('Failed to load video')}
          >
            <source src={embedUrl} type="application/dash+xml" />
            Your browser does not support DASH video.
          </video>
        )
      } else {
        return (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            poster={thumbnail}
            onLoadStart={() => setIsLoading(false)}
            onError={() => setVideoError('Failed to load video')}
          >
            <source src={embedUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      }
    } else {
      // Embed iframe for streaming providers
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          scrolling="no"
          onLoad={() => setIsLoading(false)}
          onError={() => setVideoError('Failed to load video')}
        />
      )
    }
  }

  const handlePlay = () => {
    // Track play button click
    const playClickCount = parseInt(localStorage.getItem('play_click_count') || '0')
    localStorage.setItem('play_click_count', (playClickCount + 1).toString())
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Loading video...</p>
            </div>
          </div>
        )}

        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center px-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-white">Video Not Available</h3>
              <p className="text-gray-300 mb-4">{videoError}</p>
              <button
                onClick={() => window.open(url, '_blank')}
                className="text-blue-400 text-sm underline hover:text-blue-300 mb-4"
              >
                Open in New Tab
              </button>
              <p className="text-gray-400 text-sm">
                Original URL: {url.split('/').pop()?.split('.')[0]}
              </p>
            </div>
          </div>
        )}

        <div className="aspect-video">
          {renderVideoPlayer()}
        </div>

        {/* Provider Badge */}
        {provider && !isLoading && !videoError && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </div>
        )}
      </div>
    </div>
  )
}
