'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Banner } from '@/components/banner/banner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from '@/components/product/product-card';
import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';
import useSWR from 'swr';
import { CATEGORIES, CategoryKey } from '@/features/category';

const CategoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button variant="secondary" size="lg" {...props} ref={ref} />;
  },
);

CategoryButton.displayName = 'CategoryButton';

export default function Home() {
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  const products = useSWR(
    endpoint(`/v1/products`) +
      `?order_by=downloads&limit=8${selectedCategory != 'all' ? `&category=${selectedCategory}` : ''}`,
    (url) =>
      fetch(url).then((res) =>
        res.ok ? (res.json() as Promise<MarketProductWithShortUser[]>) : null,
      ),
  );

  return (
    <div className="h-full pt-8">
      <div>
        <Banner />
      </div>
      <div>
        <div className="container mx-auto transition-all duration-300 ease-out lg:px-[0rem] xl:px-[9rem]">
          <div className="scrollbar-override-horizontal h-full border-x-2 bg-background pt-8 transition-all duration-300 ease-out lg:px-14">
            <div className="flex items-center gap-2 text-3xl font-semibold">
              <DropdownMenu
                open={isCategoryDropdownOpen}
                onOpenChange={setCategoryDropdownOpen}
                modal={false}
              >
                <DropdownMenuTrigger className="visible flex h-12 w-48 select-none items-center gap-2 rounded-xl border-0 px-4 py-2 outline-0 ring-ring ring-offset-2 transition-all hover:bg-accent focus-visible:ring-2">
                  <AnimatePresence>
                    <motion.div
                      key={selectedCategory}
                      exit={{ x: '-50%', opacity: 0 }}
                      animate={{ x: '0%', opacity: 1 }}
                      initial={{ x: '50%', opacity: 0 }}
                      className="absolute"
                    >
                      {CATEGORIES[selectedCategory].name}
                    </motion.div>
                  </AnimatePresence>
                  <ChevronDownIcon
                    className={`ml-auto transition-transform duration-300 ease-out ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={selectedCategory}
                    onValueChange={(v) => setSelectedCategory(v as CategoryKey)}
                  >
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <DropdownMenuRadioItem key={key} value={key}>
                        {value.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              인기 상품
            </div>
            <div className="mt-4 flex gap-4 overflow-y-visible overflow-x-scroll px-4 pb-4">
              {products.data && products.data?.length > 0 ? (
                products.data?.map((it) => (
                  <ProductCard
                    key={it.id}
                    id={it.id}
                    name={it.name}
                    price={it.price}
                    discountPrice={it.price_discount}
                    creatorDisplayName={
                      it.creator.nickname ?? it.creator.username ?? 'Unknown'
                    }
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
      </div>
    </div>
  );
}
