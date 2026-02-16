'use client';

import { useEffect } from 'react';

interface AdScriptProps {
  adKey: string;
  format: 'iframe' | 'js' | 'link';
  height?: number;
  width?: number;
  url?: string;
}

export default function AdScript({ adKey, format, height, width, url }: AdScriptProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && format !== 'link') {
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
           const script = document.createElement('script');
           if (adKey === 'c08de902b7930682919199d915646b97') {
             script.async = true;
             script.setAttribute('data-cfasync', 'false');
             script.src = `https://pl28722946.effectivegatecpm.com/${adKey}/invoke.js`;
           } else if (adKey === '9add34aad611a8243e9fa65055bde309') {
             script.src = `https://pl28722941.effectivegatecpm.com/9a/dd/34/${adKey}.js`;
           } else if (adKey === '4388c91d89682a21f68164b288c042f9') {
             script.src = `https://pl28722862.effectivegatecpm.com/43/88/c9/${adKey}.js`;
           } else {
             script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
           }
           container.appendChild(script);
        }
      }
    }
  }, [adKey, format, height, width]);

  if (format === 'link' && url) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block px-6 py-3 bg-primary/20 border border-primary/40 rounded-xl text-primary text-center font-bold hover:bg-primary/30 transition-all my-4 shadow-lg shadow-primary/10 animate-pulse"
      >
        KLIK DISINI UNTUK LANJUTKAN
      </a>
    )
  }

  return <div id={`ad-container-${adKey}`} className="flex justify-center my-4" />;
}
