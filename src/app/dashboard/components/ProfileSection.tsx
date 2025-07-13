'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface User {
  username?: string;
  id?: string;
}

export function ProfileSection({ user }: { user: User }) {
  const username = user?.username || 'MarsX512';

  return (
    <div className="mb-6 flex items-center">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-black text-white">
        <span className="font-bold text-white">프로필</span>
        <span className="font-bold text-white">사진</span>
      </div>
      <div className="ml-6">
        <h2 className="text-xl font-bold">내정보</h2>
        <div className="flex items-center">
          <span className="text-gray-500">제휴 ID</span>
          <span className="ml-2 font-medium">{username} ✓</span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 px-2 py-0 text-xs text-blue-600"
          >
            ID 구매요청
          </Button>
        </div>
      </div>
    </div>
  );
}
