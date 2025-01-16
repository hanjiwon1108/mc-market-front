import { authFetch } from '@/api/surge/fetch';
import { Session } from '@entropi-co/surge-js';
import { MarketUser } from '@/api/types';
import { toast } from 'sonner';
import { isBrowser } from '@/util/browser';

export function getMapleURL() {
  return process.env['NEXT_PUBLIC_MAPLE_URL'];
}

export function endpoint(endpoint: string) {
  const href = new URL(endpoint, getMapleURL()).href;
  if (href.endsWith('/')) return href;
  else return href + '/';
}

export async function fetchMapleUser(session?: Session) {
  return await authFetch(session, endpoint('/v1/user/session'))
    .then((it) => it.json() as Promise<MarketUser>)
    .catch(() => isBrowser() ? void toast.error('An API error has occurred.') : undefined);
}
