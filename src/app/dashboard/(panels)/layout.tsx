import { ChildrenProps } from '@/util/types-props';

export default function Layout({ children }: ChildrenProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg border p-2 shadow-lg w-dvw">
      {children}
    </div>
  );
}
