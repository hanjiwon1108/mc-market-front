'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';

type CashButtonProps = {
  selected: boolean;
  CashAmount: number;
  disabled: boolean;
  onClick: () => void;
};

export default function CashButton({
  selected,
  disabled,
  CashAmount,
  onClick,
}: CashButtonProps) {
  const isMobile = useIsMobile();
  return (
    <Button
      className={`btn h-20 ${!isMobile ? 'w-56' : 'w-36'} text-lg ${!selected ? 'bg-white text-black' : 'bg-black text-white'}`}
      onClick={onClick}
      disabled={disabled}
    >
      +{CashAmount.toLocaleString()}원
    </Button>
  );
}
