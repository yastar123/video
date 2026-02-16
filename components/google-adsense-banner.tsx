"use client";

import Script from "next/script";

interface GoogleAdsenseBannerProps {
  adSlot: string; // e.g., "1234567890"
  adFormat?: "horizontal" | "vertical" | "rectangle";
  responsive?: boolean;
}

export function GoogleAdsenseBanner({
  adSlot,
  adFormat = "horizontal",
  responsive = true,
}: GoogleAdsenseBannerProps) {
  const getAdSize = () => {
    switch (adFormat) {
      case "vertical":
        return { width: 160, height: 600 };
      case "rectangle":
        return { width: 336, height: 280 };
      default:
        return { width: 728, height: 90 };
    }
  };

  const size = getAdSize();

  return (
    <div className="flex justify-center my-4">
      <div className="w-full max-w-4xl">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // Replace with your AdSense client ID
          data-ad-slot={adSlot}
          data-ad-format={responsive ? "auto" : adFormat}
          data-full-width-responsive="true"
        ></ins>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          onLoad={() => {
            try {
              if (typeof window !== "undefined" && window.adsbygoogle) {
                window.adsbygoogle.push({});
              }
            } catch (err) {
              console.error("AdSense failed to load:", err);
            }
          }}
        >
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onError={() => console.warn("AdSense script failed to load")}
        />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}
