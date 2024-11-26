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
import { NavigatorEventItem } from '@/components/navigator/navigator-event-item';
import { Input } from '@/components/ui/input';
import {
  HomeIcon,
  MenuIcon,
  MessageCircleQuestionIcon,
  Rows4Icon,
  SearchIcon,
  TablePropertiesIcon,
  TicketIcon,
  UserRoundIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';
import { usePathname } from 'next/navigation';
import { createBrowserSurgeClient, useSession } from '@/api/surge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  NavigatorSidebar,
  NavigatorSidebarMenu,
} from '@/components/navigator/navigator-sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { CATEGORIES } from '@/features/category';
import {useSettingsDialog} from "@/features/settings";

export function Navigator() {
  const session = useSession();
  const pathname = usePathname();

  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const settings = useSettingsDialog();

  return (
    <>
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
            .filter((it) => !it.hiddenOnNavigator)
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
          display="이벤트"
          icon={TicketIcon}
          href="/events"
        />
        <NavigatorSidebarMenu
          display="고객센터"
          icon={MessageCircleQuestionIcon}
          href="supports"
        />
      </NavigatorSidebar>

      <div className="fixed z-50 flex h-[3.375rem] w-full items-center border-b-2 bg-background/80 p-2 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-center sm:justify-normal sm:px-8">
          <Button
            className="size-10 rounded-full p-0 sm:hidden"
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </Button>
          <Link href="/" className="absolute sm:static">
            <Logo className="w-32 sm:mr-12" />
          </Link>
          <NavigationMenu className="hidden max-w-full sm:flex">
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
          <div className="ml-auto mr-2">
            {!session ? (
              <Link href="/signin">
                <Button disabled={pathname == '/signin'}>로그인</Button>
              </Link>
            ) : (
              <>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="size-10 rounded-full p-0"
                      variant="ghost"
                    >
                      <UserRoundIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        settings.open()
                      }}
                    >
                      설정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        createBrowserSurgeClient()
                          .signOut()
                          .then((it) => {
                            if (it.error) {
                              toast.error('로그아웃에 실패했습니다');
                            } else {
                              toast.info('로그아웃 성공');
                            }
                          });
                      }}
                    >
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-[var(--navigator-height)]"></div>
    </>
  );
}
