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
import { SettingsDialog } from '@/features/settings/dialog';

export function ClientProvider({
  children,
  modal,
}: ChildrenProps & { modal: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Toaster richColors />
      <TooltipProvider>
        <SettingsDialog />
        <AnimatePresence>
          <motion.div key={pathname}>
            <FrozenRouter>{modal}</FrozenRouter>
          </motion.div>
        </AnimatePresence>
        <div className="flex min-h-screen flex-col">
          <Navigator />
          {children}
        </div>
        <Footer />
      </TooltipProvider>
    </>
  );
}
