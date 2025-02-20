'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@entropi-co/surge-ssr';
import { unstable_cache } from 'next/cache';

// ✅ `cookies()`를 `unstable_cache()` 내부에서 사용하지 않도록 별도 함수로 분리
const getCookies = async () => {
  return cookies();
};

// ✅ `unstable_cache()`에서 `cookies()`를 제거하고, 클라이언트 생성만 캐싱
const cachedClient = unstable_cache(async () => {
  return createServerClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
    debug: process.env['NEXT_PUBLIC_SURGE_DEBUG']?.toLowerCase() === 'true',
    cookieOptions: {
      domain: process.env['NEXT_PUBLIC_SURGE_COOKIE_DOMAIN'],
      secure:
        process.env['NEXT_PUBLIC_SURGE_COOKIE_SECURE']?.toLowerCase() ===
        'true',
    },
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
    suppressGetSessionWarning: true,
  });
});

// ✅ `createServerSurgeClient()`에서 `cookies()`를 별도로 불러와 사용
export const createServerSurgeClient = async () => {
  const cookieStore = await getCookies();
  const client = await cachedClient();

  (client as any).setStorage({
    getItem: (key: string) => cookieStore.get(key)?.value ?? null,
    setItem: (key: string, value: string) => cookieStore.set(key, value),
    removeItem: (key: string) => cookieStore.delete(key),
  });

  (client as any).cookies = {
    getAll: () => cookieStore.getAll(),
    setAll: (toSet: { name: string; value: string; options: any }[]) => {
      try {
        toSet.forEach((it) => {
          cookieStore.set(it.name, it.value, it.options);
        });
      } catch {
        /* empty */
      }
    },
  };

  return client;
};

// ✅ `getSession()`에서 `createServerSurgeClient()`를 올바르게 호출
export async function getSession() {
  const client = await createServerSurgeClient();
  return client.getSession().then((it) => it.data.session);
}

// ✅ `getUser()`도 동일하게 수정
export async function getUser() {
  const client = await createServerSurgeClient();
  return client.getUser().then((it) => it.data.user);
}
