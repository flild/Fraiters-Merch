import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude the login route itself from protection
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminSessionCookie = request.cookies.get('admin_session');
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      // If no admin password is set, we could either allow or deny.
      // Safe default is to redirect to login which will show an error.
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Use Web Crypto API which is supported in Edge Runtime
    const encoder = new TextEncoder();
    const data = encoder.encode(correctPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedCorrectPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (!adminSessionCookie || adminSessionCookie.value !== hashedCorrectPassword) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
