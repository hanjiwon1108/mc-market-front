'use client';

import { InsufficientPermission } from '@/app/admin/insufficient-permission';
import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import useSWRInfinite from 'swr/infinite';
import { MarketProductWithShortUser } from '@/api/types';
import { endpoint } from '@/api/market/endpoint';
import useSWR from 'swr';
import { useCart } from '@/core/cart/atom';

export default function Page() {
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
    <div className="flex flex-1 flex-col md:p-16">
      <div className="p-4">
        <p className="text-3xl font-semibold md:text-5xl">카트</p>
      </div>
      <div className="flex flex-1 flex-col p-2 md:rounded-lg md:border md:shadow-lg">
        {products.data && products.data.length != 0 ? (
          <>
            <div className="grid-rows-auto mb-20 grid w-full grid-cols-4 md:w-4/5">
              {products.data?.map(
                (it) =>
                  it && (
                    <ProductCard
                      key={it.id}
                      id={it.id}
                      name={it.name}
                      price={it.price}
                      discountPrice={it.price_discount}
                      creatorDisplayName={
                        it.creator.nickname ??
                        `@${it.creator.username}` ??
                        '알 수 없음'
                      }
                    />
                  ),
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
  );
}
