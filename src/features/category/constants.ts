import {
  BadgeDollarSignIcon,
  BlocksIcon,
  BoltIcon,
  BoxesIcon,
  LucideIcon,
  MessageSquareMoreIcon,
  Rows4Icon,
  ScrollTextIcon,
  ViewIcon,
} from 'lucide-react';

export type Category = {
  path: string;
  name: string;
  link?: string;
  subcategories: Record<string, [string, string, LucideIcon]>;
  hiddenOnNavigator?: boolean;
  icon: LucideIcon;
};

export type CategoryKey = 'all' | 'minecraft' | 'discord' | 'misc' | 'free';

export const CATEGORY_ALL: Category = {
  path: 'all',
  name: '전체',
  link: '/categories/all',
  subcategories: {},
  hiddenOnNavigator: true,
  icon: Rows4Icon,
};

export const CATEGORY_MINECRAFT: Category = {
  path: 'minecraft',
  name: 'Minecraft',
  link: '/categories/minecraft',
  subcategories: {
    plugins: ['/categories/minecraft/plugins', '플러그인', BlocksIcon],
    scripts: ['/categories/minecraft/scripts', '스크립트', ScrollTextIcon],
    modeling: ['/categories/minecraft/blocks', '모델링', ViewIcon],
    builds: ['/categories/minecraft/builds', '건축', BoltIcon],
  },
  icon: BoxesIcon,
};

export const CATEGORY_DISCORD: Category = {
  path: 'categories.discord',
  name: '디스코드',
  link: '/categories/discord',
  subcategories: {},
  icon: MessageSquareMoreIcon,
};

export const CATEGORY_MISC: Category = {
  path: 'misc',
  name: '기타',
  link: '/categories/misc',
  subcategories: {},
  icon: ScrollTextIcon,
};

export const CATEGORY_FREE: Category = {
  path: 'categories.free',
  name: '무료',
  link: '/categories/free',
  subcategories: {},
  icon: BadgeDollarSignIcon,
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  all: CATEGORY_ALL,
  minecraft: CATEGORY_MINECRAFT,
  discord: CATEGORY_DISCORD,
  misc: CATEGORY_MISC,
  free: CATEGORY_FREE,
} as const;