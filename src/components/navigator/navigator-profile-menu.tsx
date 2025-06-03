import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, SettingsIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { createBrowserSurgeClient } from '@/api/surge';
import { toast } from 'sonner';
import React from 'react';
import { useSettingsDialog } from '@/features/settings';
import { useMapleUser } from '@/api/market/context';
import { UserAvatar } from '@/components/user/avatar';
import { cn } from '@/lib/utils';

export function NavigatorProfileMenu() {
  const settings = useSettingsDialog();
  const user = useMapleUser();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          className="size-10 rounded-full p-0 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow" 
          variant="ghost"
        >
          {user && <UserAvatar userId={user?.id} className="w-full h-full" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1 rounded-md shadow-lg">
        <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
          <div className="flex select-none items-center gap-2 font-semibold">
            {user?.cash}원
            <CreditCardIcon className="text-primary" size={16} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          onClick={() => {
            settings.open();
          }}
        >
          <SettingsIcon className="text-gray-600 dark:text-gray-400" size={16} />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 p-3 rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200"
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
          <LogOutIcon size={16} />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
