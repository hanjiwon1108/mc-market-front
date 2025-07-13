'use client';
import React from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export function StatisticsSection() {
  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">거래 통계</h2>
        <Link
          href="/dashboard/all"
          className="text-sm text-gray-500 hover:underline"
        >
          전체보기 &gt;
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 rounded-lg border p-4 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">최근 거래 금액</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-lg border p-4 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">최근 판매 금액</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">0</span>
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
