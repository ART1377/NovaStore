// proxy.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/prisma';

const PROTECTED_PATHS = ['/account', '/cart', '/checkout', '/notifications', '/admin'];

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = matchesPath(pathname, '/admin');
  const isProtectedRoute = PROTECTED_PATHS.some((path) => matchesPath(pathname, path));

  if (!isProtectedRoute) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Admin pages are role-protected at the routing boundary. A non-admin never
  // reaches the Admin Layout/Page, regardless of what the client renders.
  if (isAdminRoute) {
    const userId = typeof token.sub === 'string' ? token.sub : typeof token.id === 'string' ? token.id : null;

    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const runtime = 'nodejs';

export const config = {
  matcher: [
    '/account',
    '/account/:path*',
    '/cart',
    '/cart/:path*',
    '/checkout',
    '/checkout/:path*',
    '/notifications',
    '/notifications/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
