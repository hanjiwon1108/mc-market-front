'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, KeyIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { toast } from 'sonner';
import { surgeEndpoint } from '@/api/surge/endpoint';
import { SIGNUP_USERNAME_STORAGE_KEY } from '@/app/(auth)/signup/consts';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useSessionStorage } from '@/hooks/use-session-storage';

export default function Page() {
  const router = useRouter();

  const [isDuplicateModalOpen, setDuplicateModalOpen] = useState(false);

  const [value, setValue] = useSessionStorage(SIGNUP_USERNAME_STORAGE_KEY);
  const isValidate = useMemo(() => value.trim() != '', [value]);

  const checkUsernameMutation = useSWRMutation(
    surgeEndpoint(`/v1/username/${value}`),
    (u) =>
      fetch(u)
        .then((it) => it.text())
        .then((it) => it == 'true'),
  );

  function handleProceed() {
    if ('sessionStorage' in window)
      sessionStorage.setItem(SIGNUP_USERNAME_STORAGE_KEY, value);

    checkUsernameMutation
      .trigger()
      .then((exists) => {
        if (exists) {
          setDuplicateModalOpen(true);
        } else {
          router.push('/signup/password');
        }
      })
      .catch((e) => {
        toast.error(`Failed to check username: ${e}`);
      });
  }

  return (
    <>
      <ResponsiveDialog
        isOpen={isDuplicateModalOpen}
        onOpenChange={setDuplicateModalOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>중복된 아이디</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              이 아이디은 중복되었습니다.
              <br />
              다른 아이디로 시도하십시오
            </ResponsiveDialogDescription>
            <div className="p-2 text-2xl font-semibold">{value}</div>
          </ResponsiveDialogHeader>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <div className="container flex min-w-96 flex-col gap-4 px-12 transition-all ease-out md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">환영합니다</p>
          <p className="text-xl">MC-Market 계정 생성하기</p>
        </div>
        <div>
          <Input
            placeholder="아이디 입력"
            value={value}
            onValueChange={(v) => {
              setValue(v.toLowerCase().replace(/[^a-z0-9]/g, ''));
            }}
            disabled={checkUsernameMutation.isMutating}
          />
          <div className="mt-1 flex gap-1 pl-4">
            <p className="text-red-500">*</p>
            <p className="max-w-64 text-sm font-bold text-gray-700">
              아이디는 영어로만 입력이 가능합니다. 아이디는 로그인할 때 사용되며
              이후 변경할 수 없습니다.
            </p>
          </div>
        </div>
        <Button
          className="flex gap-2 text-lg font-semibold"
          size="lg"
          disabled={!isValidate}
          onClick={handleProceed}
        >
          계속
          <ArrowRightIcon />
        </Button>
        <div className="relative flex items-center justify-center">
          <div className="absolute bg-background px-2 font-semibold text-gray-600">
            또는
          </div>
          <div className="h-0.5 w-full bg-border"></div>
        </div>
        <Button
          className="flex gap-2 text-lg font-semibold"
          size="lg"
          variant="ghost"
          onClick={() => router.push('/signin')}
        >
          로그인
          <KeyIcon />
        </Button>
      </div>
    </>
  );
}
