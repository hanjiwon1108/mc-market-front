import React from 'react';
import {
  SETTING_ENTRY_DISPLAY_MAP,
  SettingEntry,
} from '@/features/settings/entry';
import { useAtom } from 'jotai/index';
import { settingOpenAtom } from '@/features/settings';
import { cn } from '@/lib/utils';
import { SettingsNavigatorEntries } from '@/features/settings/components/navigator-entries';
import SettingsNavigatorClientEntries from '@/features/settings/components/navigator-client-entries';

export function SettingsNavigatorEntry({
  entry,
  display = <>{SETTING_ENTRY_DISPLAY_MAP[entry]()}</>,
}: {
  display?: React.ReactNode;
  entry: SettingEntry;
}) {
  const [currentEntry, setEntry] = useAtom(settingOpenAtom);

  return (
    <button
      onClick={() => setEntry(entry)}
      className="pointer:hover:bg-accent-foreground/10 relative h-12 w-full overflow-hidden rounded-xl border-ring bg-accent-foreground/5 text-left text-lg outline-none ring-ring ring-offset-2 transition duration-200 ease-primary focus-visible:ring-[3px] active:scale-90"
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

export function SettingsNavigator() {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-2xl p-2 md:w-64 md:bg-accent">
      <SettingsNavigatorEntries />
      <SettingsNavigatorClientEntries />
    </div>
  );
}
