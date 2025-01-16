'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function UnknownCategoryHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('from_unknown') == 'true') {
      toast.warning('알 수 없는 카테고리입니다');
      const modifiedSearchParams = new URLSearchParams(searchParams.toString());
      modifiedSearchParams.delete('from_unknown');
      const queryString = modifiedSearchParams.toString();
      router.replace(`${pathname}?${queryString}`);
    }
  }, [pathname, router, searchParams]);

  return <></>;
}
