import { MarketUser } from '@/api/types';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useSession } from '@/api/surge';

export function EditCashDialog({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  user: MarketUser;
}) {
  const session = useSession();
  const [cash, setCash] = useState(user.cash);

  const [isMutating, setMutating] = useState(false);

  function trigger() {
    if (!session) return;
    setMutating(true);
    authFetch(session, endpoint(`/v1/user/${user.id}`), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        cash,
      }),
    }).then((it) => {
      setMutating(false);
      if (it.ok) {
        toast.info('수정 업로드 완료');
      } else {
        toast.error('수정 업로드 실패!');
      }
    });
  }

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>유저 캐시 수정</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Input
          type="number"
          value={cash}
          onValueChange={(v) => setCash(Math.max(Number(v), 0))}
        />
        <div>기존: {user.cash}</div>
        <div>
          변경: {cash - user.cash > 0 ? `+${cash - user.cash}` : `${user.cash}`}
        </div>
        <ResponsiveDialogFooter>
          <Button onClick={trigger} disabled={isMutating}>
            수정
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
