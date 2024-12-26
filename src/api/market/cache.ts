import React from 'react';
import { getSession } from '@/api/surge';
import { fetchMapleUser } from '@/api/market/endpoint';

const mapleUserCache = React.cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return await fetchMapleUser(session);
});

export async function getMapleUser() {
  return mapleUserCache();
}
