import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';

export function NavigatorEventItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        이벤트
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="min-w-64 p-4 rounded-md shadow-md">
          <div className="space-y-2">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'select-none w-full flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
              )}
            >
              <span>진행중인 이벤트</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                New
              </span>
            </NavigationMenuLink>

            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'select-none w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
              )}
            >
              지난 이벤트
            </NavigationMenuLink>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
