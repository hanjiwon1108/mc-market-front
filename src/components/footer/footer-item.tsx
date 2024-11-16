import Link from 'next/link';
import { ChildrenProps } from '@/util/types-props';
import { LucideIcon } from 'lucide-react';

export function FooterItem({
  children,
  icon,
  href,
}: ChildrenProps & { icon: LucideIcon; href?: string }) {
  const Icon = icon;

  return (
    <Link
      href={href ?? '/'}
      className="group flex w-min select-none items-center gap-2 whitespace-nowrap text-lg"
    >
      <span className="transition-all group-hover:scale-95 group-hover:opacity-65">
        {children}
      </span>
      <Icon className="text-2xl transition-transform group-hover:rotate-[10deg]" />
    </Link>
  );
}
