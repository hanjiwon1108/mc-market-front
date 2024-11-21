import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import { CATEGORIES, CategoryKey } from '@/features/category';
import { redirect } from 'next/navigation';
import { UnknownCategoryHandler } from '@/app/categories/[category]/unknown-category-handler';

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const awaitedParams = await params;
  const category = CATEGORIES[awaitedParams.category as CategoryKey];
  const subcategory = category.subcategories[awaitedParams.subcategory];

  if (!category) {
    return redirect('/categories/all?from_unknown=true');
  }

  if (!subcategory) {
    return redirect(category.link ?? '/categories/all');
  }

  return (
    <div className="bg-accent pt-8">
      <UnknownCategoryHandler />
      <div className="scrollbar-override-horizontal container mx-auto transition-all duration-300 ease-out lg:px-[5.75rem]">
        <div className="group flex items-center gap-2 text-3xl font-semibold">
          <p className="underline decoration-foreground/50 underline-offset-4 transition-all duration-300 ease-out group-hover:decoration-foreground">
            {category?.name} - {subcategory[1]}
          </p>{' '}
          인기 제품
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
  );
}
