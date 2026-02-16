"use client";

import { PopunderAd, SocialBarAd, NativeBannerAd } from "./propeller-real";

export function DynamicAds() {
  return (
    <>
      {/* Popunder Ad - EffectiveGate CPM */}
      <PopunderAd />

      {/* Social Bar - EffectiveGate CPM */}
      <SocialBarAd />

      {/* Native Banner - EffectiveGate CPM */}
      <div className="w-full my-8 flex justify-center">
        <NativeBannerAd />
      </div>
    </>
  );
}
