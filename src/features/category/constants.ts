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

export type Category = {
  path: string;
  name: string;
  link?: string;
  subcategories: [string, string, LucideIcon][];
  hiddenOnNavigator?: boolean;
};

export type CategoryKey =
  | 'all'
  | 'modeling'
  | 'builds'
  | 'entities'
  | 'pixels'
  | 'free'
  | 'scripts'
  | 'plugins'
  | 'skill'
  | 'skins';

export const CATEGORY_ALL: Category = {
  path: 'categories.all',
  name: '전체',
  link: '/categories/all',
  subcategories: [],
  hiddenOnNavigator: true,
};

export const CATEGORY_MODELING: Category = {
  path: 'categories.modeling',
  name: '모델링',
  link: '/categories/modeling',
  subcategories: [
    ['/categories/modeling?filter=items', '아이템/도구', PenToolIcon],
    ['/categories/modeling?filter=furniture', '가구', ArmchairIcon],
    ['/categories/modeling?filter=blocks', '커스텀 블록', BlocksIcon],
  ],
};

export const CATEGORY_BUILDS: Category = {
  path: 'categories.builds',
  name: '건축',
  link: '/categories/builds',
  subcategories: [
    ['/categories/builds?filter=lobby', '로비', BoltIcon],
    ['/categories/builds?filter=dungeon', '던전', CompassIcon],
    ['/categories/builds?filter=maps', '맵', MapIcon],
    ['/categories/builds?filter=schematics', '스케마틱', ScrollTextIcon],
  ],
};

export const CATEGORY_ENTITIES: Category = {
  path: 'categories.entity',
  name: '엔티티',
  link: '/categories/entity',
  subcategories: [
    ['/categories/entity?filter=boss', '보스', BoltIcon],
    ['/categories/entity?filter=mobs', '몹', CompassIcon],
    ['/categories/entity?filter=pets', '펫', MapIcon],
    ['/categories/entity?filter=vehicles', '탈것', ScrollTextIcon],
    ['/categories/entity?filter=chest', '상자', ScrollTextIcon],
  ],
};

export const CATEGORY_PIXELS: Category = {
  path: 'categories.pixels',
  name: '픽셀',
  link: '/categories/pixels',
  subcategories: [
    ['/categories/pixels?filter=chat', '채팅', MessageSquareMoreIcon],
    ['/categories/pixels?filter=icons', '아이콘', ShapesIcon],
    ['/categories/pixels?filter=gui', 'GUI', AlignStartVerticalIcon],
    ['/categories/pixels?filter=overlay', '오버레이/HUD', ChartNoAxesGanttIcon],
    ['/categories/pixels?filter=shaders', '쉐이더', ViewIcon],
    ['/categories/pixels?filter=skins', '스킨', UserRoundPenIcon],
  ],
};

export const CATEGORY_FREE: Category = {
  path: 'categories.free',
  name: '무료',
  link: '/categories/free',
  subcategories: [],
};

export const CATEGORY_SCRIPTS: Category = {
  path: 'categories.scripts',
  name: '스크립트',
  link: '/categories/scripts',
  subcategories: [],
};

export const CATEGORY_PLUGINS: Category = {
  path: 'categories.plugins',
  name: '플러그인',
  link: '/categories/plugins',
  subcategories: [],
};

export const CATEGORY_SKILL: Category = {
  path: 'categories.skill',
  name: '스킬',
  link: '/categories/skills',
  subcategories: [],
};

export const CATEGORY_SKINS: Category = {
  path: 'categories.skins',
  name: '스킨',
  link: '/categories/skins',
  subcategories: [],
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  all: CATEGORY_ALL,
  modeling: CATEGORY_MODELING,
  builds: CATEGORY_BUILDS,
  entities: CATEGORY_ENTITIES,
  pixels: CATEGORY_PIXELS,
  free: CATEGORY_FREE,
  scripts: CATEGORY_SCRIPTS,
  plugins: CATEGORY_PLUGINS,
  skill: CATEGORY_SKILL,
  skins: CATEGORY_SKINS,
};
