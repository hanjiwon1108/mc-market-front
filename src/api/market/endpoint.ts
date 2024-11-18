import { authFetch } from '@/api/surge/fetch';
import { Session } from '@entropi-co/surge-js';
import { MarketUser } from '@/api/types';

export function getMapleURL() {
  return process.env['NEXT_PUBLIC_MAPLE_URL'];
}

export function endpoint(endpoint: string) {
  const href = new URL(endpoint, getMapleURL()).href;
  if (href.endsWith('/')) return href;
  else return href + '/';
}

export async function fetchMapleUser(session: Session) {
  return await authFetch(session, endpoint('/v1/user'))
    .then((it) => it.json() as Promise<MarketUser>)
    .catch(() => null);
}
