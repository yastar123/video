"use client";

import Script from "next/script";

// Propeller Ads integration codes from dashboard
export const PROPELLER_ADS_CODES = {
  popunder:
    "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js",
  socialBar:
    "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js",
  nativeBanner:
    "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js",
  banner728x90:
    "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js",
  banner160x600:
    "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js",
  banner300x250:
    "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js",
};

interface PropellerAdProps {
  type: keyof typeof PROPELLER_ADS_CODES;
  className?: string;
}

export function PropellerAdDirect({ type, className }: PropellerAdProps) {
  const url = PROPELLER_ADS_CODES[type];

  if (!url) return null;

  // Special handling for native banner which needs a container
  if (type === "nativeBanner") {
    return (
      <div className={`w-full flex justify-center ${className || ""}`}>
        <div
          id="container-c08de902b7930682919199d915646b97"
          className="w-full"
        ></div>
        <Script
          src={url}
          strategy="afterInteractive"
          async
          data-cfasync="false"
          onError={() => console.warn("Native Banner failed to load")}
        />
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className || ""}`}>
      <Script
        src={url}
        strategy="afterInteractive"
        async
        onError={() => console.warn(`Propeller Ads ${type} failed to load`)}
      />
    </div>
  );
}

// Backward compatibility - renamed from PropellerBanner
export const PropellerBanner = PropellerAdDirect;
