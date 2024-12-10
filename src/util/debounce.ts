import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export function useDebouncedState<T>(
  initial: T,
  delay: number = 500,
): [T, Dispatch<SetStateAction<T>>, T, Dispatch<SetStateAction<T>>] {
  const [internalState, setInternalState] = useState(initial);
  const [debouncedState, setDebouncedState] = useState(internalState);

  const updateDebouncedValue = useDebounceCallback(setDebouncedState, delay);

  useEffect(() => {
    updateDebouncedValue(internalState);
  }, [internalState, updateDebouncedValue]);

  return [debouncedState, setInternalState, internalState, setDebouncedState];
}
