'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { KeyIcon, UserRoundPlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Label } from '@/components/ui/label';
import { createBrowserSurgeClient } from '@/api/surge';
import { toast } from 'sonner';

export default function Page() {
  const router = useRouter();

  const [isNotFoundModalOpen, setNotFoundModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isUsernameValidate = useMemo(() => username.trim() != '', [username]);
  const isPasswordValidate = useMemo(() => password.trim() != '', [password]);

  function handleProceed() {
    createBrowserSurgeClient()
      .signInWithPassword({
        username,
        password,
      })
      .then((r) => {
        if (r.error) {
          toast.error(`로그인 실패: 아이디와 비밀번호를 다시 확인하세요`);
        } else {
          toast.info('로그인 완료, 홈으로 이동합니다...');
          router.push('/');
        }
      })
      .catch((e) => {
        toast.error(`로그인 실패: ${e}`);
      });
  }

  return (
    <>
      <ResponsiveDialog
        isOpen={isNotFoundModalOpen}
        onOpenChange={setNotFoundModalOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>중복된 아이디</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              이 아이디는 중복되었습니다.
              <br />
              다른 아이디 시도하십시오
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <div className="container flex min-w-96 flex-col gap-4 px-12 transition-all ease-out md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">로그인</p>
          <p className="text-xl">MC-Market에 로그인</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="auth:signin/username">아이디</Label>
          <Input
            id="auth:signin/username"
            placeholder="아이디 입력"
            value={username}
            onValueChange={setUsername}
          />

          <Label htmlFor="auth:signin/password">암호</Label>
          <Input
            type="password"
            id="auth:signin/password"
            placeholder="암호 입력"
            value={password}
            onValueChange={setPassword}
          />
        </div>
        <Button
          className="flex gap-2 text-lg font-semibold"
          size="lg"
          disabled={!isPasswordValidate || !isUsernameValidate}
          onClick={handleProceed}
        >
          로그인
          <KeyIcon />
        </Button>
        <div className="relative flex items-center justify-center">
          <div className="absolute bg-background px-2 font-semibold text-gray-600">
            또는
          </div>
          <div className="h-0.5 w-full bg-border"></div>
        </div>{' '}
        <Button
          className="flex gap-2 text-lg font-semibold"
          size="lg"
          variant="ghost"
          onClick={() => router.push('/signup')}
        >
          계정 생성
          <UserRoundPlusIcon />
        </Button>
      </div>
    </>
  );
}
