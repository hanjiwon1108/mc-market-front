import { ChildrenProps } from '@/util/types-props';
// @ts-ignore-error
import { JSX } from 'react';
import Link, { LinkProps } from 'next/link';

export function OptionalLink({
  children,
  href,
  ...props
}: ChildrenProps &
  Omit<LinkProps, 'href'> & {
    href?: string;
    component?: keyof JSX.IntrinsicElements;
  }) {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  } else {
    return <>{children}</>;
  }
}
