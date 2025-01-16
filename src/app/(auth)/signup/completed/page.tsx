'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  SIGNUP_NICKNAME_STORAGE_KEY,
  SIGNUP_USERNAME_STORAGE_KEY,
} from '@/app/(auth)/signup/consts';
import { useAtom, useSetAtom } from 'jotai';
import { signUpPasswordInputAtom } from '@/app/(auth)/signup/password/atom';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  const setPassword = useSetAtom(signUpPasswordInputAtom);

  useEffect(() => {
    // Clean up storage
    sessionStorage.removeItem(SIGNUP_USERNAME_STORAGE_KEY);
    sessionStorage.removeItem(SIGNUP_NICKNAME_STORAGE_KEY);
    setPassword('');
  }, [setPassword]);

  return (
    <>
      <div className="container flex min-w-96 flex-col gap-4 px-12 md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">완료</p>
          <p className="text-xl">회원가입 완료함</p>
          <div className="mt-2 flex flex-col gap-2">
            <Button size="lg" onClick={() => router.push('/signin')}>
              로그인하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/')}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
