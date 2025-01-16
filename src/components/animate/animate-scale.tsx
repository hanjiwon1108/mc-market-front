import { createAnimateVisibility } from '@/components/animate/animate-visibility';

export const AnimateScale = createAnimateVisibility({
  hidden: {
    scale: 0.9,
  },
  visible: {
    scale: 1,
  },
});
