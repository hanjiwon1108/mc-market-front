'use client';

import React, { useContext, useRef } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{props.children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}
