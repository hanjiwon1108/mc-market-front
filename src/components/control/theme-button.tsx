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
            Theme
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[5000]">
          <DropdownMenuCheckboxItem
            checked={theme == 'dark'}
            onClick={() => setTheme('dark')}
          >
            Dark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == 'light'}
            onClick={() => setTheme('light')}
          >
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme == 'system'}
            onClick={() => setTheme('system')}
          >
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

ThemeButton.displayName = "ThemeButton"