import React from 'react';
import { SettingsNavigatorEntry } from '@/features/settings/components/navigator';

export function SettingsNavigatorEntries() {
  return (
    <>
      {' '}
      <SettingsNavigatorEntry
        display="General: Appearance"
        entry="general/appearance"
      />
    </>
  );
}
