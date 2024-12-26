import React, { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const ErrorScreen = React.forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    title?: React.ReactNode;
    children?: React.ReactNode;
  }
>(({ title = '오류', children = '오류가 발생했습니다', ...props }, ref) => {
  return (
    <div
      className={cn('flex flex-1 items-center justify-center', props.className)}
      ref={ref}
    >
      <div>
        <p className="text-5xl font-semibold">{title}</p>
        <p className="text-xl">{children}</p>
      </div>
    </div>
  );
});

ErrorScreen.displayName = 'ErrorScreen';
