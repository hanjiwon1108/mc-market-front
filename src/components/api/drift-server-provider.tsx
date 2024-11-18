'use server';

import { MapleProvider } from './drift-provider';
import { ChildrenProps } from '@/util/types-props';
import { getMapleUser } from '@/api/market/cache';

export async function DriftServerProvider({ children }: ChildrenProps) {
  const user = await getMapleUser();

  return (
    <MapleProvider
      data={{
        user: user,
      }}
    >
      {children}
    </MapleProvider>
  );
}
