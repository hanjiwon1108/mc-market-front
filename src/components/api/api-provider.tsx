import { SurgeServerProvider } from '@/components/api/surge-server-provider';
import { DriftServerProvider } from '@/components/api/drift-server-provider';

import { ChildrenProps } from '@/util/types-props';

export function APIProvider({ children }: ChildrenProps) {
  return (
    <>
      {/* @ts-ignore-error */}
      <SurgeServerProvider>
        <DriftServerProvider>{children}</DriftServerProvider>
      </SurgeServerProvider>
    </>
  );
}
