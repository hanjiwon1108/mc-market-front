import React from 'react';
import { GeneralAppearanceSettings } from '@/features/settings/categories/general/appearance';
import { UserProfileSettings } from '@/features/settings/categories/user/profile';

export type SettingEntry = keyof typeof SETTING_ENTRY_COMPONENT_MAP;

export const SETTING_ENTRY_COMPONENT_MAP = {
  'general/appearance': GeneralAppearanceSettings,
  'user/profile': UserProfileSettings,
} as const;

export const SETTING_ENTRY_DISPLAY_MAP: {
  [K in SettingEntry]: () => React.ReactNode;
} = {
  'general/appearance': () => '일반: 디스플레이',
  'user/profile': () => '유저: 프로필',
};

export const SETTING_DEFAULT_ENTRY: SettingEntry = 'general/appearance';
