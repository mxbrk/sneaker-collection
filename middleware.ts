import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple rate limiting implementation
// In a production environment, you might want to use Redis or another store
const ipRequestMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

function isRateLimited(ip: string, path: string): boolean {
  // Only rate limit auth endpoints
  if (!path.includes('/api/auth/')) return false;
  
  const now = Date.now();
  const key = `${ip}:${path}`;
  const record = ipRequestMap.get(key) || { count: 0, lastReset: now };
  
  // Reset counter if window has passed
  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }
  
  ipRequestMap.set(key, record);
  
  // Clean up old entries periodically
  if (ipRequestMap.size > 10000) {
    const keysToDelete = [];
    for (const [mapKey, value] of ipRequestMap.entries()) {
      if (now - value.lastReset > RATE_LIMIT_WINDOW_MS) {
        keysToDelete.push(mapKey);
      }
    }
    keysToDelete.forEach(k => ipRequestMap.delete(k));
  }
  
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export function middleware(request: NextRequest) {
  // Get client IP for rate limiting
  // Use forwarded header, x-real-ip, or remote address as fallbacks
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIP = request.headers.get('x-real-ip');
  const ip = forwardedFor || realIP || 'unknown';
  
  const path = request.nextUrl.pathname;
  
  // Apply rate limiting
  if (isRateLimited(ip, path)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      }
    );
  }

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
      
      // Nur die wichtigsten Security-Header setzen
      response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' images.stockx.com stockx-assets.imgix.net image.goat.com;");
      response.headers.set('X-Content-Type-Options', 'nosniff');
      
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
      
      // Add security headers
      response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' images.stockx.com stockx-assets.imgix.net image.goat.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';");
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      
      return response;
    }
  }

  // For all responses, add cache control and security headers
  const response = NextResponse.next();
  
  // Cache control headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Security headers
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' images.stockx.com stockx-assets.imgix.net image.goat.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return response;
}

export const config = {
  matcher: [
    '/search', 
    '/search/:path*', 
    '/profile', 
    '/profile/:path*', 
    '/login', 
    '/signup',
    '/api/auth/:path*'  // Add API auth routes for rate limiting
  ],
};