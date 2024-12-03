import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserRoundIcon } from 'lucide-react';
import { createBrowserSurgeClient } from '@/api/surge';
import { toast } from 'sonner';
import React from 'react';
import { useSettingsDialog } from '@/features/settings';

export function NavigatorProfileMenu() {
  const settings = useSettingsDialog();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="size-10 rounded-full p-0" variant="ghost">
          <UserRoundIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            settings.open();
          }}
        >
          설정
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            createBrowserSurgeClient()
              .signOut()
              .then((it) => {
                if (it.error) {
                  toast.error('로그아웃에 실패했습니다');
                } else {
                  toast.info('로그아웃 성공');
                }
              });
          }}
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
