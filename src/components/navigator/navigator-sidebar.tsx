import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Logo } from '@/components/brand/logo';
import { ChildrenProps } from '@/util/types-props';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimateHeight } from '@/components/animate/animate-size';
import { OptionalLink } from '@/components/util/optional-link';
import { ChevronDownIcon, LucideIcon, Rows4Icon } from 'lucide-react';

const NavigatorSidebarContext = createContext<{
  onOpenChange: (v: boolean) => void;
}>({ onOpenChange: () => {} });

export type NavigatorSidebarProps = ChildrenProps & {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
};

export function NavigatorSidebarMenu({
  children,
  href,
  display,
  icon,
}: ChildrenProps & {
  href?: string;
  display: React.ReactNode;
  icon?: LucideIcon;
}) {
  const [expand, setExpand] = useState(false);
  const context = useContext(NavigatorSidebarContext);

  const Icon = icon;

  return (
    <div>
      <OptionalLink href={href}>
        <Button
          variant={expand ? 'outline' : 'ghost'}
          onClick={() => {
            if (children) setExpand((p) => !p);
            else context.onOpenChange(false);
          }}
          className="flex w-full justify-start gap-2"
        >
          <ChevronDownIcon
            color="gray"
            className={children ? 'opacity-100' : 'opacity-0'}
          />
          {display}
          {Icon && <Icon className="ml-auto" />}
        </Button>
      </OptionalLink>

      {children && (
        <AnimatePresence>
          {expand && (
            <AnimateHeight className="overflow-y-scroll border-b shadow">
              <div className="m-2 flex flex-col gap-1">{children}</div>
            </AnimateHeight>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function NavigatorSidebar(props: NavigatorSidebarProps) {
  return (
    <NavigatorSidebarContext.Provider
      value={{ onOpenChange: props.onOpenChange }}
    >
      <Drawer open={props.isOpen} onOpenChange={props.onOpenChange}>
        <DrawerContent className="scrollbar-override flex max-h-[100dvh] flex-col outline-none">
          <DialogHeader>
            <DialogTitle className="flex justify-center py-2">
              <Logo className="w-24" />
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1 overflow-y-scroll p-2">
            {props.children}
          </div>
        </DrawerContent>
      </Drawer>
    </NavigatorSidebarContext.Provider>
  );
}
