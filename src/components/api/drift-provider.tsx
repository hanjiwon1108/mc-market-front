'use client';

import { MarketUser } from '@/api/types';
import { ChildrenProps } from '@/util/types-props';
import { useSession } from '@/api/surge';
import useSWR from 'swr';
import { fetchMapleUser } from '@/api/market/endpoint';
import { MapleContext } from '@/api/market/context';

export function MapleProvider({
  children,
  data,
}: { data?: { user: MarketUser | null } } & ChildrenProps) {
  const session = useSession();
  const user = useSWR(session, (s) => fetchMapleUser(s), {
    fallbackData: data?.user ?? undefined,
  });

  return (
    <MapleContext.Provider
      value={{
        user: user.data,
        updateUser: user.mutate,
        revalidateUser() {
          void user.mutate();
        },
      }}
    >
      {children}
    </MapleContext.Provider>
  );
}
