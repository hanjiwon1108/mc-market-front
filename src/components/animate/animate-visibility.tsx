import React, { ComponentProps } from 'react';
import { motion, MotionProps, Variant } from 'framer-motion';
import { EASE_PRIMARY } from '@/util/ease';

type Props = MotionProps &
  ComponentProps<'div'> & {
    state: { hidden: Variant; visible: Variant };
    duration?: number;
  };

export const AnimateVisibility = React.forwardRef<HTMLDivElement, Props>(
  ({ state, ...props }, ref) => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          visible: state.visible,
          hidden: state.hidden,
        }}
        {...props}
        transition={{
          ease: EASE_PRIMARY,
          duration: props.duration,
          ...props.transition,
        }}
        ref={ref}
      />
    );
  },
);
AnimateVisibility.displayName = 'AnimatedVisibility';

export function createAnimateVisibility(state: {
  hidden: Variant;
  visible: Variant;
}) {
  // eslint-disable-next-line react/display-name
  return React.forwardRef<HTMLDivElement, Omit<Props, 'state'>>(
    (props, ref) => {
      return <AnimateVisibility state={state} {...props} ref={ref} />;
    },
  );
}
