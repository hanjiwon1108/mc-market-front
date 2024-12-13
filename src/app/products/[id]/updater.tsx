'use client';

import { MarketProductWithShortUser } from '@/api/types';
import useSWR from 'swr';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { ProductDetail } from '@/components/product/product-detail';
import { useSession } from '@/api/surge';

export function PageUpdater({
  initialProduct,
  initialPurchased,
}: {
  initialProduct: MarketProductWithShortUser;
  initialPurchased: boolean;
}) {
  const session = useSession();

  const product = useSWR(endpoint(`/v1/products/${initialProduct.id}`), (u) =>
    fetch(u).then(
      (res) => res.json() as Promise<MarketProductWithShortUser | undefined>,
    ),
  );

  const purchased = useSWR(
    endpoint(`/v1/products/${initialProduct.id}/purchase`),
    (u) =>
      session &&
      authFetch(session, u)
        .then((it) => it.text())
        .then((it) => it == 'true'),
  );

  return (
    <>
      <ProductDetail
        product={product.data ?? initialProduct}
        purchased={purchased.data === null ? initialPurchased : purchased.data}
      />
    </>
  );
}
