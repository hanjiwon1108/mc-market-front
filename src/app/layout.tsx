import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { ChildrenProps } from '@/util/types-props';
import { ClientProvider } from '@/app/client-provider';
import { APIProvider } from '@/components/api';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const pretendard = localFont({
  src: './fonts/PretendardVariable.ttf',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

// const globalFont = pretendard;

export const metadata: Metadata = {
  title: 'MC-Market',
  description: '마인크래프트 마켓플레이스',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<ChildrenProps & { modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${pretendard.variable} antialiased`}
      >
        <APIProvider>
          <ClientProvider modal={modal}>{children}</ClientProvider>
        </APIProvider>
      </body>
    </html>
  );
}
