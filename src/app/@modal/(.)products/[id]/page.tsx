'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductDetail } from '@/components/product/product-detail';
import { useRouter } from 'next/navigation';
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

export default function Page() {
  const router = useRouter();
  const [isPresent, safeToRemove] = usePresence();
  const [isCloseTriggered, setCloseTriggered] = useState(false);
  const removeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log(isPresent);
    if (!isPresent) {
      setCloseTriggered(false);
      clearTimeout(removeTimeout.current);
      removeTimeout.current = setTimeout(safeToRemove, 500);
    } else {
      clearTimeout(removeTimeout.current);
    }
  }, [isPresent, safeToRemove]);

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
          <ProductDetail onBack={isMobile ? 'disabled' : router.back} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
