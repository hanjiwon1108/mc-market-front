import React from 'react';
import Image, { ImageProps } from 'next/image';

export const Logo = React.forwardRef<
  HTMLImageElement,
  Omit<ImageProps, 'src' | 'alt'>
>((props, ref) => {
  return (
    <Image
      {...props}
      ref={ref}
      src="/logo.png"
      alt="Logo"
      width={411}
      height={110}
    />
  );
});

Logo.displayName = 'Logo';
