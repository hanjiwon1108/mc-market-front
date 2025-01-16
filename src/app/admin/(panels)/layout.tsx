import { ChildrenProps } from '@/util/types-props';

export default function Layout({ children }: ChildrenProps) {
  return (
    <div className="flex flex-1 flex-col md:rounded-lg md:border p-2 md:shadow-lg">
      {children}
    </div>
  );
}
