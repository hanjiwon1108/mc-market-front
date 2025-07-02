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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const calculateRelative = (index: number, page: number) => {
    return index - page;
  };

  const getTranslate = useCallback(
    (relative: number) => `translateX(${relative * 100}%)`,
    [],
  );

  const getOpacity = useCallback(
    (relative: number) =>
      Math.abs(relative) > 1 ? 0 : index === page ? 1 : 0.7,
    [index, page],
  );

  const [styles, api] = useSpring(() => ({
    transform: getTranslate(calculateRelative(index, page)),
    opacity: getOpacity(calculateRelative(index, page)),
  }));

  const indexRef = useRef(index);

  useEffect(() => {
    const currentRelative = calculateRelative(index, page);

    api.start({
      transform: getTranslate(currentRelative),
      opacity: getOpacity(currentRelative),
    });

    indexRef.current = index;
  }, [getOpacity, getTranslate, index, page, api]);

  const handleClick = () => {
    if (data.link_url) {
      router.push(data.link_url);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <animated.div
      className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-md"
      style={styles}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {!imageLoaded && !imageError && (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {imageError && (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <div className="mb-2 text-6xl">📷</div>
          <div className="text-xl font-semibold">{data.title}</div>
          <div className="text-sm">이미지를 불러올 수 없습니다</div>
        </div>
      )}

      <img
        src={endpoint(data.image_url)}
        alt={data.title}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageError ? 'none' : 'block' }}
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
            className="absolute z-40 size-12 translate-x-[-24rem] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
            variant="ghost"
            onClick={() => dispatchIndex(-1)}
          >
            <ArrowLeftIcon size={20} className="text-white" />
          </Button>
          <Button
            className="absolute z-40 size-12 translate-x-[24rem] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
            variant="ghost"
            onClick={() => dispatchIndex(1)}
          >
            <ArrowRightIcon size={20} className="text-white" />
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
