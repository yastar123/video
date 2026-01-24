import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AdsterraBanner } from '@/components/adsterra-banner'
import Script from 'next/script'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Ruang Malam - Nonton Video Online Terlengkap',
  description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di Ruang Malam. Streaming video kualitas HD tanpa VPN.',
  keywords: 'ruang malam, nonton video, bokep indonesia, bokep jepang, bokep china, streaming video terbaru',
  authors: [{ name: 'Ruang Malam', url: 'https://ruangmalam.com' }],
  publisher: 'Ruang Malam',
  metadataBase: new URL('https://ruangmalam.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ruang Malam - Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di Ruang Malam. Streaming video kualitas HD tanpa VPN.',
    url: 'https://ruangmalam.com',
    siteName: 'Ruang Malam',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Ruang Malam - Nonton Video Online Terlengkap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ruang Malam - Nonton Video Online Terlengkap',
    description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di Ruang Malam. Streaming video kualitas HD tanpa VPN.',
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
    google: 'jTDyD3S0yhakpG9iaHwfV5n16t3854m99wFZp3KwIeY',
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
  name: 'Ruang Malam',
  url: 'https://ruangmalam.com',
  logo: 'https://ruangmalam.com/assets/logo.jpg',
  description: 'Nonton bokep Indonesia, Jepang, China terlengkap dan terbaru hanya di Ruang Malam. Streaming video kualitas HD tanpa VPN.',
  sameAs: [],
}

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
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <AdsterraBanner />
        <Script src="https://pl28551898.effectivegatecpm.com/5a/16/ec/5a16ec4c9a99c37de020981b50181827.js" strategy="lazyOnload" />
        <Script src="https://pl28551950.effectivegatecpm.com/da/af/d9/daafd92f1c5ebec81553cc97b327f824.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
