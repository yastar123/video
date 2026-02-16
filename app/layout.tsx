import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdsterraBanner } from '@/components/adsterra-banner'

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
        {/* Popunder Ad */}
        <AdScript adKey="4388c91d89682a21f68164b288c042f9" format="js" />
        {/* Social Bar Ad */}
        <AdScript adKey="9add34aad611a8243e9fa65055bde309" format="js" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col min-h-screen`}>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        </body>
    </html>
  )
}
