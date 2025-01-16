import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';

export const cartAtom = atomWithStorage<string[]>('market.cart', []);

export function useCart() {
  const [value, setValue] = useAtom(cartAtom);

  return {
    value,
    setValue,
    addElement(id: string) {
      if (!value.includes(id)) {
        setValue((p) => [...p, id]);
      }
    },
    removeElement(id: string) {
      if (value.includes(id)) {
        setValue((p) => p.filter((it) => it != id));
      }
    },
  };
}

export function useIsInCart(id: string) {
  const [value, setValue] = useAtom(cartAtom);

  return value.includes(id);
}
