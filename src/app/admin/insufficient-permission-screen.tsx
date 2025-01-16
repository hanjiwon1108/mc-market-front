import { ErrorScreen } from '@/components/error/error-screen';

export function InsufficientPermissionScreen() {
  return (
    <ErrorScreen title="권한 부족">
      이 페이지에 접근할 수 없습니다 ):
    </ErrorScreen>
  );
}
