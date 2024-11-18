import { motion, MotionProps, Variant } from 'framer-motion';
import React, { ComponentProps } from 'react';


export const AnimateFade = React.forwardRef<
  HTMLDivElement,
  MotionProps & ComponentProps<'div'>
>((props, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
      ref={ref}
    />
  );
});
AnimateFade.displayName = 'AnimateFade';
