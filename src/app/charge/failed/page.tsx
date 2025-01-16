'use client';

import { ErrorScreen } from '@/components/error/error-screen';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <ErrorScreen title="결제 실패">
      결제에 실패했습니다.
      <br />
      <br />
      코드: {errorCode}
      <br />
      메시지: {errorMessage}
    </ErrorScreen>
  );
}
