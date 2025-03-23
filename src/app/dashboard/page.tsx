'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CircleDollarSignIcon, PlusCircleIcon } from 'lucide-react';
import { useMapleUser } from '@/api/market/context';
import { UserAvatar } from '@/components/user/avatar';

export default function Page() {
  const user = useMapleUser();

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center gap-4 p-4 md:flex-row">
        <UserAvatar userId={user?.id} className="h-40 w-40" />
        <h2 className="text-2xl font-semibold">
          판매자 정보: {user?.nickname}
          [id: {user?.id}]
        </h2>
      </Card>
      <div className="flex w-full flex-col gap-2 p-4 *:flex-1 md:flex-row md:p-0 md:*:max-w-64">
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
    </div>
  );
}
