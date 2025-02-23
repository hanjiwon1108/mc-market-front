'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@entropi-co/surge-ssr';

const cachedClient = async () => {
  const cookieStore = await cookies();

  // console.log(
  //   `[#cachedServerClient]: Token: ${JSON.stringify(cookieStore.get('entropi.surge.market.token'))}`,
  // );

  return createServerClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
    // storageKey: 'entropi.surge.market.token',
    debug: process.env['NEXT_PUBLIC_SURGE_DEBUG']?.toLowerCase() == 'true',
    cookieOptions: {
      domain: process.env['NEXT_PUBLIC_SURGE_COOKIE_DOMAIN'],
      secure:
        process.env['NEXT_PUBLIC_SURGE_COOKIE_SECURE']?.toLowerCase() == 'true',
    },
    storage: {
      getItem(key: string): string | null {
        return cookieStore.get(key)?.value ?? null;
      },
      setItem(key: string, value: string) {
        cookieStore.set(key, value);
      },
      removeItem(key: string) {
        cookieStore.delete(key);
      },
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach((it) => {
            cookieStore.set(it.name, it.value, it.options);
          });
        } catch {
          /* empty */
        }
      },
    },
    suppressGetSessionWarning: true,
  });
};

export const createServerSurgeClient = cachedClient;

export async function getSession() {
  const a = createServerSurgeClient()
    .then((it) => it.getSession())
    .then((it) => it.data.session);

  return a;
}

export async function getUser() {
  return createServerSurgeClient()
    .then((it) => it.getUser())
    .then((it) => it.data.user);
}
