import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdsterraBanner } from '@/components/adsterra-banner-simple'
import { SmartPopunder } from '@/components/smart-popunder'
import { TestingDashboard } from '@/components/testing-dashboard'
import AdsterraAd from '@/components/adsterra-ad'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

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
  other: {
    'content-security-policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' https: http: https://pl28722862.effectivegatecpm.com https://pl28722946.effectivegatecpm.com https://www.effectivegatecpm.com; img-src * 'self' data: https: http:; connect-src * 'self' https: http:; default-src * 'self'"
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
        
        {/* Smart Popunder - Trigger on specific user actions */}
        <SmartPopunder enabled={true} />
        {/* Social Bar Ad */}
        <AdsterraBanner format="social" />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
