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
import { useTheme } from 'next-themes';
import { NavigatorAside } from '@/components/navigator/navigator-aside';

export function ClientProvider({
  children,
  modal,
}: ChildrenProps & { modal: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Toaster richColors />
      {/* @ts-ignore-error */}
      <TooltipProvider>
        <SettingsDialog />
        <AnimatePresence>
          <motion.div key={pathname}>
            <FrozenRouter>{modal}</FrozenRouter>
          </motion.div>
        </AnimatePresence>
        <div className="min-h-screen">
          <Navigator />
          <div className="flex min-h-[calc(100vh-var(--navigator-height))] overflow-x-hidden overflow-y-visible">
            <NavigatorAside />
            <div className="flex-1">{children}</div>
          </div>
        </div>
        <Footer />
      </TooltipProvider>
    </>
  );
}
