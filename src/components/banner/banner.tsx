'use client';

import { Card } from '@/components/ui/card';
import React, { useEffect, useReducer, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { animated, useSpringValue } from '@react-spring/web';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

const AnimatedCard = animated(Card);

const BANNER_COUNT = 7;
const DISPLAY_BANNERS = 3;
const BANNER_WIDTH = 52;
const BANNER_HEIGHT = 24;
const BANNER_GAP = 4;

function BannerItem({ index, page }: { index: number; page: number }) {
  function calculateRelative(index: number, page: number) {
    if (index == 0) {
      if (page >= BANNER_COUNT - 3) {
        return page - BANNER_COUNT;
      }
    }
    if (index == 1) {
      if (page == 0) {
        return -1;
      }
      if (page == BANNER_COUNT - 1) {
        return -2;
      }
      if (page == BANNER_COUNT - 2) {
        return -3;
      }
    }
    // Before Last
    if (index == BANNER_COUNT - 2) {
      if (page == 0) {
        return 2;
      }
    }
    // Last
    if (index == BANNER_COUNT - 1) {
      if (page == 0) {
        return 1;
      }
      if (page == 1) {
        return 2;
      }
    }
    return page - index;
  }
  function getTranslate(relative: number) {
    return `${calculateRelative(index, page) * (BANNER_WIDTH + BANNER_GAP)}rem`;
  }
  function getOpacity(relative: number) {
    return Math.abs(relative) > 1 ? 0.5 : index == page ? 1 : 0.8;
  }

  const translate = useSpringValue(
    getTranslate(calculateRelative(index, page)),
  );
  const opacity = useSpringValue(getOpacity(calculateRelative(index, page)));
  const indexRef = useRef(index);

  useEffect(() => {
    const previousRelative = calculateRelative(indexRef.current, page);
    const currentRelative = calculateRelative(index, page);

    if (Math.abs(currentRelative - previousRelative) == 1) {
      void translate.start(getTranslate(currentRelative));
    } else {
      translate.set(getTranslate(currentRelative));
    }
    void opacity.start(getOpacity(currentRelative));

    indexRef.current = index;
  }, [index, opacity, page, translate]);

  return (
    <animated.div
      className={`absolute flex h-[24rem] min-w-[52rem] items-center justify-center overflow-hidden rounded-xl bg-cyan-500 text-5xl font-bold`}
      style={{ x: translate, opacity }}
    >
      배너 {page + 1}/{BANNER_COUNT}
    </animated.div>
  );
}

export function Banner() {
  const [index, dispatchIndex] = useReducer((state: number, delta: number) => {
    return state == 0 && delta < 0
      ? BANNER_COUNT - 1
      : (state + delta) % BANNER_COUNT;
  }, 0);

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="relative flex h-[24rem] w-[144rem] items-center justify-center gap-4 overflow-hidden">
          {Array.from(Array(BANNER_COUNT).keys()).map((page) => {
            return <BannerItem key={page} index={index} page={page} />;
          })}
          <div className="z-50 translate-x-[24rem] translate-y-[10.5rem] select-none rounded-3xl bg-black/30 px-2 text-sm font-semibold text-white/80">
            {index + 1}/{BANNER_COUNT}
          </div>
          <Button
            className="absolute z-40 size-8 translate-x-[-24rem] rounded-full p-0"
            variant="outline"
            onClick={() => dispatchIndex(-1)}
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <Button
            className="absolute z-40 size-8 translate-x-[24rem] rounded-full p-0"
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
