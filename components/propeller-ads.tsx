"use client";

import Script from "next/script";

// Propeller Ads - Publisher ID: 5609291
const PUBLISHER_ID = "5609291";

// Ad Unit IDs
export const PROPELLER_ADS = {
  popunder: "28622363",
  banner728x90: "28622405",
  banner160x600: "28622417",
  socialBar: "28622442",
  nativeBanner: "28622447",
  banner300x250: "28622523",
};

interface PropellerAdUnitProps {
  unitId: string;
  style?: React.CSSProperties;
}

export function PropellerAdUnit({ unitId, style }: PropellerAdUnitProps) {
  return (
    <div
      style={style}
      className="flex justify-center my-4"
      dangerouslySetInnerHTML={{
        __html: `
          <script type="text/javascript">
            var _paq = _paq || [];
            _paq.push(['trackPageView']);
            (function() {
              var u = '//analytics.propellerads.com/';
              _paq.push(['setTrackerUrl', u + 'track']);
              _paq.push(['setSiteId', '${PUBLISHER_ID}']);
              _paq.push(['setCustomVariable', 1, 'Unit', '${unitId}', 'page']);
            })();
          </script>
          <div id="propeller-unit-${unitId}"></div>
          <script async type="text/javascript" src="https://banner.propellerads.com/banners?rnd=${Date.now()}&size=728x90" data-key="${unitId}"></script>
        `,
      }}
    />
  );
}

interface PropellerBannerProps {
  type:
    | "popunder"
    | "banner728x90"
    | "banner160x600"
    | "socialBar"
    | "nativeBanner"
    | "banner300x250";
  className?: string;
}

export function PropellerBanner({ type, className }: PropellerBannerProps) {
  const unitId = PROPELLER_ADS[type];

  const getConfig = () => {
    switch (type) {
      case "popunder":
        return {
          style: { display: "none" },
          height: "auto",
        };
      case "banner728x90":
        return {
          style: { width: "100%", maxWidth: "728px", height: "90px" },
          height: "90px",
        };
      case "banner160x600":
        return {
          style: { width: "160px", height: "600px" },
          height: "600px",
        };
      case "banner300x250":
        return {
          style: { width: "300px", height: "250px" },
          height: "250px",
        };
      case "socialBar":
        return {
          style: { display: "block" },
          height: "auto",
        };
      case "nativeBanner":
        return {
          style: { width: "100%", display: "block" },
          height: "auto",
        };
      default:
        return {
          style: { width: "100%" },
          height: "auto",
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`flex justify-center overflow-hidden ${className || ""}`}>
      <Script
        id={`propeller-${type}`}
        strategy="afterInteractive"
        src={`https://a.propellerads.com/c.js?z=${unitId}`}
        onError={() => console.warn(`Propeller Ads ${type} failed to load`)}
      />
      <div
        id={`propeller-unit-${unitId}`}
        style={config.style}
        className={type === "banner728x90" ? "mx-auto" : ""}
      />
    </div>
  );
}
