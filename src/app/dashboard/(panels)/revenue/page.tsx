'use client';

import useSWR from 'swr';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';

export default function Page() {
  const session = useSession();
  const revenues = useSWR(
    endpoint(`/v1/user/revenues`),
    (u) =>
      session &&
      authFetch(session, u).then(
        (it) => it.json() as Promise<{ count: number; total: number }>,
      ),
  );

  return (
    <div className="text-3xl">
      현재 귀하의 미정산 수익은 {revenues.data?.count}개의 거래로부터 {revenues.data?.total}원입니다.
    </div>
  );
}
