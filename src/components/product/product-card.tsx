'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarIcon, UserRoundIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export function ProductCard() {
  return (
    <Link
      scroll={false}
      href="/products/540606408601633077"
      className="group min-w-64 cursor-pointer overflow-hidden rounded-2xl p-2 transition duration-300 hover:shadow-lg"
    >
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
    </Link>
  );
}
