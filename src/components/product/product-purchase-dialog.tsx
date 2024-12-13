import { MarketProduct, MarketProductWithShortUser } from '@/api/types';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';
import { useMapleUser } from '@/api/market/context';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import { useCart } from '@/core/cart/atom';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { useSWRConfig } from 'swr';

export function ProductPurchaseDialog({
  isOpen,
  onOpenChange,
  product,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  product: MarketProductWithShortUser;
}) {
  const user = useMapleUser();
  const session = useSession();
  const swrConfig = useSWRConfig();

  const cart = useCart();

  const [isPurchasing, setPurchasing] = useState(false);

  function onPurchase() {
    if (!session) return;

    setPurchasing(true);
    authFetch(session, endpoint(`/v1/products/${product.id}/purchase`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    }).then((r) => {
      let purchasedState = false;

      if (r.status == 409) {
        purchasedState = true;
        toast.error(`중복된 구매: ${product.name}`);
        cart.removeElement(product.id);
        onOpenChange(false);
      } else if (r.ok) {
        purchasedState = true;
        cart.removeElement(product.id);
        toast.info(`아이템을 구매했습니다`);
        onOpenChange(false);
      } else {
        toast.error(`아이템을 구매하지 못했습니다.`);
      }

      if (purchasedState) {
        void swrConfig.mutate(
          endpoint(`/v1/products/${product.id}/purchase`),
          true,
        );
      }

      setPurchasing(false);
    });
  }

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>구매하기</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>{product.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>설명</TableCell>
              <TableCell>{product.description}</TableCell>
            </TableRow>
            {product.usage && (
              <TableRow>
                <TableCell>사용</TableCell>
                <TableCell>{product.usage}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>크리에이터</TableCell>
              <TableCell>
                {product.creator.nickname ?? `${product.creator.username}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>마지막 업데이트</TableCell>
              <TableCell>{product.updated_at}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>가격</TableCell>
              <TableCell>
                {product.price_discount ? (
                  <div className="flex gap-1">
                    <s className="italic text-destructive">{product.price}원</s>
                    {`> ${product.price_discount}원 `}
                    <b>(할인)</b>
                  </div>
                ) : (
                  <>{product.price}원</>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>현재 잔고</TableHead>
              <TableHead>구매 후 잔고</TableHead>
              <TableHead>거래 금액</TableHead>
            </TableRow>
            <TableRow>
              <TableCell>{user?.cash}원</TableCell>
              <TableCell>
                {(user?.cash ?? 0) - (product.price_discount ?? product.price)}
                원
              </TableCell>
              <TableCell>{product.price_discount ?? product.price}원</TableCell>
            </TableRow>
          </TableHeader>
        </Table>

        <ResponsiveDialogFooter>
          <Button
            size="lg"
            className="gap-2"
            onClick={onPurchase}
            disabled={isPurchasing}
          >
            <CreditCardIcon />
            구매
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
