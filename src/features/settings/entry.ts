import React from 'react';
import { GeneralAppearanceSettings } from '@/features/settings/categories/general/appearance';

export type SettingEntry = 'general/appearance';
// | 'developer/invite_code'
// | 'developer/user';

export const SETTING_ENTRY_COMPONENT_MAP: {
  [K in SettingEntry]: () => React.ReactNode;
} = {
  'general/appearance': GeneralAppearanceSettings,
  // 'developer/invite_code': DeveloperInviteCodeSettings,
  // 'developer/user': DeveloperUserSettings,
};

export const SETTING_ENTRY_DISPLAY_MAP: {
  [K in SettingEntry]: () => React.ReactNode;
} = {
  'general/appearance': () => '일반: 디스플레이',
  // 'developer/invite_code': () => "",
  // 'developer/user': () => "개발자: 사용자",
};

export const SETTING_DEFAULT_ENTRY: SettingEntry = 'general/appearance';
