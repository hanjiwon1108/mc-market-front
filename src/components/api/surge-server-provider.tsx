'use server';

import { SurgeProvider } from '@/components/api/surge-provider';
import { createServerSurgeClient } from '@/api/surge';
import { ChildrenProps } from '@/util/types-props';

export async function SurgeServerProvider({ children }: ChildrenProps) {
  const client = await createServerSurgeClient();

  return (
    <>
      {/* @ts-ignore-error */}
      <SurgeProvider
        data={{
          user: (await client.getUser()).data.user ?? null,
          session: (await client.getSession()).data.session ?? null,
        }}
      >
        {children}
      </SurgeProvider>
    </>
  );
}
