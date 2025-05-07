'use client';

import { Avatar } from '@/components/ui/avatar';
import React from 'react';
import Link from 'next/link';
import { endpoint } from '@/api/market/endpoint';
import { FallbackImage } from '@/components/util/fallback-image';
import { MarketProductWithShortUser } from '@/api/types';
import { UserAvatar } from '@/components/user/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

export type ProductCardProps = {
  isBig?: boolean;
} & MarketProductWithShortUser;

export function ProductCard(props: ProductCardProps) {
  const isMobile = useIsMobile();
  return (
    <Link
      scroll={false}
      href={`/products/${props.id}`}
      className={
        'group cursor-pointer overflow-hidden rounded-2xl p-2 transition duration-300 hover:shadow-lg ' +
        (!(props.isBig && isMobile) ? 'min-w-52 max-w-52' : 'min-w-full')
      }
    >
      <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-2xl border">
        <FallbackImage
          width={640}
          height={480}
          src={endpoint(`/v1/products/${props.id}/image`)}
          alt="Product Image"
        />
        <Avatar />
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {/* 1라인: 제목 */}
        <p className="flex text-lg font-bold">
          <UserAvatar className="size-8" userId={props.creator.id} />
          {props.name}
        </p>

        {/* 2라인: 제작자 - 카테고리 */}
        <p className="text-sm text-gray-600">
          {props.creator.nickname ?? '@' + props.creator.username} -{' '}
          {props.category}
        </p>

        {/* 3라인: 소개 */}
        <p className="truncate text-sm text-gray-500">{props.description}</p>

        {/* 맨 아래줄: 왼쪽 가격, 오른쪽 조회수 */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold">
            {props.price === 0 ? (
              <span className="text-green-500">무료</span>
            ) : props.price_discount ? (
              <>
                <span className="mr-1 text-red-500 line-through">
                  {props.price.toLocaleString()}원
                </span>
                <span>{props.price_discount.toLocaleString()}원</span>
              </>
            ) : (
              <span>{props.price.toLocaleString()}원</span>
            )}
          </div>
          {/* <div className="text-sm text-gray-500">
            조회수: {props.views.toLocaleString()}회
          </div> */}
        </div>
      </div>
    </Link>
  );
}
