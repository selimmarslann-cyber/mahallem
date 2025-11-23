import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

/**
 * Middleware - protected route'ları kontrol eder
 * TODO: İleride daha gelişmiş route protection eklenebilir
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedPaths = ['/dashboard', '/orders', '/profile']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = verifyToken(token)
    if (!payload) {
      // Geçersiz token - cookie'yi temizle ve login'e yönlendir
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

