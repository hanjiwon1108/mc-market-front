import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { isBrowser } from '@/util/browser';

export function useSessionStorage(
  key: string,
  def: string = '',
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(def);

  useEffect(() => {
    if (isBrowser()) {
      const item = sessionStorage.getItem(key);
      if (item) setValue(item);
    }
  }, [key]);

  useEffect(() => {
    sessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
