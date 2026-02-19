'use client'

import React from 'react'

interface VideoProviderInfoProps {
  url: string
}

export function VideoProviderInfo({ url }: VideoProviderInfoProps) {
  const getProviderInfo = (videoUrl: string) => {
    // Streamtape
    if (videoUrl.includes('streamtape.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Streamtape',
        embedUrl: `https://streamtape.com/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-blue-500',
        icon: '📹'
      }
    }

    // Luluvid
    if (videoUrl.includes('luluvid.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Luluvid',
        embedUrl: `https://luluvid.com/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-green-500',
        icon: '🎬'
      }
    }

    // Doodstream
    if (videoUrl.includes('doodstream.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Doodstream',
        embedUrl: `https://doodstream.com/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-purple-500',
        icon: '🎥'
      }
    }

    // Streamhub
    if (videoUrl.includes('streamhub.to')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Streamhub',
        embedUrl: `https://streamhub.to/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-orange-500',
        icon: '🎬'
      }
    }

    // Fembed
    if (videoUrl.includes('fembed.com')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Fembed',
        embedUrl: `https://www.fembed.com/v/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-red-500',
        icon: '🎬'
      }
    }

    // Mixdrop
    if (videoUrl.includes('mixdrop.co')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Mixdrop',
        embedUrl: `https://mixdrop.co/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-indigo-500',
        icon: '🎬'
      }
    }

    // Upstream
    if (videoUrl.includes('upstream.to')) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      return {
        name: 'Upstream',
        embedUrl: `https://upstream.to/e/${videoId}`,
        originalUrl: videoUrl,
        color: 'bg-pink-500',
        icon: '🎬'
      }
    }

    // Direct MP4/M3U8/MPD
    if (videoUrl.includes('.mp4') || videoUrl.includes('.m3u8') || videoUrl.includes('.mpd')) {
      return {
        name: 'Direct',
        embedUrl: videoUrl,
        originalUrl: videoUrl,
        color: 'bg-gray-500',
        icon: '📁'
      }
    }

    return {
      name: 'Unknown',
      embedUrl: videoUrl,
      originalUrl: videoUrl,
      color: 'bg-gray-400',
      icon: '❓'
    }
  }

  const providerInfo = getProviderInfo(url)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Provider:</span>
        <span className={`px-2 py-1 text-xs text-white rounded ${providerInfo.color}`}>
          {providerInfo.icon} {providerInfo.name}
        </span>
      </div>
      
      <div className="space-y-1">
        <div>
          <span className="text-sm font-medium text-gray-700">Original URL:</span>
        </div>
        <div className="bg-gray-100 p-2 rounded text-xs break-all">
          <code className="text-gray-800">{providerInfo.originalUrl}</code>
        </div>
      </div>
      
      <div className="space-y-1">
        <div>
          <span className="text-sm font-medium text-gray-700">Embed URL:</span>
        </div>
        <div className="bg-gray-100 p-2 rounded text-xs break-all">
          <code className="text-gray-800">{providerInfo.embedUrl}</code>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Copy the embed URL for your website</li>
          <li>The video player will automatically detect the provider</li>
          <li>Supported providers: Streamtape, Luluvid, Doodstream, Streamhub, Fembed, Mixdrop, Upstream</li>
        </ul>
      </div>
    </div>
  )
}
