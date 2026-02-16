"use client";

import { PropellerBanner } from "./propeller-ads";

// Banner 300x250 - Medium Rectangle
export function MediumRectangleBanner() {
  return (
    <div className="flex justify-center py-4">
      <PropellerBanner type="banner300x250" className="hidden md:block" />
    </div>
  );
}

// Banner 160x600 - Wide Skyscraper (sidebar)
export function WideSkyscraper() {
  return (
    <div className="flex justify-center py-4">
      <PropellerBanner type="banner160x600" />
    </div>
  );
}
