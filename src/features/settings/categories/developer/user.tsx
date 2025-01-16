import { SettingsPage, SettingsSection } from '@/features/settings/components';
import { useUser } from '@/api/surge';
import { useMapleUser } from '@/api/market/context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import {
  checkPermission,
  MAPLE_USER_PERMISSIONS_AVAILABLE,
} from '@/api/permissions';

function InspectionTable({ data }: { data: [string, React.ReactNode][] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(([k, v]) => (
          <TableRow key={k}>
            <TableCell className="font-medium">{k?.toUpperCase()}</TableCell>
            <TableCell>
              {v === null
                ? 'null'
                : v === undefined
                  ? 'undefined'
                  : v == false
                    ? 'false'
                    : v == true
                      ? 'true'
                      : v}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PermissionsTable() {
  const driftUser = useMapleUser();

  const data: [string, string][] = React.useMemo(
    () =>
      driftUser
        ? Object.entries(MAPLE_USER_PERMISSIONS_AVAILABLE).map(
            ([name, flag]) => [
              name.substring('MAPLE_USER_'.length),
              checkPermission(driftUser?.permissions, flag) ? 'Yes' : 'No',
            ],
          )
        : [],
    [driftUser],
  );

  return <InspectionTable data={data} />;
}

export function DeveloperUserSettings() {
  const surgeUser = useUser();
  const driftUser = useMapleUser();

  const surgeInspection: [string, React.ReactNode][] = [
    ['id', surgeUser?.id],
    ['username', surgeUser?.username],
    [
      'created at',
      surgeUser?.created_at && new Date(surgeUser.created_at).toUTCString(),
    ],
    [
      'updated at',
      surgeUser?.updated_at && new Date(surgeUser.updated_at).toUTCString(),
    ],
  ];
  const driftInspection: [string, React.ReactNode][] = [
    ['id', driftUser?.id],
    ['nickname', `${driftUser?.nickname}`],
    ['permissions', driftUser?.permissions],
  ];

  return (
    <SettingsPage>
      <SettingsSection name="Inspection: Surge">
        <InspectionTable data={surgeInspection} />
      </SettingsSection>
      <SettingsSection name="Inspection: Market">
        <InspectionTable data={driftInspection} />
      </SettingsSection>
      <SettingsSection name="Permissions">
        <PermissionsTable />
      </SettingsSection>
    </SettingsPage>
  );
}
