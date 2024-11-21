import React, { Suspense } from 'react';
import { SettingEntry } from '@/features/settings/entry';
import { useAtom } from 'jotai/index';
import { settingOpenAtom } from '@/features/settings';
import { cn } from '@/lib/utils';
import { SettingsNavigatorEntries } from '@/features/settings/components/navigator-entries';
import { LoadFallback } from '@/components/providers';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/spinner';

export function SettingsNavigatorEntry({
  display,
  entry,
}: {
  display: string;
  entry: SettingEntry;
}) {
  const [currentEntry, setEntry] = useAtom(settingOpenAtom);

  return (
    <button
      onClick={() => setEntry(entry)}
      className="relative h-12 w-full overflow-hidden rounded-xl border-ring bg-accent-foreground/5 text-left text-lg outline-none ring-ring ring-offset-2 transition duration-200 ease-primary focus-visible:ring-[3px] active:scale-90 pointer:hover:bg-accent-foreground/10"
    >
      <div className="pl-2">{display}</div>
      <div className="absolute bottom-1 flex w-full justify-center">
        <div
          className={cn(
            'h-1 rounded-full transition-all duration-500 ease-primary md:bg-muted-foreground',
            currentEntry == entry ? 'w-11/12' : 'w-0 opacity-0',
          )}
        ></div>
      </div>
    </button>
  );
}

const SettingsNavigatorClientEntries = dynamic(
  () => import('@/features/settings/components/navigator-client-entries'),
  {
    loading: LoadFallback,
  },
);

export function SettingsNavigator() {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-2xl p-2 md:w-64 md:bg-accent">
      <SettingsNavigatorEntries />
      <SettingsNavigatorClientEntries />
    </div>
  );
}
