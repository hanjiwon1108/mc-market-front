import { BanIcon, BookTextIcon } from 'lucide-react';
import { FooterItem } from '@/components/footer/footer-item';

export function Footer() {
  return (
    <div className="relative size-full border-t-2 overflow-y-scroll">
      <div className="container mx-auto flex-col p-8 sm:p-16">
        <div className="flex justify-center">
          {/*<Logo className="!h-min scale-125 cursor-pointer" />*/}
        </div>

        <div className="grid grid-flow-row">
          <FooterItem href="/docs/privacy" icon={BanIcon}>
            개인 정보 처리 방침
          </FooterItem>
          <FooterItem href="/docs/tos" icon={BookTextIcon}>
            서비스 이용 약관
          </FooterItem>
        </div>
      </div>
    </div>
  );
}
