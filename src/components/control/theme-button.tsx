import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, ButtonProps } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import React, { ComponentProps } from 'react';

export const ThemeButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { theme, setTheme } = useTheme();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button {...props} ref={ref}>
            테마
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[5000]">
          <DropdownMenuCheckboxItem
            checked={theme == 'dark'}
            onClick={() => setTheme('dark')}
          >
            다크
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == 'light'}
            onClick={() => setTheme('light')}
          >
            라이트
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == 'system'}
            onClick={() => setTheme('system')}
          >
            환경
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

ThemeButton.displayName = "ThemeButton"