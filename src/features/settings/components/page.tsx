import { ChildrenProps } from '@/util/types-props';

export function SettingsPage({ children }: ChildrenProps) {
  return <div className="flex size-full flex-col gap-4 p-4">{children}</div>;
}
