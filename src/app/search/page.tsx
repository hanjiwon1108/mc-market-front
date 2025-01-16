'use client';

import { useSearchParams } from 'next/navigation';
import { ProductSearch } from '@/components/product/search';
import { useEffect, useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const [keywords, setKeywords] = useState(searchParams.get('keywords') ?? '');

  useEffect(() => {
    setKeywords(searchParams.get('keywords') ?? keywords);
  }, [searchParams]);

  return (
    <>
      <ProductSearch
        initialKeywords={keywords ?? undefined}
      />
    </>
  );
}
