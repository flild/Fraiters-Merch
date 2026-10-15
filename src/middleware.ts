import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminSessionCookie = request.cookies.get('admin_session');
    const correctPassword = process.env.ADMIN_PASSWORD;

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';

    if (!correctPassword) {
      return NextResponse.redirect(loginUrl);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(correctPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedCorrectPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (!adminSessionCookie || adminSessionCookie.value !== hashedCorrectPassword) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};