import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto min-h-full h-0 md:p-16">{children}</div>;
}
