import { ChildrenProps } from '@/util/types-props';
import React from 'react';
import Link from 'next/link';

export default async function Layout({ children }: ChildrenProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 페이지 내용 */}
      <main className="flex flex-col">
        {/* 네비게이션 헤더 바 */}
        <div className="shadow-sm">
          <div className="flex">
            <Link href="/dashboard" className="px-6 py-4 text-2xl font-bold">
              대시보드
            </Link>
            <Link
              href="/dashboard/products"
              className="px-6 py-4 text-2xl text-gray-600 hover:text-black"
            >
              상품관리
            </Link>
            <Link
              href="/dashboard/revenue"
              className="px-6 py-4 text-2xl text-gray-600 hover:text-black"
            >
              정산관리
            </Link>
          </div>
        </div>

        {/* 실제 페이지 컨텐츠 */}
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
