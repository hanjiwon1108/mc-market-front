import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { MarketProductWithShortUser } from '@/api/types';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import { useMapleUser } from '@/api/market/context';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductRow } from '@/app/cart/product-row';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useSession } from '@/api/surge';
import { useCart } from '@/core/cart/atom';

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
    () =>
      content.length < 1
        ? null
        : content.map((it) => it.price).reduce((p, c) => p + c),
    [content],
  );

  const session = useSession();
  const user = useMapleUser();

  const isAffordable = useMemo(
    () => user && totalPrice && user?.cash >= totalPrice,
    [user, totalPrice],
  );

  const cart = useCart();

  const [isPurchasing, setPurchasing] = useState(false);

  function onPurchase() {
    setPurchasing(true);
    Promise.all(
      content.map((it) =>
        fetch(endpoint(`/v1/products/${it.id}/purchase`), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }).then((r) => [it, r] as [MarketProductWithShortUser, Response]),
      ),
    ).then((responses) => {
      responses.forEach(([p, r]) => {
        if (r.status == 409) {
          toast.error(`중복된 구매: ${p.name}`);
          cart.removeElement(p.id);
        }
        if (r.ok) {
          cart.removeElement(p.id);
        }
      });
      const successes = responses
        .map(([, r]) => (r.ok ? 1 : (0 as number)))
        .reduce((p, c) => p + c);
      const fails = responses.length - successes;

      setPurchasing(false);

      if (fails > 0) {
        toast.error(
          `${responses.length}개의 아이템 중 ${fails}개의 아이템을 구매하지 못했습니다`,
        );
      } else {
        toast.success(`${responses.length}개의 아이템을 모두 구매했습니다`);
        onOpenChange(false);
      }
    });
  }

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-full md:w-max md:min-w-96">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이미지</TableHead>
                <TableHead>크리에이터</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>가격</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((it) => (
                <ProductRow key={it.id} product={it} />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                  총{  ' '}
                  {content
                    .map((it) => it.price_discount ?? it.price)
                    .reduce((p, c) => p + c)}
                  원
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
        <ResponsiveDialogFooter>
          <Button
            size="lg"
            className="flex gap-2"
            disabled={!isAffordable || isPurchasing || content.length == 0}
            onClick={onPurchase}
          >
            <CreditCardIcon />
            구매
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
