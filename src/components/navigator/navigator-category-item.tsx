import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CATEGORIES, Category } from '@/features/category';
import { ChildrenProps } from '@/util/types-props';

function CategoryLink({ children, href }: ChildrenProps & { href?: string }) {
  if (href) {
    return (
      <Link legacyBehavior passHref href={href}>
        <NavigationMenuLink className="cursor-pointer select-none text-lg font-bold hover:underline hover:text-primary transition-colors duration-200">
          {children}
        </NavigationMenuLink>
      </Link>
    );
  } else {
    return <p className="select-none text-lg font-bold text-gray-700 dark:text-gray-300">{children}</p>;
  }
}

function CategoryDisplay({ category }: { category: Category }) {
  return (
    <div className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
      <CategoryLink href={category.link!}>{category.name}</CategoryLink>
      <div className="mt-2 space-y-1">
        {Object.values(category.subcategories).map((subcategory: Category) => {
          const Icon = subcategory.icon;

          return (
            <div key={subcategory.path}>
              {/* Fixed: Avoid nesting Link inside NavigationMenuLink */}
              <div
                onClick={() => (window.location.href = subcategory.link ?? '/')}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'flex w-full cursor-pointer items-center justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
                )}
              >
                <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                <p>{subcategory.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NavigatorCategoryItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">카테고리</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="p-4 md:w-[400px] lg:w-[500px] xl:w-[48rem]">
          <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-[.75fr_1fr] xl:grid-cols-4">
            {Object.values(CATEGORIES)
              .filter((it) => !it.hidden)
              .map((category) => (
                <CategoryDisplay key={category.path} category={category} />
              ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
