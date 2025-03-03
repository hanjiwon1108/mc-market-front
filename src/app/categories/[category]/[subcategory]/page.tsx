import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import {
  CATEGORIES,
  Category,
  CategoryKey,
  TopCategoryKey,
} from '@/features/category';
import { redirect } from 'next/navigation';
import { UnknownCategoryHandler } from '@/app/categories/[category]/unknown-category-handler';
import { ProductSearch } from '@/components/product/search';
import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';
import { LucideIcon } from 'lucide-react';

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const awaitedParams = await params;
  const category = CATEGORIES[awaitedParams.category as TopCategoryKey];
  const subcategory = (category.subcategories as Record<string, Category>)[
    awaitedParams.subcategory
  ];

  console.log(awaitedParams.subcategory);
  if (!category) {
    return redirect('/categories/all?from_unknown=true');
  }

  if (!subcategory) {
    return redirect(category.link ?? '/categories/all');
  }

  const products = await fetch(
    endpoint(`/v1/products`) +
      `?category=${awaitedParams.subcategory}&order_by=time&limit=8`,
  ).then((res) =>
    res.ok ? (res.json() as Promise<MarketProductWithShortUser[]>) : null,
  );

  return (
    <div>
      <div className="bg-accent pt-8">
        <UnknownCategoryHandler />
        <div className="scrollbar-override-horizontal container mx-auto transition-all duration-300 ease-out lg:px-[5.75rem]">
          <div className="group flex items-center gap-2 text-3xl font-semibold">
            <p className="underline decoration-foreground/50 underline-offset-4 transition-all duration-300 ease-out group-hover:decoration-foreground">
              {category?.name} - {subcategory.name}
            </p>
            인기 제품
          </div>

          <div className="mt-4 flex h-[16.5rem] gap-4 overflow-y-visible overflow-x-scroll px-2 py-4">
            {products && products?.length > 0 ? (
              products?.map((it) => (
                <ProductCard
                  key={it.id}
                  id={it.id}
                  name={it.name}
                  price={it.price}
                  discountPrice={it.price_discount}
                  author={it.creator}
                />
              ))
            ) : (
              <div className="flex size-full items-center justify-center text-2xl font-semibold">
                해당하는 상품 없음
              </div>
            )}
          </div>
        </div>
      </div>
      <ProductSearch />
    </div>
  );
}
