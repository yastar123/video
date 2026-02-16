import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdsterraBanner } from '@/components/adsterra-banner'
import { DelayPopunder, DELAY_PRESETS } from '@/components/delay-popunder'
import { TestingDashboard } from '@/components/testing-dashboard'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'BokepIndonesia - Nonton Video Online Terlengkap',
  description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
  keywords: 'bokepindonesia, nonton video, bokep indonesia, bokep jepang, bokep china, streaming video terbaru',
  authors: [{ name: 'BokepIndonesia', url: 'https://video.seyiki.com' }],
  publisher: 'BokepIndonesia',
  metadataBase: new URL('https://video.seyiki.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BokepIndonesia - Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
    url: 'https://video.seyiki.com',
    siteName: 'BokepIndonesia',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'BokepIndonesia - Nonton Video Online Terlengkap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BokepIndonesia - Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
    images: ['/assets/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sWW0YjYAAjpf9phKBrMlZAstUHC3BDapccLlAsKDXg',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BokepIndonesia',
  url: 'https://video.seyiki.com',
  logo: 'https://video.seyiki.com/assets/logo.jpg',
  description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
  sameAs: [],
}

import AdScript from "@/components/ad-script"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col min-h-screen`}>
        {/* Testing Dashboard - Development Only */}
        <TestingDashboard />
        
        {/* Delay Popunder Manager - Anti-Block System */}
        <DelayPopunder 
          config={{
            enabled: true,
            maxPerHour: 80, // 80 trigger per jam
            maxPerSession: 150, // 150 trigger per session
            fallbackMode: 'hybrid', // fallback ke delay + immediate
            mobileOptimized: true,
            delayStrategies: [
              {
                name: 'behavioral',
                enabled: true,
                delay: 20,
                variance: 10,
                weight: 8,
                description: 'Behavioral delay 20±10 detik untuk user engagement'
              },
              {
                name: 'random',
                enabled: true,
                delay: 30,
                variance: 15,
                weight: 6,
                description: 'Random delay 30±15 detik untuk anti-pattern detection'
              },
              {
                name: 'session_based',
                enabled: true,
                delay: 45,
                variance: 20,
                weight: 4,
                description: 'Session-based delay 45±20 detik untuk long sessions'
              }
            ],
            antiDetection: {
              randomDelays: true,
              variableTiming: true,
              userBehaviorSimulation: true,
              stealthMode: true,
              bypassAdBlock: true,
              multipleInjection: true,
              scriptObfuscation: true,
              cookieTracking: true
            },
            triggerEvents: [
              'click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup',
              'touchstart', 'touchend', 'scroll', 'wheel',
              'focus', 'blur', 'play', 'pause', 'ended',
              'beforeunload', 'pagehide'
            ]
          }}
        />
        {/* Popunder Ad */}
        <AdScript adKey="4388c91d89682a21f68164b288c042f9" format="js" />
        {/* Social Bar Ad */}
        <AdScript adKey="9add34aad611a8243e9fa65055bde309" format="js" />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
