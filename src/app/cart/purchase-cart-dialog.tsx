import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { MarketProductWithShortUser } from '@/api/types';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import { useUser } from '@/api/surge';
import { useMapleUser } from '@/api/market/context';

export function PurchaseCartDialog({
  isOpen,
  onOpenChange,
  content,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  content: MarketProductWithShortUser[];
}) {
  const totalPrice = useMemo(
    () => content.map((it) => it.price).reduce((p, c) => p + c),
    [content],
  );

  const user = useMapleUser();

  const isAffordable = useMemo(
    () => user && user?.cash >= totalPrice,
    [user, totalPrice],
  );

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {content.length > 0 ? (
              <>{content.length}개의 상품 구매</>
            ) : (
              <>구매할 상품이 없습니다</>
            )}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        {content.length > 0 && (
          <>
            <div>
              {content.map((it) => (
                <div key={it.id}>
                  {it.name} by {it.description}: {it.price}
                </div>
              ))}
            </div>
              <div className="border"></div>
            전체 가격: {totalPrice}원<br />
            잔고: {user?.cash ?? 0}원
          </>
        )}

        <ResponsiveDialogFooter>
          <Button size="lg" className="flex gap-2" disabled={!isAffordable}>
            <CreditCardIcon />
            구매합니다
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
