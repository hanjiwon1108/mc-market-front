import React from 'react';

export type ChildrenProps = {
  children?: React.ReactNode;
};

export type CustomDialogProps = {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
};
