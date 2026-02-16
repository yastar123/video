"use client";

import { Banner300x250, Banner160x600 } from "./propeller-real";

// Banner 300x250 - Medium Rectangle
export function MediumRectangleBanner() {
  return (
    <div className="flex justify-center py-4">
      <Banner300x250 className="hidden md:block" />
    </div>
  );
}

// Banner 160x600 - Wide Skyscraper (sidebar)
export function WideSkyscraper() {
  return (
    <div className="flex justify-center py-4">
      <Banner160x600 />
    </div>
  );
}
