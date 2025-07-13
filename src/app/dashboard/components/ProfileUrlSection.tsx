'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfileUrlSection() {
  const profileUrl = 'https://toon.at/donate/tfs_wonjua';

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
  };

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-base font-medium">내 프로필 페이지</h3>
      <div className="flex items-center">
        <Input value={profileUrl} readOnly className="flex-grow" />
        <Button onClick={handleCopy} className="ml-2 bg-blue-500 text-white">
          복사
        </Button>
        <Button variant="outline" className="ml-2">
          보기
        </Button>
      </div>
    </div>
  );
}
