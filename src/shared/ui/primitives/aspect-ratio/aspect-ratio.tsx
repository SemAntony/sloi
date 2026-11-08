import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { cn } from '../../../lib/cn/cn';
import styles from './aspect-ratio.module.scss';

export const AspectRatio = forwardRef<
  ComponentRef<typeof AspectRatioPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(styles.aspectRatioRoot, className)}
    {...props}
  />
));

AspectRatio.displayName = 'AspectRatio';
