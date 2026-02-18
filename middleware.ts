import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Force non-WWW (redirect www to non-www)
  if (hostname.startsWith('www.')) {
    const nonWwwHost = hostname.replace('www.', '')
    url.host = nonWwwHost
    return NextResponse.redirect(url, 301)
  }
  
  // Force HTTPS in production
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  if (protocol === 'http' && hostname.includes('bokepindonesia.my.id')) {
    url.protocol = 'https'
    return NextResponse.redirect(url, 301)
  }

  // Add X-Robots-Tag headers for SEO
  const response = NextResponse.next()
  
  // Set X-Robots-Tag for all pages
  response.headers.set('X-Robots-Tag', 'index, follow')
  
  // Special handling for admin pages
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  
  // Special handling for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  
  // Add additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  if (pathname.startsWith('/admin')) {
    // In a real app, you'd check a secure cookie
    // For this client-side focused MVP, we'll rely on client-side RBAC
    // But we'll add a placeholder for server-side check
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/profile/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
