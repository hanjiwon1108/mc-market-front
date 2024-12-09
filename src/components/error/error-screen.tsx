import React from 'react';

export const ErrorScreen = React.forwardRef<
  HTMLDivElement,
  {
    title: React.ReactNode;
    children: React.ReactNode;
  }
>(({ title, children }) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div>
        <p className="text-5xl font-semibold">{title}</p>
        <p className="text-xl">{children}</p>
      </div>
    </div>
  );
});

ErrorScreen.displayName = 'ErrorScreen';
