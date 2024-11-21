import { CATEGORIES, CATEGORY_ALL, CategoryKey } from '@/features/category';
import { OptionalLink } from '@/components/util/optional-link';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  CreditCardIcon,
  PlusIcon,
  ShoppingCartIcon,
  UploadIcon,
} from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import React from 'react';
import { MarketProduct } from '@/api/types';
import { ChildrenProps } from '@/util/types-props';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const sampleProduct: MarketProduct = {
  id: '540606408601633077',

  category: 'modeling',

  name: '에메랄드 검',
  description: '에메랄드 검 3d 모델링입니다',
  usage: '리소스팩에 포함해서 사용',
  tags: ['weapon'],

  price: '2500원',
  discountPrice: '2250원',
  discountRate: 0.1,

  likes: 25,
  downloads: 79,

  createdAt: new Date(1204416000000),
  updatedAt: new Date(1204418000000),
};

const SmallCard = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ChildrenProps & { tooltip?: string }
>(({ children, tooltip, ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          {...props}
          className={cn(
            'flex w-min items-center gap-2 rounded-xl border px-4 py-2 transition duration-300 hover:bg-accent active:scale-95',
            props.className,
          )}
          ref={ref}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
});
SmallCard.displayName = 'SmallCard';

const TagCard = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ChildrenProps & { tag?: string }
>((props, ref) => {
  return (
    <SmallCard
      size="sm"
      variant="secondary"
      {...props}
      tooltip={`태그: ${props.tag}`}
      ref={ref}
    />
  );
});
TagCard.displayName = 'TagCard';

function ViewSelect() {
  return (
    <div className="relative size-32 overflow-hidden rounded-2xl border-2 transition-all hover:border-accent-foreground">
      <Image
        src="https://static.wikia.nocookie.net/minecrafttrapped/images/8/89/Emerald_Sword.png/revision/latest?cb=20200910073142"
        fill={true}
        className="scale-75 object-contain"
        style={{
          imageRendering: 'pixelated',
        }}
        alt="Product Image"
      />
    </div>
  );
}

function Display({
  name,
  children,
}: ChildrenProps & { name: React.ReactNode }) {
  return (
    <div>
      <div className="text-xl font-semibold">· {name}</div>
      <div className="ml-6 text-lg">{children}</div>
    </div>
  );
}

type ProductDetailProps = {
  onBack?: (() => void) | 'go_to_category' | 'disabled';
};

export function ProductDetail({ onBack }: ProductDetailProps) {
  const product = sampleProduct;

  const category = CATEGORIES[product.category as CategoryKey] ?? CATEGORY_ALL;

  return (
    <div className="flex justify-center">
      <div className="container flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {onBack != 'disabled' && (
            <OptionalLink
              href={onBack == 'go_to_category' ? category.link : undefined}
            >
              <Button
                className="size-12 rounded-full p-0"
                variant="ghost"
                onClick={() => {
                  if (typeof onBack === 'function') {
                    onBack();
                  }
                }}
              >
                <ChevronLeftIcon size={32} />
              </Button>
            </OptionalLink>
          )}
          <p className="text-3xl font-semibold">{category.name}</p>
        </div>
        <div className="grid grid-cols-1 grid-rows-[min-content_auto] gap-6 gap-x-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-xl border-2">
            <Image
              src="https://static.wikia.nocookie.net/minecrafttrapped/images/8/89/Emerald_Sword.png/revision/latest?cb=20200910073142"
              fill={true}
              className="object-contain"
              style={{
                imageRendering: 'pixelated',
              }}
              alt="Product Image"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="mt-2 text-2xl">{product.description}</div>
            <div className="mt-auto">
              <div className="flex flex-wrap gap-2">
                <TagCard tag="최신">최신</TagCard>
                <TagCard tag="최신">인증됨</TagCard>
              </div>
              <div className="mt-2 flex gap-2">
                <SmallCard tooltip={product.createdAt.toLocaleString()}>
                  <PlusIcon />
                  {dayjs(product.createdAt).format('YYYY/MM/DD')}
                </SmallCard>
                {product.createdAt.getTime() != product.updatedAt.getTime() && (
                  <SmallCard tooltip={product.updatedAt.toLocaleString()}>
                    <UploadIcon />
                    {dayjs(product.updatedAt).format('YYYY/MM/DD')}
                  </SmallCard>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 *:flex-1 *:gap-2 *:py-4 *:text-xl md:flex-row md:*:p-6">
                <Button size="lg">
                  <CreditCardIcon />
                  구매하기
                </Button>
                <Button size="lg" variant="outline">
                  <ShoppingCartIcon />
                  카트에 추가
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <ViewSelect />
              <ViewSelect />
            </div>
            <div className="mt-4">
              <Display name="상품 ID">{product.id}</Display>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
