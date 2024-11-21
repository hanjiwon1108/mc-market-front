import {
  AlignStartVerticalIcon,
  ArmchairIcon,
  BlocksIcon,
  BoltIcon,
  BoxesIcon,
  BuildingIcon,
  CarFrontIcon,
  ChartNoAxesGanttIcon,
  CompassIcon,
  Grid2x2Icon,
  LucideIcon,
  MapIcon,
  MessageSquareMoreIcon,
  PackageIcon,
  PenToolIcon,
  Rows4Icon,
  ScrollTextIcon,
  ShapesIcon,
  SquirrelIcon,
  ThumbsUpIcon,
  UserRoundPenIcon,
  ViewIcon,
  WandSparklesIcon,
} from 'lucide-react';

export type Category = {
  path: string;
  name: string;
  link?: string;
  subcategories: Record<string, [string, string, LucideIcon]>;
  hiddenOnNavigator?: boolean;
  icon: LucideIcon;
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
  subcategories: {},
  hiddenOnNavigator: true,
  icon: Rows4Icon,
};

export const CATEGORY_MODELING: Category = {
  path: 'categories.modeling',
  name: '모델링',
  link: '/categories/modeling',
  subcategories: {
    items: ['/categories/modeling/items', '아이템/도구', PenToolIcon],
    furniture: ['/categories/modeling/furniture', '가구', ArmchairIcon],
    blocks: ['/categories/modeling/blocks', '커스텀 블록', BlocksIcon],
  },
  icon: BoxesIcon,
};

export const CATEGORY_BUILDS: Category = {
  path: 'categories.builds',
  name: '건축',
  link: '/categories/builds',
  subcategories: {
    lobby: ['/categories/builds/lobby', '로비', BoltIcon],
    dungeon: ['/categories/builds/dungeon', '던전', CompassIcon],
    maps: ['/categories/builds/maps', '맵', MapIcon],
    schematics: ['/categories/builds/schematics', '스케마틱', ScrollTextIcon],
  },
  icon: BuildingIcon,
};

export const CATEGORY_ENTITIES: Category = {
  path: 'categories.entity',
  name: '엔티티',
  link: '/categories/entity',
  subcategories: {
    boss: ['/categories/entity/boss', '보스', BoltIcon],
    mobs: ['/categories/entity/mobs', '몹', CompassIcon],
    pets: ['/categories/entity/pets', '펫', MapIcon],
    vehicles: ['/categories/entity/vehicles', '탈것', CarFrontIcon],
    chest: ['/categories/entity/chest', '상자', PackageIcon],
  },
  icon: SquirrelIcon,
};

export const CATEGORY_PIXELS: Category = {
  path: 'categories.pixels',
  name: '픽셀',
  link: '/categories/pixels',
  subcategories: {
    chat: ['/categories/pixels/chat', '채팅', MessageSquareMoreIcon],
    icons: ['/categories/pixels/icons', '아이콘', ShapesIcon],
    gui: ['/categories/pixels/gui', 'GUI', AlignStartVerticalIcon],
    overlay: [
      '/categories/pixels/overlay',
      '오버레이/HUD',
      ChartNoAxesGanttIcon,
    ],
    shaders: ['/categories/pixels/shaders', '쉐이더', ViewIcon],
    skins: ['/categories/pixels/skins', '스킨', UserRoundPenIcon],
  },
  icon: Grid2x2Icon,
};

export const CATEGORY_FREE: Category = {
  path: 'categories.free',
  name: '무료',
  link: '/categories/free',
  subcategories: {},
  icon: ThumbsUpIcon,
};

export const CATEGORY_SCRIPTS: Category = {
  path: 'categories.scripts',
  name: '스크립트',
  link: '/categories/scripts',
  subcategories: {},
  icon: ScrollTextIcon,
};

export const CATEGORY_PLUGINS: Category = {
  path: 'categories.plugins',
  name: '플러그인',
  link: '/categories/plugins',
  subcategories: {},
  icon: BlocksIcon,
};

export const CATEGORY_SKILL: Category = {
  path: 'categories.skill',
  name: '스킬',
  link: '/categories/skills',
  subcategories: {},
  icon: WandSparklesIcon,
};

export const CATEGORY_SKINS: Category = {
  path: 'categories.skins',
  name: '스킨',
  link: '/categories/skins',
  subcategories: {},
  icon: UserRoundPenIcon,
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
