import { BanIcon, BookTextIcon } from 'lucide-react';
import { FooterItem } from '@/components/footer/footer-item';

export function Footer() {
  return (
    <div className="relative size-full border-t-2 bg-background">
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

        <div className="mt-4 text-sm text-foreground/60">
          MC-Market│경상북도 포항시 남구 오천읍 원리 893-15│대표 : 도우진
          <br />
          사업자등록번호 : 705-51-00733│통신판매업신고 : 2022-경북포항-0572
        </div>
      </div>
    </div>
  );
}
