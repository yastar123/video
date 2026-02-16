"use client"

import { useEffect, useRef } from "react"

export function DynamicAds() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Popunder Ad
    const popunderScript = document.createElement("script")
    popunderScript.src = "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"
    document.body.appendChild(popunderScript)

    // 2. Social Bar Ad
    const socialBarScript = document.createElement("script")
    socialBarScript.src = "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js"
    document.body.appendChild(socialBarScript)

    // 3. Native Bar Ad (Widget 1:4)
    if (containerRef.current) {
      const nativeScript = document.createElement("script")
      nativeScript.async = true
      nativeScript.setAttribute("data-cfasync", "false")
      nativeScript.src = "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"
      
      const nativeContainer = document.createElement("div")
      nativeContainer.id = "container-c08de902b7930682919199d915646b97"
      
      containerRef.current.appendChild(nativeContainer)
      containerRef.current.appendChild(nativeScript)
    }

    return () => {
      // Cleanup if necessary
      document.body.removeChild(popunderScript)
      document.body.removeChild(socialBarScript)
    }
  }, [])

  return (
    <div className="w-full my-8 flex justify-center overflow-hidden">
      <div ref={containerRef} className="max-w-7xl w-full" />
    </div>
  )
}
