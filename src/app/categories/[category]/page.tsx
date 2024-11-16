import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import { CATEGORIES, CATEGORY_ALL, CategoryKey } from '@/features/category';
import { redirect } from 'next/navigation';
import { UnknownCategoryHandler } from '@/app/categories/[category]/unknown-category-handler';

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category =
    CATEGORIES[(await params).category as CategoryKey] ?? CATEGORY_ALL;

  if (!category) {
    return redirect('/categories/all?from_unknown=true');
  }

  return (
    <>
      <UnknownCategoryHandler />
      <div className="flex justify-center transition-all lg:px-32">
        <div className="scrollbar-override-horizontal container">
          <div className="mt-8 flex items-center gap-2 text-3xl font-semibold">
            {category?.name} 인기 제품
          </div>

          <div className="mt-4 flex gap-4 overflow-y-visible overflow-x-scroll px-2 py-4">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </div>
    </>
  );
}
