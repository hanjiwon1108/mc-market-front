'use client';

import React from 'react';
import { SettingsNavigatorEntry } from '@/features/settings/components/navigator';

export default function SettingsNavigatorClientEntries() {
  return (
    <>
      <SettingsNavigatorEntry entry="developer/user" />
    </>
  );
}
