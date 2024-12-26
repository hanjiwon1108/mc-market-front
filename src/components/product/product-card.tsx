'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarIcon, UserRoundIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { endpoint } from '@/api/market/endpoint';
import { FallbackImage } from '@/components/util/fallback-image';

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  creatorDisplayName: string;
};

export function ProductCard(props: ProductCardProps) {
  return (
    <Link
      scroll={false}
      href={`/products/${props.id}`}
      className="group min-w-52 max-w-52 cursor-pointer overflow-hidden rounded-2xl p-2 transition duration-300 hover:shadow-lg"
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
      <div className="mt-2">
        <div className="flex gap-2">
          <Avatar className="size-8">
            <AvatarFallback>
              <UserRoundIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <p>{props.creatorDisplayName}</p>
          </div>
        </div>

        <p className="text-xl font-semibold">{props.name}</p>
        <div className="flex">
          {/*<div className="flex items-center gap-2 font-semibold">*/}
          {/*  <StarIcon size={18} fill="yellow" strokeWidth={0} /> 5.0*/}
          {/*  <p className="text-gray-500">(34)</p>*/}
          {/*</div>*/}
          <div className="ml-auto font-semibold">
            {props.price == 0 ? (
              <p className="text-green-400">무료</p>
            ) : (
              `${props.price}원`
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
