import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import React, { ComponentProps, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { DialogTriggerProps } from '@radix-ui/react-dialog';
import { useIsMobile } from '@/hooks/use-mobile';

export function ResponsiveDialog({
  isOpen,
  onOpenChange,
  children,
  ...props
}: {
  isOpen?: boolean;
  onOpenChange?: (v: boolean) => void;
  children?: React.ReactNode;
} & ComponentProps<typeof Drawer>) {
  const desktop = !useIsMobile();
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) setTimeout(safeToRemove, 500);
  }, [isPresent, safeToRemove]);

  return (
    <>
      {desktop ? (
        <Dialog open={isPresent && isOpen} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer
          open={isPresent && isOpen}
          onOpenChange={onOpenChange}
          {...props}
        >
          {children}
        </Drawer>
      )}
    </>
  );
}

export const ResponsiveDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & DialogTriggerProps
>((props, ref) => {
  return !useIsMobile() ? (
    <DialogTrigger {...props} ref={ref} />
  ) : (
    <DrawerTrigger {...props} ref={ref} />
  );
});
ResponsiveDialogTrigger.displayName = 'ResponsiveDialogTrigger';

export const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  ComponentProps<'div'>
>((props, ref) => {
  return !useIsMobile() ? (
    <DialogContent {...props} ref={ref} />
  ) : (
    <DrawerContent {...props} ref={ref} />
  );
});
ResponsiveDialogContent.displayName = 'ResponsiveDialogContent';

export function ResponsiveDialogHeader(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return !useIsMobile() ? (
    <DialogHeader {...props} />
  ) : (
    <DrawerHeader {...props} />
  );
}
ResponsiveDialogHeader.displayName = 'ResponsiveDialogHeader';

export function ResponsiveDialogFooter(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return !useIsMobile() ? (
    <DialogFooter {...props} />
  ) : (
    <DrawerFooter {...props} />
  );
}
ResponsiveDialogFooter.displayName = 'ResponsiveDialogFooter';

export const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h2'>
>((props, ref) => {
  return !useIsMobile() ? (
    <DialogTitle {...props} ref={ref} />
  ) : (
    <DrawerTitle {...props} ref={ref} />
  );
});
ResponsiveDialogTitle.displayName = 'ResponsiveDialogTitle';

export const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>((props, ref) => {
  return !useIsMobile() ? (
    <DialogDescription {...props} ref={ref} />
  ) : (
    <DrawerDescription {...props} ref={ref} />
  );
});
ResponsiveDialogDescription.displayName = 'ResponsiveDialogDescription';

export const ResponsiveDialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>((props, ref) => {
  return !useIsMobile() ? (
    <DialogClose {...props} ref={ref} />
  ) : (
    <DrawerClose {...props} ref={ref} />
  );
});
ResponsiveDialogClose.displayName = 'ResponsiveDialogClose';
