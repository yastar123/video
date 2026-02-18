import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdsterraBanner } from '@/components/adsterra-banner-inline'
import { SmartPopunder } from '@/components/smart-popunder'
import { AggressivePopunder } from '@/components/aggressive-popunder'
import { SocialBar } from '@/components/social-bar'
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
  title: {
    default: 'BokepIndonesia - Nonton Video Online Terlengkap',
    template: '%s | BokepIndonesia'
  },
  description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
  keywords: 'bokepindonesia, nonton video, bokep indonesia, bokep jepang, bokep china, streaming video terbaru, video dewasa, film porno, streaming gratis',
  authors: [{ name: 'BokepIndonesia', url: 'https://bokepindonesia.my.id' }],
  publisher: 'BokepIndonesia',
  metadataBase: new URL('https://bokepindonesia.my.id'),
  alternates: {
    canonical: '/',
  },
  other: {
    'content-security-policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' https: http: https://pl28722862.effectivegatecpm.com https://pl28722946.effectivegatecpm.com https://pl28722941.effectivegatecpm.com https://www.effectivegatecpm.com; img-src * 'self' data: https: http:; connect-src * 'self' https: http:; default-src * 'self'",
    'og:updated_time': new Date().toISOString(),
    'robots': 'index, follow',
    'googlebot': 'index, follow',
  },
  openGraph: {
    title: 'BokepIndonesia - Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di BokepIndonesia. Streaming video kualitas HD tanpa VPN.',
    url: 'https://bokepindonesia.my.id',
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
  url: 'https://bokepindonesia.my.id',
  logo: 'https://bokepindonesia.my.id/assets/logo.jpg',
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
        {/* Aggressive Popunder - More aggressive popunder triggers with 5 second cooldown */}
        <AggressivePopunder enabled={true} delay={1000} cooldown={5} />
        
        {/* Smart Popunder - Trigger on specific user actions */}
        <SmartPopunder enabled={true} />
        
        {/* Social Bar - Top social bar ad */}
        <SocialBar className="w-full" />
        
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        
        {/* Additional Social Bar - Bottom social bar ad */}
        <SocialBar className="w-full" />
      </body>
    </html>
  )
}
