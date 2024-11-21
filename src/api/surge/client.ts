import { createBrowserClient } from '@entropi-co/surge-ssr';

/**
 * This function returns a new or cached browser surge client.
 * That means this can be called without caching additionally in everywhere including component render.
 */
export function createBrowserSurgeClient() {
  return createBrowserClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
    storageKey: 'entropi.surge.market.token',
    debug: process.env['NEXT_PUBLIC_SURGE_DEBUG']?.toLowerCase() == 'true',
    cookieOptions: {
      domain: process.env['NEXT_PUBLIC_SURGE_COOKIE_DOMAIN'],
      secure:
        process.env['NEXT_PUBLIC_SURGE_COOKIE_SECURE']?.toLowerCase() == 'true',
    },
    fetch: fetch,
    suppressGetSessionWarning: true,
  });
}
