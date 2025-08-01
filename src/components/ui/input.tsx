import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onValueChange?: (v: string) => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onValueChange, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-1 ring-offset-foreground transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
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
Input.displayName = 'Input';

export { Input };
