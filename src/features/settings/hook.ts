import { useAtom } from 'jotai';
import { settingOpenAtom } from '@/features/settings/atom';
import { SETTING_DEFAULT_ENTRY, SettingEntry } from '@/features/settings/entry';
import { useIsMobile } from '@/hooks/use-mobile';

export function useSettingsDialog() {
  const isDesktop = !useIsMobile();
  const [open, setOpen] = useAtom(settingOpenAtom);

  return {
    open: (entry?: SettingEntry) =>
      setOpen(isDesktop ? (entry ?? SETTING_DEFAULT_ENTRY) : true),
    close: () => setOpen(null),
    toggle: () =>
      setOpen((p) => {
        if (p) return null;
        else return isDesktop ? SETTING_DEFAULT_ENTRY : true;
      }),
    isOpen: open,
  };
}
