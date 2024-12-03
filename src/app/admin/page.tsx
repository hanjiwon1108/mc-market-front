import { Button } from '@/components/ui/button';
import { ChildrenProps } from '@/util/types-props';
import Link from 'next/link';
import React from 'react';
import { Rows4Icon, UserRoundIcon } from 'lucide-react';

function AdministratorOption({
  children,
  href,
}: ChildrenProps & { href: string }) {
  return (
    <Link href={href} legacyBehavior>
      <Button variant="outline" size="lg" className="flex gap-2 w-full justify-start">
        {children}
      </Button>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4">
        <p className="md:text-5xl text-3xl font-semibold">Market 관리자 콘솔</p>
        <p className="mt-2 md:text-3xl text-xl">환영합니다</p>
      </div>
      <div className="mt-2 flex flex-1 flex-col items-start gap-2 md:rounded-2xl border p-2 md:shadow-lg">
        <AdministratorOption href="/admin/users">
          <UserRoundIcon /> 유저 목록
        </AdministratorOption>
        <AdministratorOption href="/admin/products">
          <Rows4Icon /> 제품 관리자
        </AdministratorOption>
      </div>
    </div>
  );
}
