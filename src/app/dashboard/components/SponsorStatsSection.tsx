'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CircleIcon, UserRound } from 'lucide-react';

export function SponsorStatsSection() {
  const [period, setPeriod] = useState('전체');
  const periods = ['전체', '오늘', '1주일', '1개월', '3개월'];

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">후원 통계</h2>

      <div className="mb-6 flex border-b">
        {periods.map((p) => (
          <button
            key={p}
            className={`mr-4 pb-2 ${period === p ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
        <div className="ml-auto flex items-center">
          <div className="flex items-center rounded border">
            <Input type="date" defaultValue="2022-06-30" className="border-0" />
            <span className="px-2">-</span>
            <Input type="date" defaultValue="2022-07-04" className="border-0" />
          </div>
          <Button className="ml-2 bg-blue-500 text-white">조회</Button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex flex-1 items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
            <Plus />
          </div>
          <div>
            <div className="text-sm text-gray-500">후원 추수</div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold">***</span>
              <span className="ml-1">건</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
            <CircleIcon />
          </div>
          <div>
            <div className="text-sm text-gray-500">후원 금액</div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold">***</span>
              <span className="ml-1">원화</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
            <UserRound />
          </div>
          <div>
            <div className="text-sm text-gray-500">후원 인원수</div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold">***</span>
              <span className="ml-1">명</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
