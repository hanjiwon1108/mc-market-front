import { ChildrenProps } from '@/util/types-props';
// @ts-ignore-error
import { JSX } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

export function OptionalLink({
  children,
  href,
  ...props
}: ChildrenProps &
  Omit<LinkProps, 'href'> & {
    href?: string;
    component?: keyof JSX.IntrinsicElements;
  }) {
  const router = useRouter();

  // If we're already inside a Link or anchor tag, we shouldn't wrap with another Link
  // Instead, use a div with onClick
  if (!href) {
    return <>{children}</>;
  }

  // Check if we're in a Link context - this is a simplified check
  // For a more robust solution, you might want to use a React context
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
