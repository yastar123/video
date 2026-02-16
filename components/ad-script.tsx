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
           // For JS scripts like Popunder/SocialBar/Native
           const script = document.createElement('script');
           if (adKey === 'c08de902b7930682919199d915646b97') {
             // Native banner specific
             script.async = true;
             script.setAttribute('data-cfasync', 'false');
             script.src = `https://pl28722946.effectivegatecpm.com/${adKey}/invoke.js`;
           } else if (adKey === '9add34aad611a8243e9fa65055bde309') {
             // Social bar
             script.src = `https://pl28722941.effectivegatecpm.com/9a/dd/34/${adKey}.js`;
           } else if (adKey === '4388c91d89682a21f68164b288c042f9') {
             // Popunder
             script.src = `https://pl28722862.effectivegatecpm.com/43/88/c9/${adKey}.js`;
           } else {
             script.src = adKey.startsWith('http') ? adKey : `https://pl28722862.effectivegatecpm.com/${adKey}.js`;
           }
           container.appendChild(script);
        }
      }
    }
  }, [adKey, format, height, width]);

  return <div id={`ad-container-${adKey}`} className="flex justify-center my-4" />;
}
