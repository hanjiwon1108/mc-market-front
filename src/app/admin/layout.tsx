import { ChildrenProps } from '@/util/types-props';
import {
  getMapleUserPermission,
  MAPLE_USER_PERMISSION_ADMINISTRATOR,
} from '@/api/permissions';
import { InsufficientPermissionScreen } from '@/app/admin/insufficient-permission-screen';
import { getMapleUser } from '@/api/market/cache';

export default async function Layout({ children }: ChildrenProps) {
  const user = await getMapleUser();

  const permission = await getMapleUserPermission(
    MAPLE_USER_PERMISSION_ADMINISTRATOR,
  );

  return (
    <div className="flex size-full flex-col md:p-16">
      {permission ? children : <InsufficientPermissionScreen />}
      {/* {children} */}
    </div>
  );
}
