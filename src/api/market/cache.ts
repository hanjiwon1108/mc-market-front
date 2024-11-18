import React from 'react';
import { createServerSurgeClient } from '@/api/surge';
import { fetchMapleUser } from '@/api/market/endpoint';

const mapleUserCache = React.cache(async () => {
  const client = await createServerSurgeClient();
  const session = await client.getSession().then((it) => it.data.session);
  if (!session) return null;
  return await fetchMapleUser(session!);
});

export async function getMapleUser() {
  return mapleUserCache();
}
