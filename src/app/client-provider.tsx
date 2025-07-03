'use client';

import { ChildrenProps } from '@/util/types-props';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { FrozenRouter } from '@/components/router/frozen-router';
import { Navigator } from '@/components/navigator/navigator';
import { Footer } from '@/components/footer/footer';
import { usePathname } from 'next/navigation';
import { SettingsDialog } from '@/features/settings/dialog';
import { NavigatorAside } from '@/components/navigator/navigator-aside';
import { updateViewportCSSVariables } from '@/util/browser';

export function ClientProvider({
  children,
  modal,
}: ChildrenProps & { modal: React.ReactNode }) {
  const pathname = usePathname();

  // 애플리케이션 시작 시 브라우저 크기 측정 초기화
  useEffect(() => {
    updateViewportCSSVariables();
  }, []);

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
        <div className="min-h-screen">
          <Navigator />
          <div className="flex min-h-[calc(100vh-var(--navigator-height))] overflow-x-hidden overflow-y-visible">
            <NavigatorAside />
            <div className="flex flex-1 flex-col items-start justify-start">
              <div className="w-full flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
