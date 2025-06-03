'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { animated, useSpring } from '@react-spring/web';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { endpoint } from '@/api/market/endpoint';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

const BANNER_COUNT = 7;
const BANNER_WIDTH = 52;
const BANNER_GAP = 4;

type BannerType = {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  created_at: string;
  index_num: number;
};

function BannerItem({
  index,
  page,
  data,
}: {
  index: number;
  page: number;
  data: BannerType;
}) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const calculateRelative = (index: number, page: number) => {
    if (index === 0 && page >= BANNER_COUNT - 3) return page - BANNER_COUNT;
    if (index === 1) {
      if (page === 0) return -1;
      if (page >= BANNER_COUNT - 2) return page - BANNER_COUNT;
    }
    if (index >= BANNER_COUNT - 2 && page === 0) return index - BANNER_COUNT;
    return page - index;
  };

  const getTranslate = useCallback(
    // (relative: number) => `${-relative * (BANNER_WIDTH + BANNER_GAP)}rem`,
    (relative: number) => `${-relative * (BANNER_WIDTH * 2 + BANNER_GAP)}rem`,
    [],
  );
  const getOpacity = useCallback(
    (relative: number) =>
      Math.abs(relative) > 1 ? 0.5 : index === page ? 1 : 0.8,
    [index, page],
  );

  const [styles, api] = useSpring(() => ({
    x: getTranslate(calculateRelative(index, page)),
    opacity: getOpacity(calculateRelative(index, page)),
  }));

  const indexRef = useRef(index);

  useEffect(() => {
    const previousRelative = calculateRelative(indexRef.current, page);
    const currentRelative = calculateRelative(index, page);

    api.start({
      x: getTranslate(currentRelative),
      opacity: getOpacity(currentRelative),
    });

    indexRef.current = index;
  }, [getOpacity, getTranslate, index, page, api]);

  const handleClick = () => {
    // Navigate to the banner's link URL
    if (data.link_url) {
      router.push(data.link_url);
    }
  };

  return (
    <animated.div
      className={`absolute flex cursor-pointer items-center justify-center overflow-hidden border bg-card text-5xl font-bold`}
      style={{
        ...styles,
        width: '100svw',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <img
        src={endpoint(data.image_url)}
        alt={data.title}
        className="h-auto w-full object-scale-down"
      />
    </animated.div>
  );
}

export function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [index, dispatchIndex] = useReducer(
    (state: number, delta: number) =>
      state === 0 && delta < 0
        ? banners.length - 1
        : (state + delta) % banners.length,
    0,
  );

  const getBanners = async () => {
    const response = await fetch(endpoint('/v1/banner/list'));
    if (!response.ok) throw new Error('Failed to fetch banners');
    const banners = await response.json();
    setBanners(banners);
  };

  useLayoutEffect(() => {
    getBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full justify-center">
      {!isMobile && (
        <div className="relative flex h-[28rem] w-full items-center justify-center gap-4 overflow-hidden">
          {banners.map((banner, idx) => (
            <BannerItem
              key={banner.id}
              index={idx}
              page={index}
              data={banner}
            />
          ))}
          <div className="z-50 translate-x-[24rem] translate-y-[10.5rem] select-none rounded-3xl bg-black/30 px-2 text-sm font-semibold text-white/80">
            {index + 1}/{banners.length}
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
      )}
      {isMobile && (
        <div
          className="relative flex items-center justify-center gap-4 overflow-hidden"
          style={{
            height: ref?.current?.offsetWidth
              ? ref.current.offsetWidth / 2
              : 'auto',
            width: '100%',
          }} // height is width half
          ref={ref}
        >
          {banners.map((banner, idx) => (
            <BannerItem
              key={banner.id}
              index={idx}
              page={index}
              data={banner}
            />
          ))}
          <div className="z-50 translate-x-[450%] translate-y-[6.5rem] select-none rounded-3xl bg-black/30 px-2 text-sm font-semibold text-white/80">
            {index + 1}/{banners.length}
          </div>
          <Button
            className="absolute z-40 size-8 translate-x-[-500%] rounded-full p-0"
            variant="outline"
            onClick={() => dispatchIndex(-1)}
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <Button
            className="absolute z-40 size-8 translate-x-[500%] rounded-full p-0"
            variant="outline"
            onClick={() => dispatchIndex(1)}
          >
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
