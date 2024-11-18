import { createAnimateVisibility } from '@/components/animate/animate-visibility';

export const AnimateHeight = createAnimateVisibility({
  visible: {
    height: 'auto',
    opacity: 1,
  },
  hidden: {
    height: '0',
    opacity: 0,
  },
});

export const AnimateWidth = createAnimateVisibility({
  visible: {
    width: 'auto',
    opacity: 1,
  },
  hidden: {
    width: '0',
    opacity: 0,
  },
});
