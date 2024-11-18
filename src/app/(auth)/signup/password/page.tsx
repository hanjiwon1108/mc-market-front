'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CheckIcon, TriangleAlertIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { signUpPasswordInputAtom } from '@/app/(auth)/signup/password/atom';
import { ChildrenProps } from '@/util/types-props';
import { AnimatePresence, motion } from 'framer-motion';
import useSWRMutation from 'swr/mutation';
import { surgeEndpoint } from '@/api/surge/endpoint';
import { User } from '@entropi-co/surge-js';
import { Key } from 'swr';
import { SIGNUP_USERNAME_STORAGE_KEY } from '@/app/(auth)/signup/consts';

function PasswordRequirement({
  children,
  check,
}: ChildrenProps & { check?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {' '}
      <p className="max-w-64 text-sm font-bold text-gray-700">{children}</p>
      <div className="ml-auto size-6">
        <AnimatePresence>
          <motion.div
            key={`${check}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
          >
            {check ? (
              <CheckIcon color="green" />
            ) : (
              <TriangleAlertIcon color="red" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  const [value, setValue] = useAtom(signUpPasswordInputAtom);
  const validLength = useMemo(() => value.length >= 10, [value]);
  const validLetters = useMemo(
    () => /[0-9]/.test(value) || /[$&+,:;=?@#|'<>.^*()%!-]/.test(value),
    [value],
  );
  const isValidate = useMemo(
    () => value.trim() != '' && validLength && validLetters,
    [validLength, validLetters, value],
  );

  type Payload = { username: string; password: string };
  const signUpMutation = useSWRMutation<User, never, Key, Payload>(
    surgeEndpoint(`/v1/sign_up/credentials`),
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
    signUpMutation
      .trigger({
        username: sessionStorage.getItem(SIGNUP_USERNAME_STORAGE_KEY)!,
        password: value,
      })
      .then((it) => {
        router.push('/signup/completed');
      });
  }

  return (
    <>
      <div className="container flex min-w-96 flex-col gap-4 px-12 md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">
            마지막 단계입니다
          </p>
          <p className="text-xl">MC-Market 계정 생성하기</p>
        </div>
        <div>
          <Input
            type="password"
            placeholder="암호 입력"
            value={value}
            onValueChange={setValue}
          />
          <div className="mt-2 flex flex-col gap-1 pl-4">
            <p className="max-w-64 text-sm font-bold text-gray-700">
              안전한 암호 입력
            </p>
            <PasswordRequirement check={validLength}>
              12자 이상
            </PasswordRequirement>
            <PasswordRequirement check={validLetters}>
              1개 이상의 숫자 또는 특수 문자
            </PasswordRequirement>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            className="flex flex-1 gap-2 text-lg"
            size="lg"
            variant="ghost"
            onClick={router.back}
          >
            <ArrowLeftIcon />
            뒤로
          </Button>
          <Button
            className="flex flex-1 gap-2 text-lg font-semibold"
            size="lg"
            disabled={!isValidate || signUpMutation.isMutating}
            onClick={handleProceed}
          >
            완료
            <CheckIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
