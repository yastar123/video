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
  title: 'Ruang Malam - Watch Videos Online',
  description: 'Stream your favorite videos across all categories',
  generator: 'v0.app',
  verification: {
    google: 'jTDyD3S0yhakpG9iaHwfV5n16t3854m99wFZp3KwIeY',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
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
