"use client";

import { PropellerAdDirect } from "./propeller-ads-direct";

// Uses Propeller Ads: Publisher ID 5609291
// Direct integration with exact codes from dashboard
export function DynamicAds() {
  return (
    <>
      {/* Popunder Ad */}
      <PropellerAdDirect type="popunder" />

      {/* Social Bar Ad */}
      <PropellerAdDirect type="socialBar" className="my-4" />

      {/* Native Banner */}
      <div className="w-full my-8 flex justify-center overflow-hidden">
        <div className="max-w-7xl w-full">
          <PropellerAdDirect type="nativeBanner" />
        </div>
      </div>
    </>
  );
}
