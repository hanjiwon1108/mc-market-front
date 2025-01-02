import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import React, { useState } from 'react';
import { NavigatorHomeItem } from '@/components/navigator/navigator-home-item';
import { NavigatorCategoryItem } from '@/components/navigator/navigator-category-item';
import { Input } from '@/components/ui/input';
import {
  CreditCardIcon,
  HomeIcon,
  MenuIcon,
  NewspaperIcon,
  Rows4Icon,
  SearchIcon,
  ShoppingCartIcon,
  TablePropertiesIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { usePathname } from 'next/navigation';
import { useSession } from '@/api/surge';
import {
  NavigatorSidebar,
  NavigatorSidebarMenu,
} from '@/components/navigator/navigator-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { CATEGORIES } from '@/features/category';
import { NavigatorProfileMenu } from '@/components/navigator/navigator-profile-menu';
import { useCart } from '@/core/cart/atom';
import { useMapleUser } from '@/api/market/context';
import { ChargeCashDialog } from '@/components/charge/charge-cash-dialog';

export function Navigator() {
  const session = useSession();
  const pathname = usePathname();

  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChargeCashOpen, setChargeCashOpen] = useState(false);
  const cart = useCart();
  const user = useMapleUser();

  return (
    <>
      <ChargeCashDialog
        isOpen={isChargeCashOpen}
        onOpenChange={setChargeCashOpen}
      />

      <NavigatorSidebar
        isOpen={isSidebarOpen && isMobile}
        onOpenChange={setSidebarOpen}
      >
        <NavigatorSidebarMenu display="홈" icon={HomeIcon} href="/" />
        <NavigatorSidebarMenu display="카테고리" icon={TablePropertiesIcon}>
          <NavigatorSidebarMenu
            display={
              <>
                모든 카테고리 보기
                <Rows4Icon className="ml-auto" />
              </>
            }
            href="/categories/all"
          />
          {Object.values(CATEGORIES)
            .filter((it) => !it.hidden)
            .map((category) => {
              const Icon = category.icon;

              return (
                <NavigatorSidebarMenu
                  display={
                    <>
                      {category.name} <Icon className="ml-auto" />
                    </>
                  }
                  key={category.path}
                >
                  {Object.values(category.subcategories).length > 0 && (
                    <>
                      <NavigatorSidebarMenu
                        display="이 카테고리 보기"
                        icon={category.icon}
                        href={category.link}
                      />
                      {Object.values(category.subcategories).map(
                        (subcategory) => (
                          <NavigatorSidebarMenu
                            key={subcategory[0]}
                            display={subcategory[1]}
                            icon={subcategory[2]}
                            href={subcategory[0]}
                          />
                        ),
                      )}
                    </>
                  )}
                </NavigatorSidebarMenu>
              );
            })}
        </NavigatorSidebarMenu>
        <NavigatorSidebarMenu
          display="게시판"
          icon={NewspaperIcon}
          href="articles"
        />
      </NavigatorSidebar>

      <div className="fixed z-50 flex h-[3.375rem] w-dvw items-center border-b-2 bg-background/80 p-2 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-center sm:justify-normal sm:px-8">
          <Button
            className="size-10 rounded-full p-0 sm:hidden"
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </Button>
          <Link href="/" className="absolute sm:static">
            <Logo className="max-w-32 min-w-32 sm:mr-12" />
          </Link>
          <NavigationMenu className="hidden max-w-full sm:flex">
            <NavigationMenuList>
              <NavigatorHomeItem />
              <NavigatorCategoryItem />
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    크리에이터 대시보드
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/*<NavigatorEventItem />*/}
              <NavigationMenuItem>
                <Link href="/articles" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    게시판
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
            <div className="mx-auto hidden md:block">
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
          </NavigationMenu>

          <div className="mr-2 hidden md:block">
            {session && (
              <button
                onClick={() => setChargeCashOpen(true)}
                className="flex select-none items-center gap-2 font-semibold whitespace-nowrap"
              >
                {user?.cash}원
                <CreditCardIcon />
              </button>
            )}
          </div>
          <div>
            <Link href="/cart" className="mr-2">
              <Button className="size-10 rounded-full p-0" variant="ghost">
                <ShoppingCartIcon />
                {cart.value.length > 0 && (
                  <div className="absolute flex aspect-square size-4 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-foreground text-xs text-background">
                    {cart.value.length}
                  </div>
                )}
              </Button>
            </Link>
          </div>
          <div className="ml-auto mr-2">
            {!session ? (
              <Link href="/signin">
                <Button disabled={pathname == '/signin'}>로그인</Button>
              </Link>
            ) : (
              <>
                <NavigatorProfileMenu />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-[var(--navigator-height)]"></div>
    </>
  );
}
