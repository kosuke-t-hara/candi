import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth',
  '/past',
  '/write',
  '/tos',
  '/privacy',
  '/lp',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the session response (handles cookie syncing)
  const supabaseResponse = await updateSession(request)

  // 2. Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // 3. If it's a public route and the middleware tried to redirect to /login,
  // we intercept it and return a standard next() response while preserving cookies.
  if (isPublicRoute && supabaseResponse.status === 307 && supabaseResponse.headers.get('location')?.includes('/login')) {
    const nextResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    
    // Copy all cookies from the supabase response to the new next response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      nextResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      })
    })

    return nextResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (if any)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|site.webmanifest|manifest.webmanifest).*)',
  ],
}
