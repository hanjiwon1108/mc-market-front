'use client';

import { createContext, useContext } from 'react';
import { Session, User } from '@entropi-co/surge-js';

export type SurgeContext = {
  user: User | null;
  session: Session | null;
};

export const SurgeContext = createContext<SurgeContext>({
  user: null,
  session: null,
});

export function useSurge() {
  return useContext(SurgeContext);
}

export function useUser() {
  return useSurge().user;
}

export function useSession() {
  return useSurge().session;
}
