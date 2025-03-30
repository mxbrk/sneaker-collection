import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth session cookie and check for its value explicitly
  const sessionCookie = request.cookies.get('auth_session');
  const isLoggedIn = sessionCookie && sessionCookie.value ? true : false;

  // For debugging
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Auth: ${isLoggedIn ? 'Yes' : 'No'}`);

  // Protected routes (require authentication)
  if (
    request.nextUrl.pathname.startsWith('/profile') || 
    request.nextUrl.pathname === '/search' ||
    request.nextUrl.pathname.startsWith('/search/')
  ) {
    if (!isLoggedIn) {
      // Add cache-control headers to prevent caching
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
  }

  // Auth routes (redirect if already logged in)
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'
  ) {
    if (isLoggedIn) {
      // Add cache-control headers to prevent caching
      const response = NextResponse.redirect(new URL('/profile', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
  }

  // For all responses, add cache control headers
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    '/search', 
    '/search/:path*', 
    '/profile', 
    '/profile/:path*', 
    '/login', 
    '/signup'
  ],
};