import { ChildrenProps } from '@/core/types/props';

export function SettingsPage({ children }: ChildrenProps) {
  return <div className="size-full p-4 flex flex-col gap-4">{children}</div>;
}
