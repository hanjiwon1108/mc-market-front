import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  HomeIcon,
  TablePropertiesIcon,
  NewspaperIcon,
  LayoutDashboardIcon,
  PackageIcon,
  CircleDollarSignIcon,
} from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/features/category';
import { cn } from '@/lib/utils';
import { useSession } from '@/api/surge';

function NavigatorAsideContent() {
  const session = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <>
      <SidebarHeader className="flex flex-row items-center justify-between">
        {!isCollapsed && <h3 className="text-lg font-semibold">메뉴</h3>}
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarMenu>
        {/* Home button with link */}
        <Link href="/" className="w-full">
          <SidebarMenuButton asChild>
            <span className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              {!isCollapsed && <span>홈</span>}
            </span>
          </SidebarMenuButton>
        </Link>

        {!isCollapsed && (
          <SidebarMenuSub>
            <div className="flex items-center gap-2 p-2">
              <TablePropertiesIcon className="h-4 w-4" />
              <span>카테고리</span>
            </div>

            <Link href="/categories/all" className="w-full">
              <SidebarMenuSubButton
                asChild
                className={cn('w-full justify-start')}
              >
                <span>모든 카테고리 보기</span>
              </SidebarMenuSubButton>
            </Link>

            {Object.values(CATEGORIES)
              .filter((it) => !it.hidden)
              .map((category) => {
                const Icon = category.icon;

                return (
                  <SidebarMenuSubItem key={category.path}>
                    <Link href={category.link ?? '#'} className="w-full">
                      <SidebarMenuSubButton
                        asChild
                        className={cn('w-full justify-start')}
                      >
                        <span>
                          <Icon className="h-4 w-4" />
                          {category.name}
                        </span>
                      </SidebarMenuSubButton>
                    </Link>

                    {Object.values(category.subcategories).length > 0 &&
                      Object.values(category.subcategories).map(
                        (subcategory) => {
                          const SubIcon = subcategory.icon;
                          return (
                            <Link
                              href={subcategory.link ?? '#'}
                              key={subcategory.path}
                              className="w-full"
                            >
                              <SidebarMenuSubButton
                                asChild
                                className={cn('w-full justify-start pl-6')}
                              >
                                <span>
                                  <SubIcon className="h-4 w-4" />
                                  {subcategory.name}
                                </span>
                              </SidebarMenuSubButton>
                            </Link>
                          );
                        },
                      )}
                  </SidebarMenuSubItem>
                );
              })}
          </SidebarMenuSub>
        )}

        {/* 판매자 대시보드 - 로그인한 사용자에게만 표시 */}
        {session && (
          <>
            <SidebarSeparator />
            {isCollapsed ? (
              // 접힌 상태에서는 아이콘만 표시
              <>
                <Link href="/dashboard" className="w-full">
                  <SidebarMenuButton asChild>
                    <span className="flex items-center justify-center">
                      <LayoutDashboardIcon className="h-4 w-4" />
                    </span>
                  </SidebarMenuButton>
                </Link>
                <Link href="/dashboard/products" className="w-full">
                  <SidebarMenuButton asChild>
                    <span className="flex items-center justify-center">
                      <PackageIcon className="h-4 w-4" />
                    </span>
                  </SidebarMenuButton>
                </Link>
                <Link href="/dashboard/revenue" className="w-full">
                  <SidebarMenuButton asChild>
                    <span className="flex items-center justify-center">
                      <CircleDollarSignIcon className="h-4 w-4" />
                    </span>
                  </SidebarMenuButton>
                </Link>
              </>
            ) : (
              // 펼친 상태에서는 전체 메뉴 표시
              <SidebarMenuSub>
                <div className="flex items-center gap-2 p-2">
                  <LayoutDashboardIcon className="h-4 w-4" />
                  <span>판매자 대시보드</span>
                </div>

                <Link href="/dashboard" className="w-full">
                  <SidebarMenuSubButton
                    asChild
                    className={cn('w-full justify-start')}
                  >
                    <span>
                      <LayoutDashboardIcon className="h-4 w-4" />
                      대시보드
                    </span>
                  </SidebarMenuSubButton>
                </Link>
                <Link href="/dashboard/products" className="w-full">
                  <SidebarMenuSubButton
                    asChild
                    className={cn('w-full justify-start')}
                  >
                    <span>
                      <PackageIcon className="h-4 w-4" />
                      프로덕트
                    </span>
                  </SidebarMenuSubButton>
                </Link>
                <Link href="/dashboard/revenue" className="w-full">
                  <SidebarMenuSubButton
                    asChild
                    className={cn('w-full justify-start')}
                  >
                    <span>
                      <CircleDollarSignIcon className="h-4 w-4" />
                      수익
                    </span>
                  </SidebarMenuSubButton>
                </Link>
              </SidebarMenuSub>
            )}
          </>
        )}

        <Link href="/articles" className="w-full">
          <SidebarMenuButton asChild>
            <span className="flex items-center gap-2">
              <NewspaperIcon className="h-4 w-4" />
              {!isCollapsed && <span>게시판</span>}
            </span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenu>
    </>
  );
}

export function NavigatorAside() {
  return (
    <div className="hidden md:block">
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          variant="inset"
          side="left"
          collapsible="icon"
          className="mt-[var(--navigator-height)] min-h-[calc(100vh-var(--navigator-height))] border-r"
        >
          <NavigatorAsideContent />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
