import { ChildrenProps } from '@/util/types-props';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';
import {
  CalendarIcon,
  CircleDollarSignIcon,
  HomeIcon,
  InboxIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { getSession } from '@/api/surge';
import { ErrorScreen } from '@/components/error/error-screen';

const items = [
  {
    title: '대쉬보드',
    url: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: '프로덕트',
    url: '/dashboard/products',
    icon: PackageIcon,
  },
  {
    title: '수익',
    url: '/dashboard/revenue',
    icon: CircleDollarSignIcon,
  },
];

export default async function Layout({ children }: ChildrenProps) {
  const session = await getSession();
  // if (!session) {
  //   return <ErrorScreen>인증 필요</ErrorScreen>;
  // }

  return (
    <div className="w-full overflow-hidden">
      <SidebarProvider>
        <Sidebar className="top-[3.375rem] z-0">
          <SidebarHeader></SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Creator 대쉬보드</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="mb-[3.375rem] w-full gap-4 transition-all md:p-16">
          <div className="mb-4 flex items-center gap-2 px-4 pt-4 text-2xl font-semibold transition-all md:p-0 md:text-5xl">
            <SidebarTrigger />
            판매자 대쉬보드
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
