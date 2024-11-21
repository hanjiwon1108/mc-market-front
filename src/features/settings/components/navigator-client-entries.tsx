'use client';

import React from 'react';
import { SettingsNavigatorEntry } from '@/features/settings/components/navigator';
import {
  DRIFT_USER_PERMISSION_ISSUE_INVITE_CODE,
  useDriftUserPermission,
} from '@/core/api/drift/user/permissions';

export default function SettingsNavigatorClientEntries() {
  const permissionIssueInviteCode = useDriftUserPermission(
    DRIFT_USER_PERMISSION_ISSUE_INVITE_CODE,
  );

  return (
    <>
      {permissionIssueInviteCode && (
        <SettingsNavigatorEntry
          display="Developer: Invite Code"
          entry="developer/invite_code"
        />
      )}
      <SettingsNavigatorEntry
        display="Developer: User"
        entry="developer/user"
      />
    </>
  );
}
