'use client';

import { ChildrenProps } from '@/util/types-props';
import React from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { FrozenRouter } from '@/components/router/frozen-router';
import { Navigator } from '@/components/navigator/navigator';
import { Footer } from '@/components/footer/footer';
import { usePathname } from 'next/navigation';

export function ClientProvider({
  children,
  modal,
}: ChildrenProps & { modal: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Toaster richColors />
      <TooltipProvider>
        <AnimatePresence>
          <motion.div key={pathname}>
            <FrozenRouter>{modal}</FrozenRouter>
          </motion.div>
        </AnimatePresence>
        <div className="min-h-screen flex flex-col">
          <Navigator />
          {children}
        </div>
        <Footer />
      </TooltipProvider>
    </>
  );
}
