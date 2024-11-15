import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import {
  CalendarArrowUpIcon,
  DownloadIcon,
  HistoryIcon,
  StarIcon,
  ThumbsUpIcon,
  UserRoundIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CategoryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button variant="secondary" size="lg" {...props} ref={ref} />;
  },
);

CategoryButton.displayName = 'CategoryButton';

function ProductCard() {
  return (
    <Card className="group min-w-64 cursor-pointer overflow-hidden rounded-2xl p-2 transition duration-300 hover:shadow-lg">
      <div className="flex gap-2">
        <Avatar className="size-12">
          <AvatarFallback>
            <UserRoundIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <p>김세현</p>
          <p className="text-sm">크릿 소속</p>
        </div>
      </div>
      <div className="mt-2 aspect-square w-full overflow-hidden rounded-2xl border">
        <Image
          width={256}
          height={256}
          src="https://cnitsstudio-api.com:570/uploads/products/114/________.png"
          alt="Product Image"
        />
      </div>
      <div className="mt-2">
        <p className="text-xl font-semibold">까마귀가 앉은 나무</p>
        <div className="flex items-center gap-1 text-gray-500">
          2500 ₩ · <StarIcon size={18} fill="yellow" strokeWidth={0} /> 2.4
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="container transition-all duration-300 ease-out">
        <div className="scrollbar-override-horizontal flex w-full justify-center">
          <div className="my-8 flex gap-8 overflow-x-scroll p-4">
            <CategoryButton>모델링</CategoryButton>
            <CategoryButton>건축</CategoryButton>
            <CategoryButton>엔티티</CategoryButton>
            <CategoryButton>픽셀</CategoryButton>
            <CategoryButton>무료</CategoryButton>
            <CategoryButton>스킨</CategoryButton>
            <CategoryButton>스킬</CategoryButton>
            <CategoryButton>플러그인</CategoryButton>
            <CategoryButton>스크립트</CategoryButton>
          </div>
        </div>
        <div className="scrollbar-override-horizontal">
          <p className="text-3xl font-semibold">모델링 인기 상품</p>
          <div className="mt-4 flex gap-4 overflow-x-scroll overflow-y-visible pb-4">
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
  );
}
