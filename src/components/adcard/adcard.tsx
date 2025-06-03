import { endpoint } from '@/api/market/endpoint';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

type AdcardProps = {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  created_at: string;
  index_num: number;
};

export default function Adcard() {
  const [adcards, setAdcards] = useState<AdcardProps[]>([]);
  const router = useRouter();

  const getAdcards = async () => {
    const response = await fetch(endpoint('/v1/adcard/list'));
    if (!response.ok) throw new Error('Failed to fetch adcard');
    const banners = await response.json();
    setAdcards(banners);
  };

  useLayoutEffect(() => {
    getAdcards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="relative -mt-24 flex h-[10rem] items-center justify-center gap-0.5 overflow-hidden rounded-lg bg-background">
        {[0, 1, 2, 3, 4].map((slotIndex) => (
          <div
            key={slotIndex}
            className="h-full w-[12rem] flex-1 rounded-lg p-2"
          >
            {adcards[slotIndex] ? (
              <div
                onClick={() => router.push(adcards[slotIndex].link_url)}
                style={{
                  backgroundImage: `url(${adcards[slotIndex].image_url})`,
                  backgroundColor: 'white',
                }}
                className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-cover bg-center"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(adcards[slotIndex].link_url);
                  }
                }}
              >
                <span className="text-gray-500">Slot {slotIndex + 1}</span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                <span className="text-gray-500">
                  Slot {slotIndex + 1} Empty
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
