import * as React from "react"
import { updateViewportCSSVariables, getViewportDimensions } from "@/util/browser"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const dimensions = getViewportDimensions()
      const mobile = dimensions.width < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      setIsInitialized(true)
      
      // CSS 변수 업데이트로 브라우저 크기 측정 개선
      updateViewportCSSVariables()
    }

    // 초기 체크
    checkMobile()

    // 미디어 쿼리 리스너 설정 (더 정확한 감지)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      updateViewportCSSVariables()
    }
    
    // 현대적인 브라우저용
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // 구형 브라우저 지원
      mql.addListener(onChange)
    }
    
    // 리사이즈 이벤트 (debounced)
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", checkMobile)

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", checkMobile)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return { isMobile, isInitialized }
}
