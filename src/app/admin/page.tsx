import { Button } from '@/components/ui/button';
import { ChildrenProps } from '@/util/types-props';
import Link from 'next/link';
import React from 'react';
import {Rows4Icon, UserRoundIcon} from 'lucide-react';

function AdministratorOption({
  children,
  href,
}: ChildrenProps & { href: string }) {
  return (
    <Link href={href} legacyBehavior>
      <Button variant="outline" size="lg" className="flex gap-2">
        {children}
      </Button>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-5xl font-semibold">Market 관리자 콘솔</p>
      <p className="mt-2 text-3xl">환영합니다</p>
      <div className="mt-2 flex flex-1 flex-col items-start gap-2 border p-2 rounded-2xl shadow-lg">
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
