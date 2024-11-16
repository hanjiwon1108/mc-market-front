'use client';

import { Card } from '@/components/ui/card';
import React, { useEffect, useReducer, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { animated, useSpringValue } from '@react-spring/web';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

const AnimatedCard = animated(Card);

const bannerCount = 7;
const displayBanners = 3;

function BannerItem({ index, page }: { index: number; page: number }) {
  function calculateRelative(index: number, page: number) {
    if (index == 0) {
      if (page >= bannerCount - 3) {
        return page - bannerCount;
      }
      if (page == bannerCount - 1) {
        // 6
        return -1;
      }
      if (page == bannerCount - 2) {
        // 5
        return -2;
      }
      if (page == bannerCount - 3) {
        // 4
        return -3;
      }
    }
    if (index == 1) {
      if (page == 0) {
        return -1;
      }
      if (page == bannerCount - 1) {
        return -2;
      }
      if (page == bannerCount - 2) {
        return -3;
      }
    }
    // Before Last
    if (index == bannerCount - 2) {
      if (page == 0) {
        return 2;
      }
    }
    // Last
    if (index == bannerCount - 1) {
      if (page == 0) {
        return 1;
      }
      if (page == 1) {
        return 2;
      }
    }
    return page - index;
  }

  const translate = useSpringValue(`${calculateRelative(index, page) * 33}rem`);
  const opacity = useSpringValue(
    Math.abs(calculateRelative(index, page)) > 1 ? 0.5 : 1,
  );
  const indexRef = useRef(index);

  useEffect(() => {
    const previousRelative = calculateRelative(indexRef.current, page);
    const currentRelative = calculateRelative(index, page);

    if (Math.abs(currentRelative - previousRelative) == 1) {
      void translate.start(`${currentRelative * 33}rem`);
    } else {
      translate.set(`${currentRelative * 33}rem`);
    }
    if (Math.abs(currentRelative) > 1) {
      void opacity.start(0.5);
    } else {
      void opacity.start(1);
    }

    indexRef.current = index;
  }, [index, page, translate]);

  return (
    <animated.div
      className="absolute flex h-64 min-w-[32rem] items-center justify-center overflow-hidden rounded-xl bg-cyan-500 text-5xl font-bold"
      style={{ x: translate, opacity }}
    >
      배너 {page + 1}/{bannerCount}
    </animated.div>
  );
}

export function Banner() {
  const [index, dispatchIndex] = useReducer((state: number, delta: number) => {
    return state == 0 && delta < 0
      ? bannerCount - 1
      : (state + delta) % bannerCount;
  }, 0);

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="relative flex h-64 w-[99rem] items-center justify-center gap-4 overflow-hidden">
          {Array.from(Array(bannerCount).keys()).map((page) => {
            return <BannerItem key={page} index={index} page={page} />;
          })}
          <div className="z-50 translate-x-[14.25rem] translate-y-[6.75rem] select-none rounded-3xl bg-black/30 px-2 text-sm font-semibold text-white/80">
            {index}/{bannerCount}
          </div>
          <Button
            className="absolute z-40 size-8 translate-x-[-14.25rem] rounded-full p-0"
            variant="outline"
            onClick={() => dispatchIndex(-1)}
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <Button
            className="absolute z-40 size-8 translate-x-[14.25rem] rounded-full p-0"
            variant="outline"
            onClick={() => dispatchIndex(1)}
          >
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
