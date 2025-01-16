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

export function UserRow({ user }: { user: MarketUser }) {
  const [isEditCashDialogOpen, setEditCashDialogOpen] = useState(false);
  return (
    <>
      <EditCashDialog
        isOpen={isEditCashDialogOpen}
        onOpenChange={setEditCashDialogOpen}
        user={user}
      />
      <TableRow key={user.id}>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.nickname}</TableCell>
        <TableCell>{user.created_at.toLocaleString()}</TableCell>
        <TableCell>{user.updated_at.toLocaleString()}</TableCell>
        <TableCell>{user.permissions}</TableCell>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
