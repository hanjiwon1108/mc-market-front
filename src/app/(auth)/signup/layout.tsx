import { ChildrenProps } from '@/util/types-props';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'MC-Market: 계정 생성' };

export default function Layout({ children }: ChildrenProps) {
  return <>{children}</>;
}
