'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import { MarketProductWithShortUser } from '@/api/types';
import { endpoint } from '@/api/market/endpoint';
import useSWR from 'swr';
import { useCart } from '@/core/cart/atom';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import { PurchaseCartDialog } from '@/app/cart/purchase-cart-dialog';

export default function Page() {
  const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const { value: cartItems } = useCart();

  const products = useSWR(cartItems, function (productIds) {
    return Promise.all(
      productIds.map((id) =>
        fetch(endpoint(`/v1/products/${id}`)).then((response) =>
          response.ok
            ? (response.json() as Promise<MarketProductWithShortUser>)
            : null,
        ),
      ),
    );
  });

  return (
    <>
      <PurchaseCartDialog
        isOpen={isPurchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        content={products.data?.filter((it) => !!it) ?? []}
      />

      <div className="flex flex-1 flex-col md:p-16">
        <div className="flex items-center p-4">
          <p className="text-3xl font-semibold md:text-5xl">카트</p>
          <Button
            size="lg"
            className="ml-auto flex gap-4"
            onClick={() => setPurchaseDialogOpen(true)}
          >
            <CreditCardIcon />
            모두 구매
          </Button>
        </div>
        <div className="flex flex-1 flex-col p-2 md:rounded-lg md:border md:shadow-lg">
          {products.data && products.data.length != 0 ? (
            <>
              <div className="grid-rows-auto mb-20 grid w-full grid-cols-4 md:w-4/5">
                {products.data?.map(
                  (it) => it && <ProductCard key={it.id} {...it} />,
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 select-none items-center justify-center text-3xl font-semibold">
              데이터가 없음
            </div>
          )}
        </div>
      </div>
    </>
  );
}
