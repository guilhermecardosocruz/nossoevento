import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const res = NextResponse.next();

  // Security headers básicos
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy — ajustada para permitir Vercel e evitar erro em preview
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Permite scripts do próprio app + inline + Vercel (analytics e live reload)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // Conexões permitidas (API do app e Vercel)
      "connect-src 'self' https://vercel.live",
      // Caso use iframe futuramente, adicione domínios aqui
      "frame-src 'self'",
      "base-uri 'self'; form-action 'self'"
    ].join('; ')
  );

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

