"use client";

import Script from "next/script";

// Propeller Ads Zones (dari dashboard)
export const ZONES = {
  popunder: "28622363",
  banner728x90: "28622405",
  banner160x600: "28622417",
  socialBar: "28622442",
  nativeBanner: "28622447",
  banner300x250: "28622523",
};

interface PropellerAdProps {
  zoneId: string | keyof typeof ZONES;
  className?: string;
}

export function PropellerAd({ zoneId, className }: PropellerAdProps) {
  // Convert zone name to ID if needed
  const zone =
    typeof zoneId === "string" && zoneId in ZONES
      ? ZONES[zoneId as keyof typeof ZONES]
      : zoneId;

  return (
    <div className={className}>
      <Script
        src={`https://a.propellerads.com/c.js?z=${zone}`}
        strategy="afterInteractive"
        onError={() =>
          console.warn(`Propeller Ads zone ${zone} failed to load`)
        }
      />
    </div>
  );
}
