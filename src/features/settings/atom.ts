import { atom } from 'jotai';
import { SettingEntry } from '@/features/settings/entry';

export const settingOpenAtom = atom<SettingEntry | true | null>(null);
