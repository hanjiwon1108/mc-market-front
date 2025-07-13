'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function SettlementAccountSection() {
  const accountNumber = 'KB국민은행 352632371247218471238';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    toast.success('계좌번호가 복사되었습니다');
  };

  return (
    <div className="mt-1">
      <h3 className="mb-2 text-sm font-medium text-gray-600">내 정산 계좌</h3>
      <div className="flex items-center">
        <Input
          value={accountNumber}
          readOnly
          className="flex-grow border-gray-200 bg-gray-50 text-sm focus:border-gray-300 focus:ring-0"
        />
        <Button
          onClick={handleCopy}
          className="ml-2 h-9 bg-blue-500 px-3 text-sm text-white hover:bg-blue-600"
        >
          복사
        </Button>
        <Button
          variant="outline"
          className="ml-2 h-9 border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          수정
        </Button>
      </div>
    </div>
  );
}
