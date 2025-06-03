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
} from '@/components/ui/sidebar';
import {
  HomeIcon,
  TablePropertiesIcon,
  Rows4Icon,
  NewspaperIcon,
  LayoutDashboardIcon,
  PackageIcon,
  CircleDollarSignIcon,
} from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/features/category';
import { cn } from '@/lib/utils';

export function NavigatorAside() {
  return (
    <div className="hidden md:block">
      <SidebarProvider>
        <Sidebar
          variant="inset"
          side="left"
          collapsible="icon"
          className="min-h-[calc(100vh-var(--navigator-height))] border-r"
        >
          <SidebarHeader>
            <h3 className="text-lg font-semibold">메뉴</h3>
          </SidebarHeader>

          <SidebarMenu>
            {/* Home button with link */}
            <Link href="/" className="w-full">
              <SidebarMenuButton icon={HomeIcon}>홈</SidebarMenuButton>
            </Link>

            <SidebarMenuSub icon={TablePropertiesIcon} label="카테고리">
              <Link href="/categories/all" className="w-full">
                <SidebarMenuSubButton className={cn('w-full justify-start')}>
                  모든 카테고리 보기
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
                          className={cn('w-full justify-start')}
                          icon={Icon}
                        >
                          {category.name}
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
                                  className={cn('w-full justify-start pl-6')}
                                  icon={SubIcon}
                                >
                                  {subcategory.name}
                                </SidebarMenuSubButton>
                              </Link>
                            );
                          },
                        )}
                    </SidebarMenuSubItem>
                  );
                })}
            </SidebarMenuSub>

            <SidebarSeparator />

            <SidebarMenuSub icon={LayoutDashboardIcon} label="판매자 대시보드">
              <Link href="/dashboard" className="w-full">
                <SidebarMenuSubButton
                  className={cn('w-full justify-start')}
                  icon={LayoutDashboardIcon}
                >
                  대시보드
                </SidebarMenuSubButton>
              </Link>
              <Link href="/dashboard/products" className="w-full">
                <SidebarMenuSubButton
                  className={cn('w-full justify-start')}
                  icon={PackageIcon}
                >
                  프로덕트
                </SidebarMenuSubButton>
              </Link>
              <Link href="/dashboard/revenue" className="w-full">
                <SidebarMenuSubButton
                  className={cn('w-full justify-start')}
                  icon={CircleDollarSignIcon}
                >
                  수익
                </SidebarMenuSubButton>
              </Link>
            </SidebarMenuSub>

            <Link href="/articles" className="w-full">
              <SidebarMenuButton icon={NewspaperIcon}>게시판</SidebarMenuButton>
            </Link>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
