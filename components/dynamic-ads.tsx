"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

export function DynamicAds() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* 1. Popunder Ad */}
      <Script 
        src="https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"
        strategy="afterInteractive"
      />

      {/* 2. Social Bar Ad */}
      <Script 
        src="https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js"
        strategy="afterInteractive"
      />

      {/* 3. Native Bar Ad (Widget 1:4) */}
      <div className="w-full my-8 flex justify-center overflow-hidden">
        <div className="max-w-7xl w-full">
          <div id="container-c08de902b7930682919199d915646b97"></div>
          <Script 
            src="https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"
            strategy="afterInteractive"
            data-cfasync="false"
          />
        </div>
      </div>
    </>
  )
}
