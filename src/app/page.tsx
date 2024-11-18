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

const CategoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button variant="secondary" size="lg" {...props} ref={ref} />;
  },
);

CategoryButton.displayName = 'CategoryButton';

type Category =
  | 'all'
  | 'modeling'
  | 'builds'
  | 'entities'
  | 'pixels'
  | 'free'
  | 'skins'
  | 'skill'
  | 'plugins'
  | 'scripts';

const categoryNames: { [K in Category]: string } = {
  all: '전체',
  modeling: '모델링',
  builds: '건축',
  entities: '엔티티',
  pixels: '픽셀',
  free: '무료',
  skins: '스킨',
  skill: '스킬',
  plugins: '플러그인',
  scripts: '스크립트',
};

export default function Home() {
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

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
                      {categoryNames[selectedCategory]}
                    </motion.div>
                  </AnimatePresence>
                  <ChevronDownIcon
                    className={`ml-auto transition-transform duration-300 ease-out ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={selectedCategory}
                    onValueChange={(v) => setSelectedCategory(v as Category)}
                  >
                    {Object.entries(categoryNames).map(([key, value]) => (
                      <DropdownMenuRadioItem key={key} value={key}>
                        {value}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              인기 상품
            </div>
            <div className="mt-4 flex gap-4 overflow-y-visible overflow-x-scroll px-4 pb-4">
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
      </div>
    </div>
  );
}
