import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { Rows4Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CATEGORIES, Category } from '@/features/category';
import { ChildrenProps } from '@/util/types-props';

function CategoryLink({ children, href }: ChildrenProps & { href?: string }) {
  if (href) {
    return (
      <Link legacyBehavior passHref href={href}>
        <NavigationMenuLink className="cursor-pointer select-none text-lg font-bold hover:underline">
          {children}
        </NavigationMenuLink>
      </Link>
    );
  } else {
    return <p className={'select-none text-lg font-bold'}>{children}</p>;
  }
}

function CategoryDisplay({ category }: { category: Category }) {
  return (
    <div>
      <CategoryLink href={category.link!}>{category.name}</CategoryLink>
      {Object.values(category.subcategories).map(([href, name, icon]) => {
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
        <div className="p-4 md:w-[400px] lg:w-[500px] xl:w-[48rem]">
          <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-[.75fr_1fr] xl:grid-cols-4">
            {Object.values(CATEGORIES)
              .filter((it) => !it.hiddenOnNavigator)
              .map((category) => (
                <CategoryDisplay key={category.path} category={category} />
              ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
