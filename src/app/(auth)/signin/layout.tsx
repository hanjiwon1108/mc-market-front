import { Metadata } from 'next';
import { ChildrenProps } from '@/util/types-props';

export const metadata: Metadata = { title: 'MC-Market: 로그인' };

export default function Layout({ children }: ChildrenProps) {
  return <>{children}</>;
}
