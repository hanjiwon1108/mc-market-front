import * as React from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    onValueChange?: (v: string) => void;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onValueChange, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-1 ring-offset-foreground transition-[all_150ms,width] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
        onChange={(e) => {
          if (onValueChange) onValueChange(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
