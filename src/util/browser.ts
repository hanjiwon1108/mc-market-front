// 브라우저 화면 크기 측정 유틸리티
export function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;
  
  // 스크롤바 너비 계산
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.msOverflowStyle = 'scrollbar';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, actualWidth: 0, actualHeight: 0 };
  }

  const scrollbarWidth = getScrollbarWidth();
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    actualWidth: window.innerWidth - scrollbarWidth,
    actualHeight: window.innerHeight,
    scrollbarWidth,
    // 동적 viewport 지원 확인
    supportsDvh: CSS.supports('height', '100dvh'),
    supportsDvw: CSS.supports('width', '100dvw'),
  };
}

export function updateViewportCSSVariables() {
  if (typeof window === 'undefined') return;
  
  const dimensions = getViewportDimensions();
  const root = document.documentElement;
  
  root.style.setProperty('--scrollbar-width', `${dimensions.scrollbarWidth}px`);
  root.style.setProperty('--actual-viewport-width', `${dimensions.actualWidth}px`);
  root.style.setProperty('--window-inner-width', `${dimensions.width}px`);
  root.style.setProperty('--window-inner-height', `${dimensions.height}px`);
}

// 브라우저 타입 감지
export function getBrowserInfo() {
  if (typeof window === 'undefined') return { name: 'unknown', isMobile: false };
  
  const userAgent = window.navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  let browserName = 'unknown';
  if (userAgent.includes('Chrome')) browserName = 'chrome';
  else if (userAgent.includes('Firefox')) browserName = 'firefox';
  else if (userAgent.includes('Safari')) browserName = 'safari';
  else if (userAgent.includes('Edge')) browserName = 'edge';
  
  return { name: browserName, isMobile };
}

export function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.document !== 'undefined'
  );
}
