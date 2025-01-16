import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@entropi-co/surge-ssr';

export default async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: req,
  });

  const client = createServerClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
    // storageKey: 'entropi.surge.market.token',
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach((it) => req.cookies.set(it.name, it.value));
        response = NextResponse.next({ request: req });
        toSet.forEach((it) => req.cookies.set(it.name, it.value));
      },
    },
  });

  const session = (await client.getSession()).data.session;
  const path = req.nextUrl.pathname;

  // console.log(`[#middleware.ts]: cookies: ${req.cookies}`);

  if (session) {
    if (path.startsWith('/signin')) {
      return NextResponse.redirect(req.nextUrl.origin);
    }
    if (path.startsWith('/signup') && !path.endsWith('/completed')) {
      return NextResponse.redirect(req.nextUrl.origin);
    }
  }

  return response;
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
