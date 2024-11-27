import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import { CATEGORIES, CATEGORY_ALL, CategoryKey } from '@/features/category';
import { redirect } from 'next/navigation';
import { UnknownCategoryHandler } from '@/app/categories/[category]/unknown-category-handler';
import {Input} from "@/components/ui/input";
import {ProductSearch} from "@/components/product/search";

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
      <div>
        <div className="bg-accent pt-8">
          <UnknownCategoryHandler/>
          <div
              className="scrollbar-override-horizontal container mx-auto transition-all duration-300 ease-out lg:px-[5.75rem]">
            <div className="flex items-center gap-2 text-3xl font-semibold">
              {category?.name} 인기 제품
            </div>

            <div className="mt-4 flex gap-4 overflow-y-visible overflow-x-scroll px-2 py-4">
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
            </div>
          </div>
        </div>

        <ProductSearch/>
      </div>
  );
}
