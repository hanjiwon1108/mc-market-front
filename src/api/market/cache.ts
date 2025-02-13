import { unstable_cache } from 'next/cache';
import { getSession } from '@/api/surge';
import { fetchMapleUser } from '@/api/market/endpoint';

const mapleUserCache = unstable_cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return await fetchMapleUser(session);
});

export async function getMapleUser() {
  return mapleUserCache();
}
