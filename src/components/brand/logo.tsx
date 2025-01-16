import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = React.forwardRef<
  HTMLImageElement,
  Omit<ImageProps, 'src' | 'alt'>
>((props, ref) => {
  return (
    <Image
      {...props}
      className={cn('dark:invert', props.className)}
      ref={ref}
      src="/logo.png"
      alt="Logo"
      width={411}
      height={110}
    />
  );
});

Logo.displayName = 'Logo';
