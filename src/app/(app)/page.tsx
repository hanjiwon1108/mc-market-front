'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon, StarIcon, UserRoundIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Banner } from '@/components/banner/banner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {AnimatePresence, motion} from 'framer-motion';

const CategoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button variant="secondary" size="lg" {...props} ref={ref} />;
  },
);

CategoryButton.displayName = 'CategoryButton';

function ProductCard() {
  return (
    <div className="group min-w-64 cursor-pointer overflow-hidden rounded-2xl p-2 transition duration-300 hover:shadow-lg">
      <div className="mt-2 aspect-[3/2] w-full overflow-hidden rounded-2xl border">
        <Image
          width={640}
          height={480}
          src="https://placehold.co/640x480"
          alt="Product Image"
        />
      </div>
      <div className="mt-2">
        <div className="flex gap-2">
          <Avatar className="size-8">
            <AvatarFallback>
              <UserRoundIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p>Uploader</p>
          </div>
        </div>

        <p className="text-xl font-semibold">제품 이름</p>
        <div className="flex">
          <div className="flex items-center gap-2 font-semibold">
            <StarIcon size={18} fill="yellow" strokeWidth={0} /> 5.0{' '}
            <p className="text-gray-500">(34)</p>
          </div>
          <div className="ml-auto font-semibold">2500원</div>
        </div>
      </div>
    </div>
  );
}

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
    <>
      <div className="mt-8">
        <Banner />
      </div>
      <div className="flex justify-center">
        <div className="container mt-8 transition-all duration-300 ease-out">
          {/*<div className="scrollbar-override-horizontal flex w-full justify-center">*/}
          {/*  <div className="my-8 flex gap-8 overflow-x-scroll p-4">*/}
          {/*    <CategoryButton>모델링</CategoryButton>*/}
          {/*    <CategoryButton>건축</CategoryButton>*/}
          {/*    <CategoryButton>엔티티</CategoryButton>*/}
          {/*    <CategoryButton>픽셀</CategoryButton>*/}
          {/*    <CategoryButton>무료</CategoryButton>*/}
          {/*    <CategoryButton>스킨</CategoryButton>*/}
          {/*    <CategoryButton>스킬</CategoryButton>*/}
          {/*    <CategoryButton>플러그인</CategoryButton>*/}
          {/*    <CategoryButton>스크립트</CategoryButton>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="scrollbar-override-horizontal">
            <div className="flex items-center gap-2 text-3xl font-semibold">
              <DropdownMenu
                open={isCategoryDropdownOpen}
                onOpenChange={setCategoryDropdownOpen}
              >
                <DropdownMenuTrigger className="visible h-12 flex w-48 select-none items-center gap-2 rounded-xl border-0 px-4 py-2 outline-0 ring-ring ring-offset-2 transition-all hover:bg-accent focus-visible:ring-2">
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
            <div className="mt-4 flex gap-4 overflow-y-visible overflow-x-scroll pb-4">
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
    </>
  );
}
