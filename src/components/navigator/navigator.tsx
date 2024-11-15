import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import React from 'react';
import { NavigatorHomeItem } from '@/components/navigator/navigator-home-item';
import { NavigatorCategoryItem } from '@/components/navigator/navigator-category-item';
import { NavigatorEventItem } from '@/components/navigator/navigator-event-item';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

export function Navigator() {
  return (
    <>
      <div className="fixed h-[3.375rem] border-b-2 p-2 backdrop-blur-2xl bg-background/80 w-full">
        <NavigationMenu className="max-w-full">
          <NavigationMenuList>
            <NavigatorHomeItem />
            <NavigatorCategoryItem />
            <NavigatorEventItem />
            <NavigationMenuItem>
              <Link href="/supports" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  고객센터
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <div className="mx-4 flex-1">
            <div className="flex max-w-96">
              <Input
                spellCheck={false}
                placeholder="제품 검색"
                className="rounded-r-none border-r-0"
              />
              <div className="flex size-9 items-center justify-center rounded-lg rounded-l-none border border-l-0">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </NavigationMenu>
      </div>
      <div className="h-[3.375rem]"></div>
    </>
  );
}
