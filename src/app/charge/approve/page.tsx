'use client';

import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { useSession } from '@/api/surge';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';

export default function Page() {
  const searchParams = useSearchParams();
  const session = useSession();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approveFailed, setApproveFailed] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  async function approve() {
    setApproving(true);

    try {
      const response = await authFetch(
        session,
        endpoint(`/v1/payments/${orderId}/approve`) + `?amount=${amount}`,
        {
          method: 'POST',
        },
      );

      setApproving(false);

      if (!response.ok) {
        const json = await response.json();
        toast.error('결제 승인 실패');
        setApproveFailed(true);
        setApproveError(`${json.code} | ${json.message}`);
        return;
      }

      setApproved(true);
    } catch (error) {
      toast.error(`요청 실패: ${error}`);
    }
  }

  return (
    <>
      <ResponsiveDialog isOpen={approveFailed} onOpenChange={setApproveFailed}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>결제 승인 실패</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              결제 승인 또는 캐시 업데이트가 실패했으며 결제가 취소되었습니다.
              <br />
              다시 시도하거나 관리자에게 문의하십시오. <br />
              코드 | 디테일: {approveError}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-4xl font-semibold">결제 승인</p>
        <p className="text-2xl">금액: {amount ?? '알 수 없음'}</p>
        <Button onClick={approve} disabled={approved || approving} size="lg">
          {approved
            ? '결제 승인됨'
            : approving
              ? '결제 승인 중...'
              : '결제를 승인합니다'}
        </Button>
      </div>
    </>
  );
}
