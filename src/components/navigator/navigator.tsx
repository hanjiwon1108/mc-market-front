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
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/api/surge';
import {
  NavigatorSidebar,
  NavigatorSidebarMenu,
} from '@/components/navigator/navigator-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigatorProfileMenu } from '@/components/navigator/navigator-profile-menu';
import { useCart } from '@/core/cart/atom';
import { useMapleUser } from '@/api/market/context';
import { HomeIcon, NewspaperIcon, TablePropertiesIcon } from 'lucide-react';
import { CATEGORIES } from '@/features/category';

export function Navigator() {
  const session = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  const [searchKeywords, setSearchKeywords] = useState(
    searchParams.get('keywords') ?? '',
  );
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const cart = useCart();
  const user = useMapleUser();

  return (
    <>
      {/* Mobile Sidebar */}
      <NavigatorSidebar
        isOpen={isSidebarOpen && isMobile}
        onOpenChange={setSidebarOpen}
      >
        <NavigatorSidebarMenu display="홈" icon={HomeIcon} href="/" />
        <NavigatorSidebarMenu display="카테고리" icon={TablePropertiesIcon}>
          {Object.values(CATEGORIES)
            .filter((it) => !it.hidden)
            .map((category) => {
              const Icon = category.icon;
              return (
                <NavigatorSidebarMenu
                  display={category.name}
                  key={category.path}
                  icon={Icon}
                  href={category.link}
                />
              );
            })}
        </NavigatorSidebarMenu>
        <NavigatorSidebarMenu
          display="게시판"
          icon={NewspaperIcon}
          href="/articles"
        />
      </NavigatorSidebar>

      {/* Top Navigation Bar */}
      <div className="fixed z-50 flex h-[3.375rem] w-dvw items-center border-b-2 bg-background/80 p-2 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-center sm:justify-normal sm:px-8">
          {/* Mobile Menu Button */}
          <Button
            className="size-10 rounded-full p-0 sm:hidden"
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </Button>

          {/* Logo */}
          <Link href="/" className="absolute sm:static">
            <Logo className="min-w-32 max-w-32 sm:mr-12" />
          </Link>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden max-w-full sm:flex">
            <NavigationMenuList>
              {/* <NavigatorHomeItem />
              <NavigatorCategoryItem />
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    판매자 대시보드
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/articles" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    게시판
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Box (Desktop) */}
          <div className="mx-auto hidden md:block">
            <div className="mx-2 hidden min-w-0 max-w-96 transition-all lg:flex lg:min-w-[14rem]">
              <Input
                spellCheck={false}
                placeholder="제품 검색"
                className="peer rounded-r-none border-r-0"
                value={searchKeywords}
                onValueChange={setSearchKeywords}
                onKeyDown={(event) => {
                  if (event.key == 'Enter') {
                    router.push(
                      `/search?keywords=${encodeURIComponent(searchKeywords)}`,
                    );
                  }
                }}
              />
              <Button
                variant="outline"
                className="flex size-9 items-center justify-center rounded-lg rounded-l-none border-l-0 p-0 ring-ring ring-offset-foreground transition-all peer-focus-visible:ring-1"
                onClick={() => {
                  router.push(
                    `/search?keywords=${encodeURIComponent(searchKeywords)}`,
                  );
                }}
              >
                <SearchIcon size={16} />
              </Button>
            </div>
          </div>

          {/* Cash Display (Desktop) */}
          <Link href={'/billing'} className="mr-2 hidden md:block">
            {session && (
              <button className="flex select-none items-center gap-2 whitespace-nowrap font-semibold">
                {user?.cash}원
                <CreditCardIcon />
              </button>
            )}
          </Link>

          {/* Cart Link */}
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

          {/* Login/Profile Button */}
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

      {/* Spacer to push content below the fixed navigation bar */}
      <div className="h-[var(--navigator-height)]"></div>
    </>
  );
}
