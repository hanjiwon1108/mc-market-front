import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';

export function NavigatorHomeItem() {
  return (
    <NavigationMenuItem>
      <Link href="/" legacyBehavior passHref>
        <NavigationMenuLink className={cn(
          navigationMenuTriggerStyle(),
          "font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        )}>
          홈
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
