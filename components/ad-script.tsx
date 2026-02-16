'use client';

import { useEffect } from 'react';

interface AdScriptProps {
  adKey: string;
  format: 'iframe' | 'js';
  height?: number;
  width?: number;
}

export default function AdScript({ adKey, format, height, width }: AdScriptProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const containerId = `ad-container-${adKey}`;
      const container = document.getElementById(containerId);
      
      if (container && !container.hasChildNodes()) {
        if (format === 'iframe') {
          const script1 = document.createElement('script');
          script1.innerHTML = `
            atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          `;
          container.appendChild(script1);

          const script2 = document.createElement('script');
          script2.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
          container.appendChild(script2);
        } else if (format === 'js') {
           // For JS scripts like Popunder/SocialBar
           const script = document.createElement('script');
           script.src = adKey.startsWith('http') ? adKey : `https://pl28722862.effectivegatecpm.com/${adKey}.js`;
           document.head.appendChild(script);
        }
      }
    }
  }, [adKey, format, height, width]);

  return <div id={`ad-container-${adKey}`} className="flex justify-center my-4" />;
}
