import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';

export function NavigatorHomeItem() {
  return (
    <NavigationMenuItem>
      <Link href="/" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          홈
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
