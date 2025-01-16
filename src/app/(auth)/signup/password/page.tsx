'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { signUpPasswordInputAtom } from '@/app/(auth)/signup/password/atom';
import { ChildrenProps } from '@/util/types-props';
import { AnimatePresence, motion } from 'framer-motion';
import { SIGNUP_USERNAME_STORAGE_KEY } from '@/app/(auth)/signup/consts';
import { isBrowser } from '@/util/browser';

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

  useEffect(() => {
    if (isBrowser() && !sessionStorage.getItem(SIGNUP_USERNAME_STORAGE_KEY)) {
      router.push('/signup');
    }
  }, [router]);

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

  function handleProceed() {
    router.push('/signup/nickname');
  }

  return (
    <>
      <div className="container flex min-w-96 flex-col gap-4 px-12 md:px-0">
        <div>
          <p className="text-4xl font-semibold md:text-5xl">암호 설정</p>
          <p className="text-xl">보안을 강화하기</p>
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
            disabled={!isValidate}
            onClick={handleProceed}
          >
            계속
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
