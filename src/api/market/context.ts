'use client';

import { createContext, useContext } from 'react';
import { KeyedMutator } from 'swr/_internal';
import { MarketUser } from '@/api/types';

export type MapleContext = {
  user: MarketUser | null;
  updateUser: KeyedMutator<MarketUser | null>;
  revalidateUser: () => void;
};

export const MapleContext = createContext<MapleContext>({
  user: null,
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
