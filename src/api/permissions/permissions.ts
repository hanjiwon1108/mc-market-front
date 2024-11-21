import { useMapleUser } from '@/api/market/context';

export type MapleUserPermission = number;

export const MAPLE_USER_PERMISSION_ISSUE_INVITE_CODE = 0x1;
export const MAPLE_USER_PERMISSIONS_AVAILABLE = {
  MAPLE_USER_PERMISSION_ISSUE_INVITE_CODE:
    MAPLE_USER_PERMISSION_ISSUE_INVITE_CODE,
};

export function useMapleUserPermission(flag: MapleUserPermission) {
  const user = useMapleUser();

  return user ? (user?.permissions & flag) == flag : false;
}

export function checkPermission(
  v: MapleUserPermission,
  flag: MapleUserPermission,
) {
  return (v & flag) == flag;
}
