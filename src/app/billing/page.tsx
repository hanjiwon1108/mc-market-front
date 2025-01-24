'use client';
import { useSession } from '@/api/surge';
import { ChargeCashDialog } from '@/components/charge/charge-cash-dialog';

export default function Page() {
  const session = useSession();
  if (!session) {
    return (
      <div className="flex h-screen justify-center">
        <div>
          <h1 className="text-5xl font-bold">403</h1>
          <p className="mt-4 text-xl">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChargeCashDialog
        isOpen={true}
        onOpenChange={() => window.history.back()}
      />
    </div>
  );
}
