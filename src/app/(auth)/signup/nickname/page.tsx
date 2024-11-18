'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, SkipForwardIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ChildrenProps } from '@/util/types-props';
import { SIGNUP_NICKNAME_STORAGE_KEY } from '@/app/(auth)/signup/consts';

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

  const [value, setValue] = useState(
    sessionStorage.getItem(SIGNUP_NICKNAME_STORAGE_KEY) ?? '',
  );
  const isValidate = useMemo(() => value.trim() != '', [value]);

  function handleBack() {
    sessionStorage.setItem(SIGNUP_NICKNAME_STORAGE_KEY, value);
    router.back();
  }

  function handleProceed() {
    sessionStorage.setItem(SIGNUP_NICKNAME_STORAGE_KEY, value);
    router.push('/signup/password');
  }

  return (
    <>
      <div className="container flex min-w-96 flex-col gap-4 px-12 md:px-0">
        <div>
          <p className="md:text-5xl text-4xl font-semibold">이름 설정</p>
          <p className="text-xl">세부 사항 입력</p>
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
                  계속
                  <ArrowRightIcon />
                </AnimateInOut>
              ) : (
                <AnimateInOut from="up" key="skip">
                  건너뛰기
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
