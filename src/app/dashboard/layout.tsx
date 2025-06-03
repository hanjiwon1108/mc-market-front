import { ChildrenProps } from '@/util/types-props';
import React from 'react';
import { getSession } from '@/api/surge';
import { ErrorScreen } from '@/components/error/error-screen';

export default async function Layout({ children }: ChildrenProps) {
  const session = await getSession();
  // if (!session) {
  //   return <ErrorScreen>로그인 필요합니다.</ErrorScreen>;
  // }

  return (
    <div className="w-full overflow-hidden">
      <main className="mb-[3.375rem] w-full gap-4 transition-all md:p-16">
        <div className="mb-4 flex items-center gap-2 px-4 pt-4 text-2xl font-semibold transition-all md:p-0 md:text-5xl">
          판매자 대쉬보드
        </div>
        {children}
      </main>
    </div>
  );
}
