import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';

export function NavigatorEventItem() {
  return (
    <NavigationMenuItem>
      <Link href="/events" legacyBehavior passHref>
        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-semibold')}>
          이벤트
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
