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
<<<<<<< HEAD
      {permission ? children : <InsufficientPermissionScreen />}
=======
      {/* {permission ? children : <InsufficientPermissionScreen />} */}
      {children}
>>>>>>> 1dfcae7686fcf538aa911f810f245e3eac47a571
    </div>
  );
}
