import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CircleDollarSignIcon, PlusCircleIcon } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex gap-2 w-full *:flex-1 md:*:max-w-64 md:flex-row flex-col md:p-0 p-4">
      <Link href="/dashboard/products">
        <Card>
          <CardContent className="flex flex-col gap-2 p-10 text-3xl">
            <PlusCircleIcon size={40} />
            상품 관리하기
          </CardContent>
        </Card>
      </Link>
      <Link href="/dashboard/revenue">
        <Card>
          <CardContent className="flex flex-col gap-2 p-10 text-3xl">
            <CircleDollarSignIcon size={40} />
            수익 보기
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
