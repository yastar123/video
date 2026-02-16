"use client";

import Script from "next/script";
import { useEffect } from "react";

// Banner configs untuk HighPerformanceFormat (dengan atOptions)
const BANNER_CONFIGS = {
  banner728x90: {
    key: "5a8dd45e78414c6e5be9db9eaffed61f",
    width: 728,
    height: 90,
  },
  banner160x600: {
    key: "22bed31723f24472a78afb44a7addb6b",
    width: 160,
    height: 600,
  },
  banner300x250: {
    key: "1ad6f564f3ca7bb42752dba86368d149",
    width: 300,
    height: 250,
  },
};

// EffectiveGate CPM scripts (simple)
export function PopunderAd() {
  return (
    <Script
      src="https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"
      strategy="afterInteractive"
      onError={() => console.warn("Popunder ad failed")}
    />
  );
}

export function SocialBarAd() {
  return (
    <Script
      src="https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js"
      strategy="afterInteractive"
      onError={() => console.warn("Social bar ad failed")}
    />
  );
}

export function NativeBannerAd() {
  return (
    <>
      <div
        id="container-c08de902b7930682919199d915646b97"
        className="my-4"
      ></div>
      <Script
        src="https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"
        strategy="afterInteractive"
        async
        data-cfasync="false"
        onError={() => console.warn("Native banner ad failed")}
      />
    </>
  );
}

// HighPerformanceFormat banners (dengan atOptions)
interface BannerAdProps {
  type: keyof typeof BANNER_CONFIGS;
  className?: string;
}

export function BannerAd({ type, className }: BannerAdProps) {
  const config = BANNER_CONFIGS[type];
  if (!config) return null;

  const containerId = `banner-container-${type}`;

  return (
    <div className={`flex justify-center ${className || ""}`}>
      <div
        id={containerId}
        style={{ width: config.width, height: config.height }}
      >
        <Script id={`banner-config-${type}`} strategy="lazyOnload">
          {`
            window.atOptions = window.atOptions || [];
            window.atOptions.push({
              'key' : '${config.key}',
              'format' : 'iframe',
              'height' : ${config.height},
              'width' : ${config.width},
              'params' : {}
            });
          `}
        </Script>
        <Script
          src={`https://www.highperformanceformat.com/${config.key}/invoke.js`}
          strategy="afterInteractive"
          onError={() => console.warn(`Banner ${type} ad failed`)}
        />
      </div>
    </div>
  );
}

// Convenience exports
export function Banner728x90({ className }: { className?: string }) {
  return <BannerAd type="banner728x90" className={className} />;
}

export function Banner160x600({ className }: { className?: string }) {
  return <BannerAd type="banner160x600" className={className} />;
}

export function Banner300x250({ className }: { className?: string }) {
  return <BannerAd type="banner300x250" className={className} />;
}
