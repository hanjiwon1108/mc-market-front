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
      {/* 로딩 상태 */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* 에러 상태 */}
      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
          <div className="mb-2 text-6xl">📷</div>
          <div className="text-xl font-semibold">{data.title}</div>
          <div className="text-sm">이미지를 불러올 수 없습니다</div>
        </div>
      )}

      {/* 이미지 - 에러가 없을 때만 렌더링 */}
      {!imageError && (
        <img
          src={endpoint(data.image_url)}
          alt={data.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </animated.div>
  );
}

export function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, dispatchIndex] = useReducer(
    (state: number, delta: number) =>
      state === 0 && delta < 0
        ? banners.length - 1
        : (state + delta) % banners.length,
    0,
  );

  const getBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(endpoint('/v1/banner/list'));
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data || []);
    } catch (error) {
      console.error('Banner fetch error:', error);
      // 배포 환경에서 API 실패 시 기본 배너 제공
      setBanners([
        {
          id: 1,
          title: 'MC Market',
          image_url: '/logo.png',
          link_url: '/',
          created_at: new Date().toISOString(),
          index_num: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    getBanners();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[28rem] w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      {!isMobile && (
        <div className="relative h-[28rem] w-full max-w-7xl overflow-hidden rounded-lg">
          {/* 배너 컨테이너 */}
          <div className="relative h-full w-full">
            {banners.map((banner, idx) => (
              <BannerItem
                key={banner.id}
                index={idx}
                page={index}
                data={banner}
              />
            ))}
          </div>

          {/* 네비게이션 UI - 배너가 여러 개일 때만 표시 */}
          {banners.length > 1 && (
            <>
              {/* 페이지 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-3xl bg-black/30 px-3 py-1 text-sm font-semibold text-white/90">
                {index + 1} / {banners.length}
              </div>

              {/* 왼쪽 버튼 */}
              <Button
                className="absolute left-4 top-1/2 z-40 size-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                variant="ghost"
                onClick={() => dispatchIndex(-1)}
                aria-label="이전 배너"
              >
                <ArrowLeftIcon size={20} className="text-white" />
              </Button>

              {/* 오른쪽 버튼 */}
              <Button
                className="absolute right-4 top-1/2 z-40 size-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0 shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                variant="ghost"
                onClick={() => dispatchIndex(1)}
                aria-label="다음 배너"
              >
                <ArrowRightIcon size={20} className="text-white" />
              </Button>
            </>
          )}
        </div>
      )}

      {isMobile && (
        <div
          className="relative w-full overflow-hidden rounded-lg"
          style={{
            height: ref?.current?.offsetWidth
              ? ref.current.offsetWidth / 2
              : '200px',
          }}
          ref={ref}
        >
          {/* 배너 컨테이너 */}
          <div className="relative h-full w-full">
            {banners.map((banner, idx) => (
              <BannerItem
                key={banner.id}
                index={idx}
                page={index}
                data={banner}
              />
            ))}
          </div>

          {/* 모바일 네비게이션 UI */}
          {banners.length > 1 && (
            <>
              {/* 페이지 인디케이터 */}
              <div className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 rounded-3xl bg-black/30 px-2 py-1 text-xs font-semibold text-white/90">
                {index + 1} / {banners.length}
              </div>

              {/* 왼쪽 버튼 */}
              <Button
                className="absolute left-2 top-1/2 z-40 size-8 -translate-y-1/2 rounded-full bg-white/80 p-0 shadow-md hover:bg-white"
                variant="ghost"
                onClick={() => dispatchIndex(-1)}
                aria-label="이전 배너"
              >
                <ArrowLeftIcon size={16} className="text-gray-700" />
              </Button>

              {/* 오른쪽 버튼 */}
              <Button
                className="absolute right-2 top-1/2 z-40 size-8 -translate-y-1/2 rounded-full bg-white/80 p-0 shadow-md hover:bg-white"
                variant="ghost"
                onClick={() => dispatchIndex(1)}
                aria-label="다음 배너"
              >
                <ArrowRightIcon size={16} className="text-gray-700" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
