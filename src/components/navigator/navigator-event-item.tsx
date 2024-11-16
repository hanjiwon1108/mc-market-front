import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';

export function NavigatorEventItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>이벤트</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="min-w-64 p-4">
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} select-none`}
          >
            이벤트
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
