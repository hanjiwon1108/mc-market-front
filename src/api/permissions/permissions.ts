import { useMapleUser } from '@/api/market/context';
import { getMapleUser } from '@/api/market/cache';

export type MapleUserPermission = number;

export const MAPLE_USER_PERMISSION_ADMINISTRATOR = 0x1;
export const MAPLE_USER_PERMISSION_LIST_USERS = 0x2;
export const MAPLE_USER_PERMISSION_MANAGE_PRODUCTS = 0x4;
export const MAPLE_USER_PERMISSION_MANAGE_USER = 0x8;
export const MAPLE_USER_PERMISSION_MANAGE_ARTICLES = 0x16;

export const MAPLE_USER_PERMISSIONS_AVAILABLE = {
  MAPLE_USER_PERMISSION_ADMINISTRATOR: MAPLE_USER_PERMISSION_ADMINISTRATOR,
  MAPLE_USER_PERMISSION_LIST_USERS: MAPLE_USER_PERMISSION_LIST_USERS,
};

export function useMapleUserPermission(flag: MapleUserPermission) {
  const user = useMapleUser();

  return user ? (user?.permissions & flag) == flag : false;
}

export async function getMapleUserPermission(flag: MapleUserPermission) {
  const user = await getMapleUser();
  if (!user) return false;

  return checkPermission(user.permissions, flag);
}

export function checkPermission(
  v: MapleUserPermission,
  flag: MapleUserPermission,
) {
  return (v & flag) == flag;
}
