'use client';

import { ProductDetail } from '@/components/product/product-detail';
import { useParams, useRouter } from 'next/navigation';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { usePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import useSWR from 'swr';
import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const [isPresent, safeToRemove] = usePresence();
  const [isCloseTriggered, setCloseTriggered] = useState(false);
  const removeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const isMobile = useIsMobile();
  const id = useParams<{ id: string }>().id;

  useEffect(() => {
    if (!isPresent) {
      setCloseTriggered(false);
      clearTimeout(removeTimeout.current);
      removeTimeout.current = setTimeout(safeToRemove, 500);
    } else {
      clearTimeout(removeTimeout.current);
    }
  }, [isPresent, safeToRemove]);

  const product = useSWR(
    id ? endpoint(`/v1/products/${id}`) : undefined,
    (url) =>
      fetch(url).then(
        (res) => res.json() as Promise<MarketProductWithShortUser | undefined>,
      ),
  );
  const purchased = useSWR(
    id ? endpoint(`/v1/products/${id}/purchased`) : undefined,
    (url) => {
      if (!session) return false;
      return authFetch(session, url)
        .then((it) => it.text())
        .then((it) => it == 'true');
    },
  );

  const [productAvailable, setProductAvailable] = useState(product.data);
  useEffect(() => {
    if (product.data) {
      setProductAvailable(product.data);
    }
  }, [product.data]);

  return (
    <ResponsiveDialog
      isOpen={isPresent || isCloseTriggered}
      onOpenChange={() => {
        setCloseTriggered(true);
        router.back();
      }}
      key="intercept:/products"
    >
      <ResponsiveDialogContent
        aria-describedby={undefined}
        className="scrollbar-override flex max-h-[80dvh] flex-col overflow-hidden p-0 outline-none md:max-w-[80dvw] [&>button]:hidden"
      >
        <ResponsiveDialogClose />
        <VisuallyHidden>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Product Detail</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
        </VisuallyHidden>
        <div className="overflow-y-scroll p-4">
          {!productAvailable && !product.error && <>불러오는 중</>}
          {productAvailable && (
            <ProductDetail
              onBack={isMobile ? 'disabled' : router.back}
              product={productAvailable}
              purchased={purchased.data}
            />
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
