import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import {
  AlignStartVerticalIcon,
  ArmchairIcon,
  BlocksIcon,
  BoltIcon,
  ChartNoAxesGanttIcon,
  CompassIcon,
  LucideIcon,
  MapIcon,
  MessageSquareMoreIcon,
  PenToolIcon,
  ScrollTextIcon,
  ShapesIcon,
  UserRoundPenIcon,
  ViewIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Category = {
  path: string;
  name: string;
  href?: string;
  links: [string, string, LucideIcon][];
};

const categories: Category[] = [
  {
    path: 'products.modeling',
    name: '모델링',
    href: '/products/modeling',
    links: [
      ['/products/modeling', '아이템/도구', PenToolIcon],
      ['/products/modeling2', '가구', ArmchairIcon],
      ['/products/modeling3', '커스텀 블록', BlocksIcon],
    ],
  },
  {
    path: 'products.builds',
    name: '건축',
    href: '/products/builds',
    links: [
      ['/products/modeling1', '로비', BoltIcon],
      ['/products/modeling2', '던전', CompassIcon],
      ['/products/modeling3', '맵', MapIcon],
      ['/products/modeling4', '스케마틱', ScrollTextIcon],
    ],
  },
  {
    path: 'products.entity',
    name: '엔티티',
    href: '/products/entity',
    links: [
      ['/products/modeling1', '보스', BoltIcon],
      ['/products/modeling2', '몹', CompassIcon],
      ['/products/modeling3', '펫', MapIcon],
      ['/products/modeling4', '탈것', ScrollTextIcon],
      ['/products/modeling5', '상자', ScrollTextIcon],
    ],
  },
  {
    path: 'products.pixels',
    name: '픽셀',
    href: '/products/pixels',
    links: [
      ['/products/modeling1', '채팅', MessageSquareMoreIcon],
      ['/products/modeling2', '아이콘', ShapesIcon],
      ['/products/modeling3', 'GUI', AlignStartVerticalIcon],
      ['/products/modeling4', '오버레이/HUD', ChartNoAxesGanttIcon],
      ['/products/modeling5', '쉐이더', ViewIcon],
      ['/products/modeling6', '스킨', UserRoundPenIcon],
    ],
  },
  {
    path: 'products.free',
    name: '무료',
    href: '/products/free',
    links: [],
  },
  {
    path: 'products.scripts',
    name: '스크립트',
    href: '/products/scripts',
    links: [],
  },
  {
    path: 'products.plugins',
    name: '플러그인',
    href: '/products/plugins',
    links: [],
  },
  {
    path: 'products.skill',
    name: '스킬',
    href: '/products/skills',
    links: [],
  },
  {
    path: 'products.skins',
    name: '스킨',
    href: '/products/skins',
    links: [],
  },
];

function CategoryDisplay({ category }: { category: Category }) {
  return (
    <div>
      <p className="text-lg font-bold">{category.name}</p>
      {category.links.map(([href, name, icon]) => {
        const Icon = icon;

        return (
          <div key={href}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'w-full justify-start gap-2',
                )}
              >
                <Icon size={20} />
                <p>{name}</p>
              </NavigationMenuLink>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function NavigatorCategoryItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>카테고리</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          {categories.map((category) => (
            <CategoryDisplay key={category.path} category={category} />
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
