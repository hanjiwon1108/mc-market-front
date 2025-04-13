import { MarketUser } from '@/api/types';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { EditCashDialog } from '@/app/admin/(panels)/users/edit-cash-dialog';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';

type updateUserDTO = {
  nickname?: string;
  permissions?: number;
  cash?: number;
};

export function UserRow({ user }: { user: MarketUser }) {
  const session = useSession();
  const [isEditCashDialogOpen, setEditCashDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingInfo, setUpdatingInfo] = useState<updateUserDTO>({
    nickname: user.nickname,
    permissions: user.permissions,
    cash: user.cash,
  });

  const deleteUser = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const response = await authFetch(
      session,
      endpoint(`/v1/user/delete/${user.id}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      toast.error('삭제 실패');
    } else {
      toast.success('삭제 완료');
    }
  };

  const updateUser = async () => {
    if (!confirm('정말 수정하시겠습니까?')) return;
    const response = await authFetch(session, endpoint(`/v1/user/${user.id}`), {
      method: 'POST',
      body: JSON.stringify({
        ...updatingInfo,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      toast.error('업데이트 실패');
    } else {
      toast.success('업데이트 완료');
      setUpdating(false);
    }
  };

  return (
    <>
      <EditCashDialog
        isOpen={isEditCashDialogOpen}
        onOpenChange={setEditCashDialogOpen}
        user={user}
      />
      <TableRow key={user.id}>
        <TableCell>{user.id}</TableCell>
        <TableCell>
          {updating ? (
            <input
              type="text"
              value={updatingInfo.nickname}
              onChange={(e) =>
                setUpdatingInfo({ ...updatingInfo, nickname: e.target.value })
              }
              onBlur={() => {
                updateUser();
                setUpdating(false);
              }}
            />
          ) : (
            <span onClick={() => setUpdating(true)}>{user.nickname}</span>
          )}
        </TableCell>
        <TableCell>{user.created_at.toLocaleString()}</TableCell>
        <TableCell>{user.updated_at.toLocaleString()}</TableCell>
        <TableCell>
          {updating ? (
            <input
              type="number"
              value={updatingInfo.permissions}
              onChange={(e) =>
                setUpdatingInfo({
                  ...updatingInfo,
                  permissions: parseInt(e.target.value),
                })
              }
              onBlur={() => {
                updateUser();
                setUpdating(false);
              }}
            />
          ) : (
            <span onClick={() => setUpdating(true)}>{user.permissions}</span>
          )}
        </TableCell>
        <TableCell>{user.cash}</TableCell>
        <TableCell>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditCashDialogOpen(true)}>
                캐시 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (updating) {
                    updateUser();
                  } else {
                    setUpdating(true);
                  }
                }}
              >
                정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteUser}>
                유저 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
