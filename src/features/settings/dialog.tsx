import { settingOpenAtom } from '@/features/settings/atom';
import styles from './styles.module.css';
import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { useAtom } from 'jotai';
import {
  SETTING_DEFAULT_ENTRY,
  SETTING_ENTRY_COMPONENT_MAP,
  SettingEntry,
} from '@/features/settings/entry';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDesktopSafe } from '@/hooks/use-desktop';
import { AnimateWidth } from '@/components/animate/animate-size';
import { AnimatePresence } from 'framer-motion';
import { AnimateScaleFade } from '@/components/animate/animate-scale-fade';
import { SettingsNavigator } from '@/features/settings/components/navigator';

function Header() {
  const isDesktop = useDesktopSafe();
  const [entry, setEntry] = useAtom(settingOpenAtom);

  return (
    <div className="flex h-8 w-full">
      <div className="flex items-center text-3xl font-semibold">
        <AnimatePresence>
          {!isDesktop && entry != true && (
            <AnimateWidth duration={0.5}>
              <button
                onClick={() => setEntry(true)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
                }}
                className="mr-4 flex size-8 items-center justify-center rounded-full outline-none ring-ring transition-all duration-300 ease-primary focus-visible:ring-2 active:scale-125 active:bg-foreground/10"
              >
                <ArrowLeftIcon size={32} />
              </button>
            </AnimateWidth>
          )}
        </AnimatePresence>
        Settings
      </div>
      <div className="ml-auto">
        <button
          onClick={() => setEntry(null)}
          className="flex aspect-square h-full items-center justify-center rounded-full bg-foreground/5 outline-none ring-ring transition-all duration-300 ease-primary focus-visible:ring-2 pointer:hover:scale-125"
        >
          <XIcon size={20} />
        </button>
      </div>
    </div>
  );
}

function Main({ entry }: { entry: SettingEntry }) {
  const Component = SETTING_ENTRY_COMPONENT_MAP[entry];
  return (
    <div className="relative flex-1 bg-background">
      <AnimatePresence>
        <AnimateScaleFade className="absolute size-full" key={entry}>
          <Component />
        </AnimateScaleFade>
      </AnimatePresence>
    </div>
  );
}

export function SettingsDialog() {
  const isDesktop = useDesktopSafe();
  const [entry, setEntry] = useAtom(settingOpenAtom);

  const entryToRender = React.useMemo(
    () => entry ?? SETTING_DEFAULT_ENTRY,
    [entry],
  );

  useEffect(() => {
    if (isDesktop && entry == true) {
      setEntry(SETTING_DEFAULT_ENTRY);
    }
  }, [isDesktop, entry]);

  return (
    <div
      className={`lg:p-8 ${styles.overlay} ${entry ? '' : styles.hidden} ease-primary`}
    >
      <div
        className={`flex size-full flex-col bg-background p-6 shadow-2xl transition-all lg:rounded-xl ${entry ? '' : 'translate-y-full md:translate-y-0 md:scale-75'} duration-500 ease-primary`}
      >
        <Header />
        <div className="relative mt-2 flex flex-1">
          <AnimatePresence>
            {(isDesktop || entry == true) && (
              <AnimateScaleFade
                duration={0.5}
                className={cn(
                  'absolute w-full md:static md:w-auto',
                  entry != true ? 'md:block hidden' : '',
                )}
              >
                <SettingsNavigator />
              </AnimateScaleFade>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {entry != true && entryToRender != true && (
              <div className="relative w-full">
                <AnimateScaleFade duration={0.5} className={'absolute w-full'}>
                  <Main entry={entryToRender} />
                </AnimateScaleFade>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
