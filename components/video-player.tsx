'use client'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
}

export default function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black flex items-center justify-center">
      {url ? (
        <video
          src={url}
          controls
          className="w-full h-full"
          poster={thumbnail}
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="text-center">
          <div className="mb-4 text-6xl opacity-20 text-white">▶</div>
          <p className="text-muted-foreground">Video URL not provided</p>
        </div>
      )}
    </div>
  )
}
