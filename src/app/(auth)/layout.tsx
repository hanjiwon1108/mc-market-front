'use client';

import { FrozenRouter } from '@/components/router/frozen-router';
import { ChildrenProps } from '@/util/types-props';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Variant,
} from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { EASE_PRIMARY } from '@/util/ease';

type Direction = 'forward' | 'backward';

const STAGE_WEIGHTS: Record<string, number> = {
  '/signup': 0,
  '/signup/nickname': 1,
  '/signup/password': 2,
  '/signup/complete': 3,
  '/signin': 4,
} as const;

const ANIMATE_FORWARD: TargetAndTransition = {
  x: '50%',
  opacity: 0,
  filter: 'blur(0.125rem)',
};

const ANIMATE_BACKWARD: TargetAndTransition = {
  x: '-50%',
  opacity: 0,
  filter: 'blur(0.125rem)',
};

const ANIMATE_TARGET: TargetAndTransition = {
  x: '0%',
  opacity: 1,
  filter: 'blur(0rem)',
};

function calculateDirection(refStage: string, currentStage: string): Direction {
  return (STAGE_WEIGHTS[currentStage] ?? 0) - (STAGE_WEIGHTS[refStage] ?? 0) >=
    0
    ? 'forward'
    : 'backward';
}

export default function Layout({ children }: ChildrenProps) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  return (
    <>
      <div className="relative flex size-full flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence
          custom={calculateDirection(pathnameRef.current, pathname)}
        >
          <motion.div
            variants={{
              initial: (direction: Direction) =>
                direction == 'forward' ? ANIMATE_FORWARD : ANIMATE_BACKWARD,
              target: ANIMATE_TARGET,
              exit: (direction: Direction) =>
                direction == 'forward' ? ANIMATE_BACKWARD : ANIMATE_FORWARD,
            }}
            transition={{
              ease: EASE_PRIMARY,
              duration: 0.5,
            }}
            custom={calculateDirection(pathnameRef.current, pathname)}
            initial="initial"
            animate="target"
            exit="exit"
            className="absolute"
            key={pathname}
          >
            <FrozenRouter>
              <AnimatePresence>{children}</AnimatePresence>
            </FrozenRouter>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
