import { Navigator } from '@/components/navigator/navigator';
import { ChildrenProps } from '@/util/types-props';
import { Footer } from '@/components/footer/footer';

export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <Navigator />
        <div className="flex-1">{children}</div>
      </div>
        <Footer/>
    </>
  );
}
