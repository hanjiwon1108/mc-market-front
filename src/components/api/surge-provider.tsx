'use client';

import { useEffect, useState } from 'react';
import { createBrowserSurgeClient, SurgeContext } from '@/api/surge';
import { ChildrenProps } from '@/util/types-props';

export function SurgeProvider({
  children,
  data,
}: { data?: SurgeContext } & ChildrenProps) {
  const client = createBrowserSurgeClient();
  const [user, setUser] = useState(data?.user);
  const [session, setSession] = useState(data?.session);

  useEffect(() => {
    client.onAuthStateChange((e, s) => {
      setSession(s);
      client
        .getUser()
        .then((it) => it.data.user)
        .then(setUser);
    });
  }, [client]);

  return (
    <SurgeContext.Provider
      value={{
        user: user ?? null,
        session: session ?? null,
      }}
    >
      {children}
    </SurgeContext.Provider>
  );
}
