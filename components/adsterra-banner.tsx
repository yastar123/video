'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AdsterraBanner() {
  const pathname = usePathname()
  
  // Jangan tampilkan di halaman admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <div className="w-full flex justify-center py-6 border-t border-border mt-auto">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div id="container-586a60b68a94327ff3f7f814e59c6837" className="min-h-[90px]">
          {/* Adsterra script will inject content here */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const script = document.createElement('script');
                  script.src = 'https://pl28551201.effectivegatecpm.com/586a60b68a94327ff3f7f814e59c6837/invoke.js';
                  script.async = true;
                  script.setAttribute('data-cfasync', 'false');
                  document.getElementById('container-586a60b68a94327ff3f7f814e59c6837').appendChild(script);
                })();
              `,
            }}
          />
        </div>
      </div>
    </div>
  )
}
