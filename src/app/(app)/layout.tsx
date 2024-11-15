import { Navigator } from '@/components/navigator/navigator';
import { ChildrenProps } from '@/util/types-props';
import { Footer } from '@/components/footer/footer';

export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <div className="flex flex-col">
        <Navigator />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}
