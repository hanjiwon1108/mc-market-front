'use client';

import { createContext, useContext } from 'react';
import { KeyedMutator } from 'swr/_internal';
import { MarketUser } from '@/api/types';

export type MapleContext = {
  user: MarketUser | undefined;
  updateUser: KeyedMutator<MarketUser | undefined>;
  revalidateUser: () => void;
};

export const MapleContext = createContext<MapleContext>({
  user: undefined,
  updateUser() {
    return new Promise(() => {});
  },
  revalidateUser() {},
});

export function useMaple() {
  return useContext(MapleContext);
}

export function useMapleUser() {
  return useMaple().user;
}
