"use client"

import { useEffect, useRef } from "react"

export function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adRef.current) return

    const script = document.createElement("script")
    script.async = true
    script.setAttribute("data-cfasync", "false")
    script.src = "https://pl28551201.effectivegatecpm.com/586a60b68a94327ff3f7f814e59c6837/invoke.js"
    
    // The script expects a container with this specific ID
    // If we have multiple, we might need to handle IDs carefully, 
    // but the user provided one specific ID.
    document.body.appendChild(script)

    return () => {
      // Clean up script if it's safe, but usually they are idempotent
    }
  }, [])

  return (
    <div className="w-full flex justify-center">
      <div id="container-586a60b68a94327ff3f7f814e59c6837" ref={adRef}></div>
    </div>
  )
}
