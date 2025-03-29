'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon, CheckIcon, SkipForwardIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { ChildrenProps } from '@/util/types-props';
import {
  SIGNUP_NICKNAME_STORAGE_KEY,
  SIGNUP_USERNAME_STORAGE_KEY,
} from '@/app/(auth)/signup/consts';
import useSWRMutation from 'swr/mutation';
import { User } from '@entropi-co/surge-js';
import { Key } from 'swr';
import { isBrowser } from '@/util/browser';
import { signUpPasswordInputAtom } from '@/app/(auth)/signup/password/atom';
import { useAtom, useAtomValue } from 'jotai';
import { endpoint } from '@/api/market/endpoint';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { toast } from 'sonner';

function AnimateInOut({
  children,
  from,
}: ChildrenProps & { from: 'up' | 'down' }) {
  return (
    <motion.div
      variants={{
        target: { y: '0%', opacity: 1 },
        initial: { y: from == 'up' ? '100%' : '-100%', opacity: 0 },
        exit: { y: from == 'up' ? '100%' : '-100%', opacity: 0 },
      }}
      animate="target"
      initial="initial"
      exit="exit"
      transition={{
        duration: 0.3,
      }}
      className="absolute flex items-center gap-2"
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const password = useAtomValue(signUpPasswordInputAtom);

  useEffect(() => {
    if (
      isBrowser() &&
      pathname == '/signup/nickname' &&
      (!sessionStorage.getItem(SIGNUP_USERNAME_STORAGE_KEY) || password == '')
    ) {
      router.push('/signup');
    }
  }, [password, pathname, router]);

  const [value, setValue] = useSessionStorage(SIGNUP_NICKNAME_STORAGE_KEY, '');
  const isValidate = useMemo(() => value.trim() != '', [value]);

  function handleBack() {
    sessionStorage.setItem(SIGNUP_NICKNAME_STORAGE_KEY, value);
    router.back();
  }

  type Payload = { nickname?: string; username: string; password: string };
  const signUpMutation = useSWRMutation<User, never, Key, Payload>(
    endpoint(`/v1/user`),
    (u: string, { arg }: { arg: Payload }) =>
      fetch(u, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
        .then((it) => it.json())
        .then((it) => it as User),
  );

  function handleProceed() {
    const usernameRef = sessionStorage.getItem(SIGNUP_USERNAME_STORAGE_KEY)!;
    const nicknameRef = value;
    const passwordRef = password;

    signUpMutation
      .trigger({
        username: usernameRef,
        nickname: nicknameRef ?? undefined,
        password: passwordRef,
      })
      .then((it) => {
        console.log(it);
        if (it['code']) {
          toast.error(
            '닉네임을 중복됩니다. 다른 닉네임을 입력해주세요. ' + it['message'],
          );
          return;
        }
        router.push('/signup/completed');
      });
  }

  return (
    <>
      <div className="container flex min-w-96 flex-col gap-4 px-12 md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">이름 설정</p>
          <p className="text-xl">세부 사항 입력 및 완료</p>
        </div>
        <div>
          <Input
            placeholder="닉네임 입력"
            value={value}
            onValueChange={setValue}
          />
          <div className="mt-1 flex gap-1 pl-4">
            <p className="text-red-500">*</p>
            <p className="max-w-64 text-sm font-bold text-gray-700">
              특수 문자 제외한 모든 문자 사용 가능
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            className="flex flex-1 gap-2 text-lg"
            size="lg"
            variant="ghost"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            뒤로
          </Button>
          <Button
            className="relative flex-1 overflow-hidden text-lg font-semibold duration-300"
            size="lg"
            variant={isValidate ? 'default' : 'secondary'}
            onClick={handleProceed}
          >
            <AnimatePresence initial={false}>
              {isValidate ? (
                <AnimateInOut from="down" key="continue">
                  완료
                  <CheckIcon />
                </AnimateInOut>
              ) : (
                <AnimateInOut from="up" key="skip">
                  건너뛰고 완료
                  <SkipForwardIcon />
                </AnimateInOut>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </>
  );
}
