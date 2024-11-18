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
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';

export function Navigator() {
  return (
    <>
      <div className="fixed z-50 h-[3.375rem] w-full border-b-2 bg-background/80 p-2 backdrop-blur-2xl">
        <div className="container mx-auto px-8">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList>
              <Link href="/">
                <Logo className="mr-12 w-32" />
              </Link>
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
            <div className="mx-auto">
              <div className="flex min-w-0 max-w-96 transition-all lg:min-w-[28rem]">
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
            <div className="mr-2">
              <Button>로그인</Button>
            </div>
          </NavigationMenu>
        </div>
      </div>

      <div className="h-[var(--navigator-height)]"></div>
    </>
  );
}
