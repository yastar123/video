"use client"

export function BannerPlaceholder({ 
  width = "full", 
  height = "medium",
  text = "Banner 728x90" 
}: {
  width?: "full" | "half" | "third"
  height?: "small" | "medium" | "large"
  text?: string
}) {
  const widthClasses = {
    full: "w-full",
    half: "w-full md:w-1/2",
    third: "w-full md:w-1/3"
  }

  const heightClasses = {
    small: "h-12",
    medium: "h-16",
    large: "h-20"
  }

  return (
    <div className={`${widthClasses[width]} ${heightClasses[height]} bg-[#1a1a1a] border border-white/10 rounded-lg flex items-center justify-center overflow-hidden relative group hover:border-white/20 transition-colors`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-transparent opacity-50"></div>
      <span className="text-gray-500 text-xs font-medium relative z-10 group-hover:text-gray-400 transition-colors">
        {text}
      </span>
      <div className="absolute top-2 right-2 w-2 h-2 bg-gray-600 rounded-full opacity-50"></div>
    </div>
  )
}
