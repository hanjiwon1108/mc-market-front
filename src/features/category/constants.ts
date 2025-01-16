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

const category = (
  path: string,
  link: string,
  displayName: string,
  icon: LucideIcon,
) => {
  return {
    path: path,
    link: link,
    name: displayName,
    subcategories: {},
    icon: icon,
  } as Category;
};

export type Category<T extends string | undefined = undefined> = {
  path: string;
  name: string;
  link?: string;
  subcategories: Record<T extends string ? T : string, Category>;
  hidden?: boolean;
  selectForbidden?: boolean;
  icon: LucideIcon;
};

export const CATEGORY_ALL: Category = {
  path: 'all',
  name: '전체',
  link: '/categories/all',
  subcategories: {},
  hidden: true,
  icon: Rows4Icon,
};

export const CATEGORY_MINECRAFT: Category<
  'plugins' | 'scripts' | 'modeling' | 'builds'
> = {
  path: 'minecraft',
  name: 'Minecraft',
  link: '/categories/minecraft',
  subcategories: {
    plugins: category(
      'minecraft.plugins',
      '/categories/minecraft/plugins',
      '플러그인',
      BlocksIcon,
    ),
    scripts: category(
      'minecraft.scripts',
      '/categories/minecraft/scripts',
      '스크립트',
      ScrollTextIcon,
    ),
    modeling: category(
      'minecraft.modeling',
      '/categories/minecraft/blocks',
      '모델링',
      ViewIcon,
    ),
    builds: category(
      'minecraft.builds',
      '/categories/minecraft/builds',
      '건축',
      BoltIcon,
    ),
  } as const,
  icon: BoxesIcon,
} as const;

export const CATEGORY_DISCORD: Category = {
  path: 'discord',
  name: '디스코드',
  link: '/categories/discord',
  subcategories: {},
  icon: MessageSquareMoreIcon,
} as const;

export const CATEGORY_MISC: Category = {
  path: 'misc',
  name: '기타',
  link: '/categories/misc',
  subcategories: {},
  icon: ScrollTextIcon,
} as const;

export const CATEGORY_FREE: Category = {
  path: 'free',
  name: '무료',
  link: '/categories/free',
  subcategories: {},
  icon: BadgeDollarSignIcon,
} as const;

export const CATEGORIES = {
  all: CATEGORY_ALL,
  minecraft: CATEGORY_MINECRAFT,
  discord: CATEGORY_DISCORD,
  misc: CATEGORY_MISC,
  free: CATEGORY_FREE,
} as const;

type Subcategories<Type extends Category> =
  Type extends Category<infer X> ? X : never;

type SubcategoryPaths<K extends keyof typeof CATEGORIES> =
  K extends `${infer T}`
    ? T extends keyof typeof CATEGORIES
      ? `${T}.${NonNullable<Subcategories<(typeof CATEGORIES)[T]>>}`
      : never
    : never;

export type TopCategoryKey = keyof typeof CATEGORIES;

export type CategoryKey = TopCategoryKey | SubcategoryPaths<TopCategoryKey>;

export function categoryPaths(): [string, ...string[]] {
  return Object.entries(CATEGORIES)
    .filter(([, category]) => !category.hidden)
    .map(([subcategoryKey]) => subcategoryKey)
    .concat(Object.keys(CATEGORIES)) as [string, ...string[]];
}

export function subcategories() {
  return Object.values(CATEGORIES).flatMap((it) =>
    Object.entries(it.subcategories),
  );
}
export function resolveCategory(path: string) {
  for (const category of Object.values(CATEGORIES)) {
    if (category.path == path) {
      return category;
    }

    for (const subcategory of Object.values(category.subcategories)) {
      if (subcategory.path == path) {
        return subcategory;
      }
    }
  }
}

export function parentCategory(c: Category) {
  for (const category of Object.values(CATEGORIES)) {
    for (const subcategory of Object.values(category.subcategories)) {
      if (subcategory.path == c.path) {
        return category;
      }
    }
  }
}
