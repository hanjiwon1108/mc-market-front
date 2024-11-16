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

export default function Page() {
  const router = useRouter();
  const [isPresent, safeToRemove] = usePresence();
  const [isCloseTriggered, setCloseTriggered] = useState(false);
  const removeTimeout = useRef<ReturnType<typeof setTimeout>>();

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
    <Dialog
      open={isPresent || isCloseTriggered}
      onOpenChange={() => {
        setCloseTriggered(true);
        router.back();
      }}
      key="intercept:/products"
    >
      <DialogContent
        aria-describedby={undefined}
        className="scrollbar-override flex max-h-[80dvh] max-w-[80dvw] flex-col overflow-hidden p-0 outline-none [&>button]:hidden"
      >
        <DialogClose />
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Product Detail</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="overflow-y-scroll p-4">
          <ProductDetail onBack={router.back} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
