import { createAnimateVisibility } from '@/components/animate/animate-visibility';

export const AnimateScaleFade = createAnimateVisibility({
  visible: {
    scale: 1.0,
    opacity: 1,
  },
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
});
