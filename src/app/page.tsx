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
import { CATEGORIES, TopCategoryKey } from '@/features/category';
import Adcard from '@/components/adcard/adcard';

const CategoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button variant="secondary" size="lg" {...props} ref={ref} />;
  },
);

CategoryButton.displayName = 'CategoryButton';

export default function Home() {
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TopCategoryKey>('all');

  const products = useSWR(
    endpoint(`/v1/products`) +
      `?order_by=downloads&limit=8${selectedCategory != 'all' ? `&category=${selectedCategory}` : ''}`,
    (url) =>
      fetch(url).then((res) =>
        res.ok ? (res.json() as Promise<MarketProductWithShortUser[]>) : null,
      ),
  );

  return (
    <div className="h-full w-full">
      <div className="w-full">
        <Banner />
      </div>
      <Adcard />
      <div>
        <div className="transition-all duration-300 ease-out">
          <div className="h-full bg-background pl-4 pt-8 transition-all duration-300 ease-out">
            <div className="flex items-center gap-2 text-lg font-semibold md:text-3xl">
              <DropdownMenu
                open={isCategoryDropdownOpen}
                onOpenChange={setCategoryDropdownOpen}
                modal={false}
              >
                <DropdownMenuTrigger className="visible flex h-12 w-24 select-none items-center gap-2 rounded-xl border-0 px-4 py-2 outline-0 ring-ring ring-offset-2 transition-all hover:bg-accent focus-visible:ring-2 md:w-48">
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
                    onValueChange={(v) =>
                      setSelectedCategory(v as TopCategoryKey)
                    }
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
                products.data?.map((it) => <ProductCard key={it.id} {...it} />)
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
