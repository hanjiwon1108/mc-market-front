'use server';

import { InsufficientPermission } from '@/app/admin/insufficient-permission';
import {
  getMapleUserPermission,
  MAPLE_USER_PERMISSION_ADMINISTRATOR,
} from '@/api/permissions';
import NotFound from '@/app/not-found';

export default async function Page() {
  const permission = await getMapleUserPermission(
    MAPLE_USER_PERMISSION_ADMINISTRATOR,
  );

  return <>{permission ? <NotFound /> : <InsufficientPermission />}</>;
}
