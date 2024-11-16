import { ChildrenProps } from '@/util/types-props';
import { ComponentProps, JSX } from 'react';
import Link, { LinkProps } from 'next/link';

export function OptionalLink({
  children,
  href,
  component = 'div',
  ...props
}: ChildrenProps &
  Omit<LinkProps, 'href'> & {
    href?: string;
    component?: keyof JSX.IntrinsicElements;
  }) {
  const Component = component;
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  } else {
    return <Component>{children}</Component>;
  }
}
