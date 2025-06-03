import Link from 'next/link';
import { ChildrenProps } from '@/util/types-props';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FooterItem({
  children,
  icon,
  href,
}: ChildrenProps & { icon: LucideIcon; href?: string }) {
  const Icon = icon;
  const router = useRouter();

  // If href is not provided, use a div with onClick instead of Link
  const Component = href ? Link : 'div';

  // Handle click for div component
  const handleClick = () => {
    if (!href) return;
    router.push(href);
  };

  // Props for either Link or div
  const componentProps = href ? { href } : { onClick: handleClick };

  return (
    <Component
      {...componentProps}
      className="group flex w-min select-none items-center gap-2 whitespace-nowrap text-lg"
    >
      <span className="transition-all group-hover:scale-95 group-hover:opacity-65">
        {children}
      </span>
      <Icon className="text-2xl transition-transform group-hover:rotate-[10deg]" />
    </Component>
  );
}
