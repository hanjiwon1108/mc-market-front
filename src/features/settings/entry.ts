import React from 'react';
import { DeveloperInviteCodeSettings } from '@/features/settings/categories/developer/invite_code';
import { GeneralAppearanceSettings } from '@/features/settings/categories/general/appearance';
import { DeveloperUserSettings } from '@/features/settings/categories/developer/user';

export type SettingEntry =
  | 'general/appearance'
  | 'developer/invite_code'
  | 'developer/user';

export const SETTING_ENTRY_COMPONENT_MAP: {
  [K in SettingEntry]: () => React.ReactNode;
} = {
  'general/appearance': GeneralAppearanceSettings,
  'developer/invite_code': DeveloperInviteCodeSettings,
  'developer/user': DeveloperUserSettings,
};

export const SETTING_DEFAULT_ENTRY: SettingEntry = 'general/appearance';
