'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@entropi-co/surge-ssr';
import React from 'react';

const cachedClient = React.cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
    debug: process.env['NEXT_PUBLIC_SURGE_DEBUG']?.toLowerCase() == 'true',
    cookieOptions: {
      domain: process.env['NEXT_PUBLIC_SURGE_COOKIE_DOMAIN'],
      secure:
        process.env['NEXT_PUBLIC_SURGE_COOKIE_SECURE']?.toLowerCase() == 'true',
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
});

export const createServerSurgeClient = cachedClient;

export async function getSession() {
  return await createServerSurgeClient()
    .then((it) => it.getSession())
    .then((it) => it.data.session);
}

export async function getUser() {
  return await createServerSurgeClient()
    .then((it) => it.getUser())
    .then((it) => it.data.user);
}
