import { getSession } from '@/api/surge';
import { fetchMapleUser } from '@/api/market/endpoint';

const mapleUserCache = async () => {
  const session = await getSession();
  if (!session) return null;
  return await fetchMapleUser(session);
};

export async function getMapleUser() {
  return mapleUserCache();
}
