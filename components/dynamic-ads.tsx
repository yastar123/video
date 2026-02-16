"use client";

import { PropellerBanner } from "./propeller-ads";

// Uses Propeller Ads: Publisher ID 5609291
// Ad Units: Popunder, Banner 728x90, Social Bar, Native Banner, etc.
export function DynamicAds() {
  return (
    <>
      {/* Popunder Ad - Hidden but active */}
      <PropellerBanner type="popunder" />

      {/* Social Bar Ad */}
      <PropellerBanner type="socialBar" className="my-4" />

      {/* Native Banner */}
      <div className="w-full my-8 flex justify-center overflow-hidden">
        <div className="max-w-7xl w-full">
          <PropellerBanner type="nativeBanner" />
        </div>
      </div>
    </>
  );
}
